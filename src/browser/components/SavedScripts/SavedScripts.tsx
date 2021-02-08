/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import React from 'react'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import SavedScriptsFolder from './SavedScriptsFolder'
import { ExportButton, NewFolderButton } from './SavedScriptsButton'
import {
  SavedScriptsMain,
  SavedScriptsBody,
  SavedScriptsBodySection,
  SavedScriptsHeader,
  SavedScriptsButtonWrapper,
  SavedScriptsListItemDisplayName
} from './styled'
import { Favorite } from 'shared/modules/favorites/favoritesDuck'
import { Folder } from 'shared/modules/favorites/foldersDuck'
import SavedScriptsListItem from './SavedScriptsListItem'
import { getScriptDisplayName } from './utils'

interface SavedScriptsProps {
  title?: string
  scripts: Favorite[]
  folders: Folder[]
  selectScript: (script: Favorite) => void
  execScript: (script: Favorite) => void
  // When optional callbacks aren't provided, respective UI elements are hidden
  exportScripts?: (scripts: Favorite[], folders: Folder[]) => void
  renameScript?: (script: Favorite, name: string) => void
  moveScript?: (scriptId: string, folderId: string) => void
  removeScript?: (script: Favorite) => void
  renameFolder?: (folder: Folder, name: string) => void
  removeFolder?: (folder: Folder) => void
  createNewFolder?: () => void
  createNewScript?: () => void
}

export default function SavedScripts({
  title = 'Saved Scripts',
  scripts,
  folders,
  selectScript,
  createNewScript,
  execScript,
  renameScript,
  removeScript,
  moveScript,
  renameFolder,
  removeFolder,
  exportScripts,
  createNewFolder
}: SavedScriptsProps): JSX.Element {
  const scriptsOutsideFolder = scripts
    .filter(script => !script.folder)
    .sort(sortScriptsAlfabethically)

  const foldersWithScripts = folders.map(folder => ({
    folder,
    scripts: scripts
      .filter(script => script.folder === folder.id)
      .sort(sortScriptsAlfabethically)
  }))

  return (
    <SavedScriptsMain className="saved-scripts">
      <DndProvider backend={HTML5Backend}>
        <SavedScriptsBody className="saved-scripts__body">
          <SavedScriptsBodySection className="saved-scripts__body-section">
            <SavedScriptsHeader className="saved-scripts__header">
              {title}
              <SavedScriptsButtonWrapper className="saved-scripts__button-wrapper">
                {exportScripts && (
                  <ExportButton
                    onClick={() => exportScripts(scripts, folders)}
                  />
                )}
                {createNewFolder && (
                  <NewFolderButton onClick={createNewFolder} />
                )}
              </SavedScriptsButtonWrapper>
            </SavedScriptsHeader>

            {scriptsOutsideFolder.map(script => (
              <SavedScriptsListItem
                selectScript={selectScript}
                execScript={execScript}
                removeScript={removeScript}
                renameScript={renameScript}
                script={script}
                key={getUniqueScriptKey(script)}
              />
            ))}
            {createNewScript && (
              <SavedScriptsListItemDisplayName
                className="saved-scripts-list-item__display-name"
                onClick={createNewScript}
              >
                Create new favorite
              </SavedScriptsListItemDisplayName>
            )}
            {foldersWithScripts.map(({ folder, scripts }) => (
              <SavedScriptsFolder
                folder={folder}
                renameFolder={renameFolder}
                removeFolder={removeFolder}
                moveScript={moveScript}
                key={folder.id}
              >
                {scripts.map(script => (
                  <SavedScriptsListItem
                    selectScript={selectScript}
                    execScript={execScript}
                    removeScript={removeScript}
                    renameScript={renameScript}
                    script={script}
                    key={getUniqueScriptKey(script)}
                  />
                ))}
              </SavedScriptsFolder>
            ))}
          </SavedScriptsBodySection>
        </SavedScriptsBody>
      </DndProvider>
    </SavedScriptsMain>
  )
}

function getUniqueScriptKey(script: Favorite) {
  // static scripts don't have ids but their names are unique
  return script.id || getScriptDisplayName(script)
}

function sortScriptsAlfabethically(a: Favorite, b: Favorite) {
  const name1 = getScriptDisplayName(a).toLowerCase()
  const name2 = getScriptDisplayName(b).toLowerCase()
  return name1.localeCompare(name2)
}
