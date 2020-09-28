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

import styled from 'styled-components'

interface FullscreenProps {
  fullscreen: boolean
}

export const Header = styled.div`
  background-color: ${(props): string => props.theme.frameSidebarBackground};
  flex-grow: 1;
  margin: 5px;

  display: flex;
`

export const ActionButtonSection = styled.div`
  display: flex;
  justify-content: space-between;
`

export const Frame = styled.div<FullscreenProps>`
  display: flex;
  background-color: ${props => props.theme.secondaryBackground};
  border-radius: 2px;
  padding-bottom: 1px;
  box-shadow: 0px 0px 2px rgba(52, 58, 67, 0.1),
    0px 1px 2px rgba(52, 58, 67, 0.08), 0px 1px 4px rgba(52, 58, 67, 0.08);
  ${(props): string => {
    if (props.fullscreen) {
      return `
  position: fixed;
  top: 0px;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100vh;
  border-radius: 0;
  z-index: 1030;`
    }
    return ''
  }};
`

export const EditorWrapper = styled.div<FullscreenProps>`
  font-family: 'Fira Code', Monaco, 'Courier New', Terminal, monospace;

  .CodeMirror {
    color: ${(props): string => props.theme.editorCommandColor};
    font-size: 17px;
  }

  .disable-font-ligatures & {
    font-variant-ligatures: none !important;
  }

  ${(props): string => {
    if (props.fullscreen) {
      return `height: 100%;
        min-height: 100vh;
        z-index: 1030;
        .CodeMirror {
          position: absolute;
          left: 12px;
          right: 142px;
          top: 42px;
          bottom: 12px;
        }
        .CodeMirror-scroll {
           max-height: initial !important;
        }
      `
    }
    return ''
  }};
`
