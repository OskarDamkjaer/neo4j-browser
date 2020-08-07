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
import * as grassActions from 'shared/modules/grass/grassDuck'
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

const StyleFrame = ({ frame, graphStyleData }) => {
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

  /*
  const graphStyle = neoGraphStyle()
  const defaultStyle = graphStyle.toSheet()
  const rebasedStyle = deepmerge(defaultStyle, parseGrass(grass))
  graphStyle.loadRules(rebasedStyle)
  */
  /*
  if (editorRef.current) {
    graphStyle.loadRules(parseGrass(editorRef.current.getValue()))
  }
  */
  const graphStyle = neoGraphStyle()
  const defaultStyle = graphStyle.toSheet()

  if (graphStyleData) {
    const rebasedStyle = deepmerge(defaultStyle, graphStyleData)
    graphStyle.loadRules(graphStyleData)
  }

  console.log(graphStyle, graphStyleData)

  contents = (
    <div style={{ display: 'flex', width: '100%' }}>
      <div id="mon-editor" style={{ height: '700px', width: '500px' }} />
      <div style={{ flexGrow: 1 }}>
        <GraphComponent
          graphStyle={graphStyle}
          relationships={JSON.parse(
            '[{"id":"202","startNodeId":"71","endNodeId":"144","type":"ACTED_IN","properties":{"roles":["Jim Lovell"]}},{"id":"84","startNodeId":"71","endNodeId":"67","type":"ACTED_IN","properties":{"roles":["Joe Fox"]}},{"id":"234","startNodeId":"71","endNodeId":"162","type":"ACTED_IN","properties":{"roles":["Jimmy Dugan"]}},{"id":"98","startNodeId":"71","endNodeId":"78","type":"ACTED_IN","properties":{"roles":["Joe Banks"]}},{"id":"110","startNodeId":"71","endNodeId":"85","type":"ACTED_IN","properties":{"roles":["Mr. White"]}},{"id":"146","startNodeId":"71","endNodeId":"111","type":"ACTED_IN","properties":{"roles":["Dr. Robert Langdon"]}},{"id":"137","startNodeId":"71","endNodeId":"105","type":"ACTED_IN","properties":{"roles":["Zachry","Dr. Henry Goose","Isaac Sachs","Dermot Hoggins"]}},{"id":"213","startNodeId":"71","endNodeId":"150","type":"ACTED_IN","properties":{"roles":["Chuck Noland"]}},{"id":"182","startNodeId":"71","endNodeId":"130","type":"ACTED_IN","properties":{"roles":["Paul Edgecomb"]}},{"id":"91","startNodeId":"71","endNodeId":"73","type":"ACTED_IN","properties":{"roles":["Sam Baldwin"]}},{"id":"232","startNodeId":"71","endNodeId":"161","type":"ACTED_IN","properties":{"roles":["Hero Boy","Father","Conductor","Hobo","Scrooge","Santa Claus"]}},{"id":"228","startNodeId":"71","endNodeId":"159","type":"ACTED_IN","properties":{"roles":["Rep. Charlie Wilson"]}}]'
          )}
          nodes={JSON.parse(
            '[{"id":"71","labels":["Person"],"properties":{"name":"Tom Hanks","born":"1956"}},{"id":"144","labels":["Movie"],"properties":{"tagline":"Houston, we have a problem.","title":"Apollo 13","released":"1995"}},{"id":"67","labels":["Movie"],"properties":{"tagline":"At odds in life... in love on-line.","title":"You\'ve Got Mail","released":"1998"}},{"id":"162","labels":["Movie"],"properties":{"tagline":"Once in a lifetime you get a chance to do something different.","title":"A League of Their Own","released":"1992"}},{"id":"78","labels":["Movie"],"properties":{"tagline":"A story of love, lava and burning desire.","title":"Joe Versus the Volcano","released":"1990"}},{"id":"85","labels":["Movie"],"properties":{"tagline":"In every life there comes a time when that thing you dream becomes that thing you do","title":"That Thing You Do","released":"1996"}},{"id":"111","labels":["Movie"],"properties":{"tagline":"Break The Codes","title":"The Da Vinci Code","released":"2006"}},{"id":"105","labels":["Movie"],"properties":{"tagline":"Everything is connected","title":"Cloud Atlas","released":"2012"}},{"id":"150","labels":["Movie"],"properties":{"tagline":"At the edge of the world, his journey begins.","title":"Cast Away","released":"2000"}},{"id":"130","labels":["Movie"],"properties":{"tagline":"Walk a mile you\'ll never forget.","title":"The Green Mile","released":"1999"}},{"id":"73","labels":["Movie"],"properties":{"tagline":"What if someone you never met, someone you never saw, someone you never knew was the only someone for you?","title":"Sleepless in Seattle","released":"1993"}},{"id":"161","labels":["Movie"],"properties":{"tagline":"This Holiday Season... Believe","title":"The Polar Express","released":"2004"}},{"id":"159","labels":["Movie"],"properties":{"tagline":"A stiff drink. A little mascara. A lot of nerve. Who said they couldn\'t bring down the Soviet empire.","title":"Charlie Wilson\'s War","released":"2007"}}]'
          )}
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
    const parsedGrass = parseGrass(text)
    console.log(text)
    if (parsedGrass) {
      dispatch(updateGraphStyleData(parsedGrass))
    } else {
      //dispatch(showErrorMessage('Could not parse grass data'))
    }
  }
})

const mapStateToProps2 = state => {
  return {
    graphStyleData: grassActions.getGraphStyleData(state)
  }
}

const Statusbar = connect(mapStateToProps, mapDispatchToProps)(StyleStatusbar)

export default connect(mapStateToProps2)(StyleFrame)
