/*
 * Copyright (c) 2002-2021 "Neo4j,"
 * Neo4j Sweden AB [http://neo4j.com]
 * This file is part of Neo4j.
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { withBus } from 'react-suber'
import { connect } from 'react-redux'
import uuid from 'uuid'
import MyScripts from 'browser/components/SavedScripts'

import * as editor from 'shared/modules/editor/editorDuck'
import {
  commandSources,
  executeCommand
} from 'shared/modules/commands/commandsDuck'
import * as favoritesDuck from 'shared/modules/favorites/favoritesDuck'
import * as foldersDuck from 'shared/modules/favorites/foldersDuck'
import {
  exportFavorites,
  exportFavoritesAsBigCypherFile
} from 'services/exporting/favoriteUtils'

const mapFavoritesStateToProps = (state: any) => {
  const folders = foldersDuck
    .getFolders(state)
    .filter(folder => !folder.isStatic)
  const scripts = favoritesDuck
    .getFavorites(state)
    .filter(script => !script.isStatic)

  return {
    folders,
    scripts,
    title: 'Local Scripts'
  }
}

const mapFavoritesDispatchToProps = (dispatch: any, ownProps: any) => ({
  selectScript: (favorite: favoritesDuck.Favorite) =>
    ownProps.bus.send(
      editor.EDIT_CONTENT,
      editor.editContent(favorite.id, favorite.content)
    ),
  execScript: (favorite: favoritesDuck.Favorite) =>
    dispatch(
      executeCommand(favorite.content, { source: commandSources.favorite })
    ),
  removeScripts: (ids: string[]) =>
    dispatch(favoritesDuck.removeFavorites(ids)),
  renameScript: (favorite: favoritesDuck.Favorite, name: string) => {
    if (favorite.id) {
      dispatch(favoritesDuck.renameFavorite(favorite.id, name))
    }
  },
  updateFolders(folders: foldersDuck.Folder[]) {
    dispatch(foldersDuck.updateFolders(folders))
  },
  createNewFolder() {
    dispatch(foldersDuck.addFolder(uuid.v4(), 'New Folder'))
  },
  dispatchRemoveFolderAndItsScripts(folderId: string, favoriteIds: string[]) {
    dispatch(foldersDuck.removeFolder(folderId))
    dispatch(favoritesDuck.removeFavorites(favoriteIds))
  },
  moveScript(favoriteId: string, folderId: string) {
    dispatch(favoritesDuck.moveFavorite(favoriteId, folderId))
  },
  createNewScript() {
    const id = uuid.v4()
    const content = `// Untitled favorite
`
    dispatch(favoritesDuck.addFavorite(content, id))
    ownProps.bus.send(editor.EDIT_CONTENT, editor.editContent(id, content))
  },
  exportScripts(
    favorites: favoritesDuck.Favorite[],
    folders: foldersDuck.Folder[]
  ) {
    exportFavorites(favorites, folders)
  },
  addScript(content: string) {
    dispatch(favoritesDuck.addFavorite(content))
  }
})

const mergeProps = (stateProps: any, dispatchProps: any) => {
  return {
    ...stateProps,
    ...dispatchProps,
    renameFolder: (folderToRename: foldersDuck.Folder, name: string) => {
      dispatchProps.updateFolders(
        stateProps.folders.map((folder: foldersDuck.Folder) =>
          folderToRename.id === folder.id ? { ...folder, name } : folder
        )
      )
    },
    removeFolder(folder: foldersDuck.Folder) {
      const scriptsToRemove = stateProps.scripts
        .filter((script: favoritesDuck.Favorite) => script.folder === folder.id)
        .map((script: favoritesDuck.Favorite) => script.id)
      dispatchProps.dispatchRemoveFolderAndItsScripts(
        folder.id,
        scriptsToRemove
      )
    }
  }
}

export default withBus(
  connect(
    mapFavoritesStateToProps,
    mapFavoritesDispatchToProps,
    mergeProps
  )(MyScripts)
)
