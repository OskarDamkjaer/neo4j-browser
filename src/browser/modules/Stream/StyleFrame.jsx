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

import React, { useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import FrameTemplate from '../Frame/FrameTemplate'
import { PaddedDiv, StyledOneRowStatsBar, StyledRightPartial } from './styled'
import { StyledFrameTitlebarButtonSection } from 'browser/modules/Frame/styled'
import { FrameButton } from 'browser-components/buttons'
import { objToCss } from 'services/grassUtils'
import {
  executeSystemCommand,
  executeCommand
} from 'shared/modules/commands/commandsDuck'
import { getCmdChar } from 'shared/modules/settings/settingsDuck'
import { FireExtinguisherIcon } from 'browser-components/icons/Icons'
import { InfoView } from './InfoView'
import * as monaco from 'monaco-editor'

const StyleFrame = ({ frame }) => {
  let grass = ''
  let contents = (
    <InfoView
      title="No styles yet"
      description="No style generated or set yet. Run a query and return a few nodes and
    relationships to generate some styling."
    />
  )

  if (frame.result) {
    grass = objToCss(frame.result)
    contents = (
      <PaddedDiv>
        <pre>
          {grass ||
            'Something went wrong when parsing the GraSS. Please reset and try again.'}
        </pre>
      </PaddedDiv>
    )
  }

  const editor = useRef(null)
  const options = {
    selectOnLineNumbers: true
  }

  const onMount = (editor, monaco) => {
    console.log(editor, monaco)
    editor = editor
  }
  const onChange = console.log
  contents = <div id="mon-editor" style={{ height: '100%', width: '100%' }} />
  // TODO use refs and so on

  useEffect(() => {
    // Register a new language
    monaco.languages.register({ id: 'grass' })

    // Register a tokens provider for the language
    monaco.languages.setMonarchTokensProvider('grass', {
      tokenizer: {
        root: [
          [/\[error.*/, 'custom-error'],
          [/\[notice.*/, 'custom-notice'],
          [/\[info.*/, 'custom-info'],
          [/\[[a-zA-Z 0-9:]+\]/, 'custom-date']
        ]
      }
    })

    // Define a new theme that contains only rules that match this language
    monaco.editor.defineTheme('grassTheme', {
      base: 'vs',
      inherit: false,
      rules: [
        { token: 'custom-info', foreground: '808080' },
        { token: 'custom-error', foreground: 'ff0000', fontStyle: 'bold' },
        { token: 'custom-notice', foreground: 'FFA500' },
        { token: 'custom-date', foreground: '008800' }
      ]
    })

    // Register a completion item provider for the new language
    monaco.languages.registerCompletionItemProvider('grass', {
      provideCompletionItems: () => {
        var suggestions = [
          {
            label: 'simpleText',
            kind: monaco.languages.CompletionItemKind.Text,
            insertText: 'simpleText'
          },
          {
            label: 'testing',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'testing(${1:condition})',
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          },
          {
            label: 'ifelse',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              'if (${1:condition}) {',
              '\t$0',
              '} else {',
              '\t',
              '}'
            ].join('\n'),
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'If-Else Statement'
          }
        ]
        return { suggestions: suggestions }
      }
    })

    monaco.editor.create(document.getElementById('mon-editor'), {
      theme: 'grassTheme',
      value: grass,
      language: 'grass'
    })
    // todo dispose of editor
  }, [])

  return (
    <FrameTemplate
      header={frame}
      numRecords={1}
      getRecords={() => grass}
      contents={contents}
      statusbar={<Statusbar frame={frame} />}
    />
  )
}

const StyleStatusbar = ({ resetStyleAction, rerunAction, onResetClick }) => {
  return (
    <StyledOneRowStatsBar>
      <StyledRightPartial>
        <StyledFrameTitlebarButtonSection>
          <FrameButton
            data-testid="styleResetButton"
            onClick={() => onResetClick(resetStyleAction, rerunAction)}
          >
            <FireExtinguisherIcon title="Reset style" />
          </FrameButton>
        </StyledFrameTitlebarButtonSection>
      </StyledRightPartial>
    </StyledOneRowStatsBar>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    resetStyleAction: executeSystemCommand(`${getCmdChar(state)}style reset`),
    rerunAction: executeCommand(ownProps.frame.cmd, {
      id: ownProps.frame.id
    })
  }
}
const mapDispatchToProps = dispatch => ({
  onResetClick: (resetStyleAction, rerunAction) => {
    dispatch(resetStyleAction)
    dispatch(rerunAction)
  }
})

const Statusbar = connect(mapStateToProps, mapDispatchToProps)(StyleStatusbar)

export default StyleFrame
