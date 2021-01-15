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
import MyScripts from 'browser/components/SavedScripts'

import * as editor from 'shared/modules/editor/editorDuck'
import {
  commandSources,
  executeCommand
} from 'shared/modules/commands/commandsDuck'
import * as favoritesDuck from 'shared/modules/favorites/favoritesDuck'
import * as foldersDuck from 'shared/modules/favorites/foldersDuck'
import { exportFavorites } from 'shared/services/export-favorites'

import {
  generateFolderNameAndIdForPath,
  mapNewFavoritesToOld,
  getFirstFavorite,
  getFavoriteIds,
  getFolderFromPath,
  updateFolder
} from './favorites.utils'

const mapFavoritesStateToProps = (state: any) => {
  const folders = foldersDuck.getFolders(state)
  const scripts = favoritesDuck.getFavorites(state)

  return {
    scripts,
    folders,
    title: 'Local Scripts'
  }
}
// is suggestion är _exec grejen
// content contents
// path finns ej
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
  exportScripts: (scripts: any) => exportFavorites(scripts),
  removeScript: (favorite: favoritesDuck.Favorite) =>
    favorite.id && dispatch(favoritesDuck.removeFavorite(favorite.id)),
  updateFolder() {
    /* TODO implement */
  },
  renameScript: (favorite: favoritesDuck.Favorite, name: string) => {
    if (favorite.id) {
      dispatch(favoritesDuck.renameFavorite(favorite.id, name))
    }
  },
  moveScript: (favorite: favoritesDuck.Favorite, folder: string) => {
    if (favorite.id) {
      dispatch(favoritesDuck.moveFavorite(favorite.id, folder))
    }
  },
  removeFolder(folder: foldersDuck.Folder) {
    dispatch(foldersDuck.removeFolder(folder.id))
    // TODO kod för att ta bort alla som var i mappen
    // dispatch(favoritesDuck.removeFavorites(getFavoriteIds(favorites)))
  }
})

const mergeProps = (stateProps: any, dispatchProps: any) => {
  return {
    ...stateProps,
    ...dispatchProps,
    exportScripts: () => dispatchProps.exportScripts(stateProps.scripts),
    updateFolder: (favorites: any, payload: any) =>
      dispatchProps.updateFolder(favorites, payload, stateProps.folders)
  }
}

export default withBus(
  connect(
    mapFavoritesStateToProps,
    mapFavoritesDispatchToProps,
    mergeProps
  )(MyScripts)
)
