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
import { withBus } from 'react-suber'
import { withTheme } from 'styled-components'
import { Bus } from 'suber'
import {
  isMac,
  printShortcut,
  FULLSCREEN_SHORTCUT
} from 'browser/modules/App/keyboardShortcuts'
import { EXPAND, SET_CONTENT } from 'shared/modules/editor/editorDuck'
import { Frame, Header, EditorContainer } from './styled'
import { EditorButton, FrameButton } from 'browser-components/buttons'
import {
  ExpandIcon,
  ContractIcon,
  CloseIcon
} from 'browser-components/icons/Icons'
import controlsPlay from 'icons/controls-play.svg'
import ratingStar from 'icons/rating-star.svg'
import Editor from './Editor'

type EditorFrameProps = { bus: Bus; theme: { linkHover: string } }
type CodeEditor = {
  getValue: () => string | null
  setValue: (newText: string) => void
}

export function EditorFrame({ bus, theme }: EditorFrameProps): JSX.Element {
  const [isFullscreen, setFullscreen] = useState(false)
  const editorRef = useRef<CodeEditor>(null)

  function toggleFullscreen() {
    setFullscreen(!isFullscreen)
  }

  useEffect(() => bus && bus.take(EXPAND, toggleFullscreen))

  function discardEditor() {
    bus && bus.send(SET_CONTENT, { message: '' })
  }

  const execCurrent = () => {
    console.log('hej')
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

  return (
    <Frame fullscreen={isFullscreen}>
      <Header>
        <EditorContainer>
          <TypedEditor editorRef={editorRef} />
        </EditorContainer>
        {/* TODO:
           buttons don't work
         */}
        <EditorButton
          data-testid="editor-Favorite"
          onClick={execCurrent}
          title={isMac ? 'Run (⌘↩)' : 'Run (ctrl+enter)'}
          icon={ratingStar}
          key={`editor-Favorite`}
          width={16}
        />
        <EditorButton
          data-testid="editor-Run"
          onClick={execCurrent}
          title={isMac ? 'Run (⌘↩)' : 'Run (ctrl+enter)'}
          icon={controlsPlay}
          color={theme.linkHover}
          key={`editor-Run`}
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
    </Frame>
  )
}

export default withBus(withTheme(EditorFrame))
