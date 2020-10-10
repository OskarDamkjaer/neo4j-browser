/*
 * Copyright (c) 2002-2020 "Neo4j,"
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

import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { withBus } from 'react-suber'
import { withTheme } from 'styled-components'
import { executeCommand } from 'shared/modules/commands/commandsDuck'
import { updateFavorite } from 'shared/modules/favorites/favoritesDuck'
import { Bus } from 'suber'
import {
  isMac,
  printShortcut,
  FULLSCREEN_SHORTCUT
} from 'browser/modules/App/keyboardShortcuts'
import {
  EDIT_CONTENT,
  EXPAND,
  SET_CONTENT
} from 'shared/modules/editor/editorDuck'
import {
  Frame,
  Header,
  EditorContainer,
  FlexContainer,
  ScriptTitle
} from './styled'
import { EditorButton, FrameButton } from 'browser-components/buttons'
import {
  ExpandIcon,
  ContractIcon,
  CloseIcon
} from 'browser-components/icons/Icons'
import pencil from 'icons/pencil.svg'
import controlsPlay from 'icons/controls-play.svg'
import Editor from './Editor'

function stripComment(str: string): string {
  if (str.startsWith('//')) {
    return str.slice(2)
  } else {
    return str
  }
}

type EditorFrameProps = {
  bus: Bus
  theme: { linkHover: string }
  executeCommand: (cmd: string) => void
  updateFavorite: (id: string, value: string) => void
}
type CodeEditor = {
  getValue: () => string | null
  setValue: (newText: string) => void
}

type SavedScript = {
  id: string
  content: string
  isProjectFile: boolean
}

export function EditorFrame({
  bus,
  theme,
  executeCommand,
  updateFavorite
}: EditorFrameProps): JSX.Element {
  const [unsaved, setUnsaved] = useState(false)
  const [isFullscreen, setFullscreen] = useState(false)
  const [currentlyEditing, setCurrentlyEditing] = useState<SavedScript | null>(
    null
  )
  const editorRef = useRef<CodeEditor>(null)

  function toggleFullscreen() {
    setFullscreen(!isFullscreen)
  }

  useEffect(() => bus && bus.take(EXPAND, toggleFullscreen))
  useEffect(
    () =>
      bus &&
      bus.take(EDIT_CONTENT, ({ message, id, isProjectFile }) => {
        setUnsaved(false)
        setCurrentlyEditing({ content: message, id, isProjectFile })
        editorRef.current?.setValue(message)
      })
  )

  useEffect(
    () =>
      bus &&
      bus.take(SET_CONTENT, msg => {
        setUnsaved(false)
        setCurrentlyEditing(null)
        editorRef.current?.setValue(msg)
      })
  )

  function discardEditor() {
    editorRef.current?.setValue('')
    setCurrentlyEditing(null)
  }

  const buttons = [
    {
      onClick: toggleFullscreen,
      title: `${
        isFullscreen ? 'Close fullscreen ' : 'Fullscreen'
      } (${printShortcut(FULLSCREEN_SHORTCUT)})`,
      icon: isFullscreen ? <ContractIcon /> : <ExpandIcon />,
      testId: 'fullscreen'
    },
    {
      onClick: discardEditor,
      title: 'Close',
      icon: <CloseIcon />,
      testId: 'discard'
    }
  ]

  const TypedEditor: any = Editor // delete this when editor is ts
  // DET ÄR NÅGOT MÄRKLIGT MED UPDATE FAVORITE

  return (
    <Frame fullscreen={isFullscreen}>
      {currentlyEditing && (
        <ScriptTitle unsaved={unsaved}>
          Editing{' '}
          {currentlyEditing.isProjectFile ? 'project file: ' : 'favorite: '}
          {stripComment(currentlyEditing.content.split('\n')[0])}
          {unsaved ? '*' : ''}
        </ScriptTitle>
      )}
      <FlexContainer>
        <Header>
          <EditorContainer>
            <TypedEditor
              editorRef={editorRef}
              onChange={() => setUnsaved(true)}
            />
          </EditorContainer>
          {currentlyEditing && (
            <EditorButton
              data-testid="editor-Favorite"
              onClick={() => {
                setUnsaved(false)
                updateFavorite(
                  currentlyEditing.id,
                  editorRef.current?.getValue() || ''
                )
              }}
              key={'editor-Favorite'}
              title={`Update ${
                currentlyEditing.isProjectFile ? 'project file' : 'favorite'
              }`}
              icon={pencil}
              width={16}
            />
          )}
          <EditorButton
            data-testid="editor-Run"
            onClick={() => executeCommand(editorRef.current?.getValue() || '')}
            title={isMac ? 'Run (⌘↩)' : 'Run (ctrl+enter)'}
            icon={controlsPlay}
            color={theme.linkHover}
            key="editor-Run"
            width={16}
          />
        </Header>
        {buttons.map(({ onClick, icon, title, testId }) => (
          <FrameButton
            key={`frame-${title}`}
            title={title}
            onClick={onClick}
            data-testid={`editor-${testId}`}
          >
            {icon}
          </FrameButton>
        ))}
      </FlexContainer>
    </Frame>
  )
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    updateFavorite: (id: string, cmd: string) => {
      dispatch(updateFavorite(id, cmd))
    },
    executeCommand: (cmd: string) => {
      dispatch(executeCommand(cmd))
    }
  }
}

export default withBus(
  connect(null, mapDispatchToProps)(withTheme(EditorFrame))
)
