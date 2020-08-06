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
import deepmerge from 'deepmerge'
import { FrameButton } from 'browser-components/buttons'
import { parseGrass } from 'shared/services/grassUtils'
import { showErrorMessage } from 'shared/modules/commands/commandsDuck'
import { objToCss } from 'services/grassUtils'
import { GraphComponent } from 'browser/modules/D3Visualization/components/Graph'
import neoGraphStyle from 'browser/modules/D3Visualization/graphStyle'
import {
  updateGraphStyleData,
  getGraphStyleData
} from 'shared/modules/grass/grassDuck'
import {
  executeSystemCommand,
  executeCommand
} from 'shared/modules/commands/commandsDuck'
import { getCmdChar } from 'shared/modules/settings/settingsDuck'
import { FireExtinguisherIcon, PlayIcon } from 'browser-components/icons/Icons'
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
  const editorRef = useRef(null)

  const graphStyle = neoGraphStyle()
  const defaultStyle = graphStyle.toSheet()
  const rebasedStyle = deepmerge(defaultStyle, parseGrass(grass))
  graphStyle.loadRules(rebasedStyle)

  contents = (
    <div style={{ display: 'flex', width: '100%' }}>
      <div id="mon-editor" style={{ height: '700px', width: '500px' }} />
      <div style={{ flexGrow: 1 }}>
        <GraphComponent
          graphStyle={graphStyle}
          relationships={[]}
          nodes={[
            {
              id: '168',
              labels: ['Movie'],
              properties: {
                tagline: 'Welcome to the Real World',
                title: 'The Matrix',
                released: '1999'
              }
            },
            {
              id: '169',
              labels: ['Person'],
              properties: { name: 'Keanu Reeves', born: '1964' }
            },
            {
              id: '170',
              labels: ['Person'],
              properties: { name: 'Carrie-Anne Moss', born: '1967' }
            },
            {
              id: '172',
              labels: ['Person'],
              properties: { name: 'Laurence Fishburne', born: '1961' }
            },
            {
              id: '173',
              labels: ['Person'],
              properties: { name: 'Hugo Weaving', born: '1960' }
            },
            {
              id: '174',
              labels: ['Person'],
              properties: { name: 'Lilly Wachowski', born: '1967' }
            },
            {
              id: '175',
              labels: ['Person'],
              properties: { name: 'Lana Wachowski', born: '1965' }
            },
            {
              id: '176',
              labels: ['Person'],
              properties: { name: 'Joel Silver', born: '1952' }
            },
            {
              id: '177',
              labels: ['Person'],
              properties: { name: 'Emil Eifrem', born: '1978' }
            },
            {
              id: '178',
              labels: ['Movie'],
              properties: {
                tagline: 'Free your mind',
                title: 'The Matrix Reloaded',
                released: '2003'
              }
            }
          ]}
        />
      </div>
    </div>
  )
  // TODO use refs and so on

  useEffect(() => {
    monaco.languages.css.cssDefaults.setDiagnosticsOptions({
      lint: { unknownProperties: 'ignore' }
    })

    editorRef.current = monaco.editor.create(
      document.getElementById('mon-editor'),
      {
        value: grass,
        language: 'css'
      }
    )
    // todo dispose of editor
  }, [])

  return (
    <FrameTemplate
      header={frame}
      numRecords={1}
      getRecords={() => grass}
      contents={contents}
      statusbar={
        <Statusbar
          currGrass={editorRef.current && editorRef.current.getValue()}
          frame={frame}
        />
      }
    />
  )
}

const StyleStatusbar = ({
  resetStyleAction,
  rerunAction,
  onResetClick,
  updateGrass,
  currGrass
}) => {
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
          <FrameButton onClick={() => updateGrass(currGrass)}>
            <PlayIcon title="Update style" />
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
  },
  updateGrass: text => {
    console.log(text)
    const parsedGrass = parseGrass(text)
    console.log(parsedGrass)
    if (parsedGrass) {
      dispatch(updateGraphStyleData(parsedGrass))
    } else {
      dispatch(showErrorMessage('Could not parse grass data'))
    }
  }
})

const Statusbar = connect(mapStateToProps, mapDispatchToProps)(StyleStatusbar)

export default StyleFrame
