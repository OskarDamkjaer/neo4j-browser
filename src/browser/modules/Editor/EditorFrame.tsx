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
import { useSpring, animated } from 'react-spring'
import { withBus } from 'react-suber'
import { Bus } from 'suber'
import {
  isMac,
  printShortcut,
  FULLSCREEN_SHORTCUT
} from 'browser/modules/App/keyboardShortcuts'
import { EXPAND, SET_CONTENT } from 'shared/modules/editor/editorDuck'
import {
  Frame,
  EditorWrapper,
  UIControls,
  AnimationContainer,
  Bar,
  Header
} from './styled'
import { EditorButton, FrameButton } from 'browser-components/buttons'
import {
  ExpandIcon,
  ContractIcon,
  CloseIcon,
  AddFavoriteButton
} from 'browser-components/icons/Icons'
import controlsPlay from 'icons/controls-play.svg'
import Editor from './Editor'

type EditorFrameProps = { bus: Bus }
type CodeEditor = {
  getValue: () => string | null
  setValue: (newText: string) => void
}

export function EditorFrame({ bus }: EditorFrameProps): JSX.Element {
  const [isFullscreen, setFullscreen] = useState(false)
  const editorRef = useRef<CodeEditor>(null)

  function toggleFullscreen() {
    setFullscreen(!isFullscreen)
  }

  useEffect(() => bus && bus.take(EXPAND, toggleFullscreen))

  function discardEditor() {
    isFullscreen && setFullscreen(false)
    bus && bus.send(SET_CONTENT, { message: '' })

    setAnimation({
      from: stable,
      //  @ts-expect-error, library typings are wrong....
      to: [end, start, stable],
      config
    })
  }

  const execCurrent = () => {
    console.log('hej')
  }
  const editorIsEmpty = false

  const buttons = [
    {
      onClick: execCurrent,
      icon: <AddFavoriteButton />,
      title: 'Favorite',
      testId: 'editor-Favorite'
    },
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

  const start = {
    width: '100%',
    position: 'unset',
    opacity: 0,
    top: -100,
    marginLeft: '0vw'
  }
  const stable = {
    width: '100%',
    position: 'unset',
    opacity: 1,
    top: 10,
    marginLeft: '0vw'
  }
  const end = {
    width: '100%',
    position: 'unset',
    opacity: 0,
    marginLeft: '-100vw',
    top: 10
  }

  const config = { mass: 1, tension: 180, friction: 24, clamp: true }

  const TypedEditor: any = Editor // delete this when editor is ts
  const [props, setAnimation] = useSpring(() => ({
    to: stable,
    config
  }))

  return (
    <AnimationContainer>
      <animated.div
        className="springContainer"
        style={props}
        data-testid="activeEditor"
      >
        <Frame fullscreen={isFullscreen}>
          <EditorWrapper fullscreen={isFullscreen}>
            <Bar>
              <Header>
                <EditorButton
                  data-testid="editor-Run"
                  onClick={execCurrent}
                  disabled={editorIsEmpty}
                  title={isMac ? 'Run (⌘↩)' : 'Run (ctrl+enter)'}
                  icon={controlsPlay}
                  key={`editor-Run`}
                  width={16}
                />
              </Header>
              <TypedEditor editorRef={editorRef} />
            </Bar>
            <UIControls>
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
            </UIControls>
          </EditorWrapper>
        </Frame>
      </animated.div>
    </AnimationContainer>
  )
}

export default withBus(EditorFrame)
