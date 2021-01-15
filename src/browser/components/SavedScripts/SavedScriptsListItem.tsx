import React from 'react'
import { DragSource, DragElementWrapper, DragSourceOptions } from 'react-dnd'
import { FolderUpdate, Script } from './types'
import { getScriptDisplayName } from './utils'
import { useCustomBlur, useNameUpdate } from './hooks'
import { RemoveButton, RunButton, EditButton } from './SavedScriptsButton'
import {
  SavedScriptsButtonWrapper,
  SavedScriptsInput,
  SavedScriptsListItemDisplayName,
  SavedScriptsListItemMain
} from './styled'
import { Favorite } from 'shared/modules/favorites/favoritesDuck'

interface SavedScriptsListItemProps {
  script: Favorite
  isProjectFiles?: boolean
  selectScript: (script: Favorite) => void
  execScript: (script: Favorite) => void
  renameScript: (script: Favorite, name: string) => void
  removeScript: (script: Favorite) => void
}
type DragProp = {
  connectDragSource: DragElementWrapper<DragSourceOptions>
}

function SavedScriptsListItem({
  script,
  isProjectFiles,
  selectScript,
  execScript,
  renameScript,
  removeScript,
  connectDragSource
}: SavedScriptsListItemProps & DragProp) {
  const displayName = getScriptDisplayName(script)
  const [
    isEditing,
    nameValue,
    setIsEditing,
    setLabelInput
  ] = useNameUpdate(displayName, name => renameScript(script, name))
  const [blurRef] = useCustomBlur(() => setIsEditing(false))
  const canRunScript = !script.not_executable && !isEditing

  return (
    <SavedScriptsListItemMain ref={blurRef} className="saved-scripts-list-item">
      {isEditing ? (
        <SavedScriptsInput
          className="saved-scripts-list-item__name-input"
          type="text"
          autoFocus
          onKeyPress={({ key }) => {
            key === 'Enter' && setIsEditing(false)
          }}
          value={nameValue}
          onChange={({ target }) => setLabelInput(target.value)}
        />
      ) : (
        <SavedScriptsListItemDisplayName
          className="saved-scripts-list-item__display-name"
          data-testid={`scriptTitle-${displayName}`}
          onClick={() => (isProjectFiles || !isEditing) && selectScript(script)}
        >
          {connectDragSource(<span>{displayName}</span>)}
        </SavedScriptsListItemDisplayName>
      )}
      <SavedScriptsButtonWrapper className="saved-scripts__button-wrapper">
        {script.isStatic || isEditing ? (
          <RemoveButton onClick={() => removeScript(script)} />
        ) : (
          <EditButton onClick={() => setIsEditing(!isEditing)} />
        )}

        {canRunScript && <RunButton onClick={() => execScript(script)} />}
      </SavedScriptsButtonWrapper>
    </SavedScriptsListItemMain>
  )
}

export default DragSource<SavedScriptsListItemProps, DragProp>(
  props => props.script.id || props.script.content, //TODO Fix drag and drop
  {
    beginDrag: props => props.script
  },
  connect => ({
    connectDragSource: connect.dragSource()
  })
)(SavedScriptsListItem)
