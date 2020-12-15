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

import { connect } from 'react-redux'
import React, { useState } from 'react'
import { withBus } from 'react-suber'
import { saveAs } from 'file-saver'
import { map } from 'lodash-es'
import SVGInline from 'react-svg-inline'
import controlsPlay from 'icons/controls-play.svg'

import * as app from 'shared/modules/app/appDuck'
import * as commands from 'shared/modules/commands/commandsDuck'
import * as sidebar from 'shared/modules/sidebar/sidebarDuck'
import {
  cancel as cancelRequest,
  getRequest,
  Request,
  REQUEST_STATUS_PENDING
} from 'shared/modules/requests/requestsDuck'
import { remove, pin, unpin, Frame } from 'shared/modules/stream/streamDuck'
import { removeComments, sleep } from 'shared/services/utils'
import { FrameButton } from 'browser-components/buttons'
import Render from 'browser-components/Render'
import { CSVSerializer } from 'services/serializer'
import {
  CloseIcon,
  ContractIcon,
  DownIcon,
  DownloadIcon,
  ExpandIcon,
  PinIcon,
  RunIcon,
  UpIcon,
  SaveFavorite,
  SaveFile
} from 'browser-components/icons/Icons'
import {
  DottedLineHover,
  DropdownList,
  DropdownContent,
  DropdownButton,
  DropdownItem
} from '../Stream/styled'
import {
  StyledFrameTitleBar,
  StyledFrameTitlebarButtonSection,
  FrameTitleEditorContainer,
  CurrentDbText
} from './styled'
import {
  downloadPNGFromSVG,
  downloadSVG
} from 'shared/services/exporting/imageUtils'
import {
  stringifyResultArray,
  transformResultRecordsToResultArray,
  recordToJSONMapper
} from 'browser/modules/Stream/CypherFrame/helpers'
import { csvFormat, stringModifier } from 'services/bolt/cypherTypesFormatting'
import arrayHasItems from 'shared/utils/array-has-items'
import { stringifyMod } from 'services/utils'
import Monaco from '../Editor/Monaco'
import { Bus } from 'suber'

// Remove comments in editor?
type FrameTitleBarBaseProps = {
  frame: any
  fullscreen: boolean
  fullscreenToggle: () => void
  collapse: boolean
  collapseToggle: () => void
  pinned: boolean
  togglePin: () => void
  numRecords: number
  getRecords: () => any
  visElement: any
  runQuery: () => any
}

type FrameTitleBarProps = FrameTitleBarBaseProps & {
  request: Request | null
  isRelateAvailable: boolean
  newFavorite: (cmd: string) => void
  newProjectFile: (cmd: string) => void
  onCloseClick: (a: any, b: any, c: any) => void
  onRunClick: () => void
  onReRunClick: (obj: Frame, cmd: string) => void
  togglePinning: (id: string, isPinned: boolean) => void
  bus: Bus
}

function FrameTitlebar(props: FrameTitleBarProps) {
  const [editorValue, setEditorValue] = useState(props.frame.cmd)
  const [history, setHistory] = useState<string[]>([])

  function hasData() {
    return props.numRecords > 0
  }
  // TODO Ecport these functinos to util file.
  // CSS is messed up for reusable frame
  // there's something odd in the dataflow. simplify FrameProps

  function exportCSV(records: any) {
    const exportData = stringifyResultArray(
      csvFormat,
      transformResultRecordsToResultArray(records)
    )
    const data = exportData.slice()
    const csv = CSVSerializer(data.shift())
    csv.appendRows(data)
    const blob = new Blob([csv.output()], {
      type: 'text/plain;charset=utf-8'
    })
    saveAs(blob, 'export.csv')
  }

  function exportTXT() {
    const { frame } = props

    if (frame.type === 'history') {
      const asTxt = frame.result
        .map((result: string) => {
          const safe = `${result}`.trim()

          if (safe.startsWith(':')) {
            return safe
          }

          return safe.endsWith(';') ? safe : `${safe};`
        })
        .join('\n\n')
      const blob = new Blob([asTxt], {
        type: 'text/plain;charset=utf-8'
      })

      saveAs(blob, 'history.txt')
    }
  }

  function exportJSON(records: any) {
    const exportData = map(records, recordToJSONMapper)
    const data = stringifyMod(exportData, stringModifier, true)
    const blob = new Blob([data], {
      type: 'text/plain;charset=utf-8'
    })
    saveAs(blob, 'records.json')
  }

  function exportPNG() {
    const { svgElement, graphElement, type } = props.visElement
    downloadPNGFromSVG(svgElement, graphElement, type)
  }

  function exportSVG() {
    const { svgElement, graphElement, type } = props.visElement
    downloadSVG(svgElement, graphElement, type)
  }

  function exportGrass(data: any) {
    const blob = new Blob([data], {
      type: 'text/plain;charset=utf-8'
    })
    saveAs(blob, 'style.grass')
  }

  function canExport() {
    const { frame = {}, visElement } = props

    return (
      canExportTXT() ||
      (frame.type === 'cypher' && (hasData() || visElement)) ||
      (frame.type === 'style' && hasData())
    )
  }

  function canExportTXT() {
    const { frame = {} } = props

    return frame.type === 'history' && arrayHasItems(frame.result)
  }

  const { frame = {} } = props
  const fullscreenIcon = props.fullscreen ? <ContractIcon /> : <ExpandIcon />
  const expandCollapseIcon = props.collapse ? <DownIcon /> : <UpIcon />

  return (
    <StyledFrameTitleBar>
      <FrameTitleEditorContainer>
        <Monaco
          history={history}
          useDb={frame.useDb}
          enableMultiStatementMode={true}
          id={`editor-${frame.id}`}
          bus={props.bus}
          theme={'normal'}
          onChange={setEditorValue}
          onExecute={value => {
            props.onReRunClick(frame, value)
            setHistory([...history, value])
          }}
          value={editorValue}
          customStyle={{ border: 'none' }}
        />
      </FrameTitleEditorContainer>
      <StyledFrameTitlebarButtonSection>
        <FrameButton
          title="Save as Favorite"
          data-testid="frame-Favorite"
          onClick={() => {
            props.newFavorite(frame.cmd)
          }}
        >
          <SaveFavorite />
        </FrameButton>
        <Render if={props.isRelateAvailable}>
          <FrameButton
            title="Save as project file"
            onClick={() => {
              props.newProjectFile(frame.cmd)
            }}
          >
            <SaveFile />
          </FrameButton>
        </Render>
        <Render if={frame.type !== 'edit'}>
          <FrameButton
            data-testid="rerunFrameButton"
            title="Rerun"
            onClick={() => props.onReRunClick(frame, editorValue)}
          >
            <RunIcon />
          </FrameButton>
        </Render>
        <Render if={canExport()}>
          <DropdownButton data-testid="frame-export-dropdown">
            <DownloadIcon />
            <DropdownList>
              <DropdownContent>
                <Render if={hasData() && frame.type === 'cypher'}>
                  <DropdownItem onClick={() => exportCSV(props.getRecords())}>
                    Export CSV
                  </DropdownItem>
                  <DropdownItem onClick={() => exportJSON(props.getRecords())}>
                    Export JSON
                  </DropdownItem>
                </Render>
                <Render if={props.visElement}>
                  <DropdownItem onClick={() => exportPNG()}>
                    Export PNG
                  </DropdownItem>
                  <DropdownItem onClick={() => exportSVG()}>
                    Export SVG
                  </DropdownItem>
                </Render>
                <Render if={canExportTXT()}>
                  <DropdownItem onClick={exportTXT}>Export TXT</DropdownItem>
                </Render>
                <Render if={hasData() && frame.type === 'style'}>
                  <DropdownItem
                    data-testid="exportGrassButton"
                    onClick={() => exportGrass(props.getRecords())}
                  >
                    Export GraSS
                  </DropdownItem>
                </Render>
              </DropdownContent>
            </DropdownList>
          </DropdownButton>
        </Render>
        <FrameButton
          title="Pin at top"
          onClick={() => {
            props.togglePin()
            // using frame.isPinned causes issues when there are multiple frames in one
            props.togglePinning(frame.id, props.pinned)
          }}
          pressed={props.pinned}
        >
          <PinIcon />
        </FrameButton>
        <Render
          if={['cypher', 'play', 'play-remote', 'queries'].includes(frame.type)}
        >
          <FrameButton
            title={props.fullscreen ? 'Close fullscreen' : 'Fullscreen'}
            onClick={() => props.fullscreenToggle()}
          >
            {fullscreenIcon}
          </FrameButton>
        </Render>
        <FrameButton
          title={props.collapse ? 'Expand' : 'Collapse'}
          onClick={() => props.collapseToggle()}
        >
          {expandCollapseIcon}
        </FrameButton>
        <Render if={frame.type === 'edit'}>
          <FrameButton title="Run" onClick={() => props.onRunClick()}>
            <SVGInline svg={controlsPlay} width="12px" />
          </FrameButton>
        </Render>
        <FrameButton
          title="Close"
          onClick={() =>
            props.onCloseClick(frame.id, frame.requestId, props.request)
          }
        >
          <CloseIcon />
        </FrameButton>
      </StyledFrameTitlebarButtonSection>
    </StyledFrameTitleBar>
  )
}

const mapStateToProps = (state: any, ownProps: FrameTitleBarBaseProps) => {
  const request = ownProps.frame.requestId
    ? getRequest(state, ownProps.frame.requestId)
    : null

  return {
    request,
    isRelateAvailable: app.isRelateAvailable(state)
  }
}

const mapDispatchToProps = (
  dispatch: any,
  ownProps: FrameTitleBarBaseProps
) => {
  return {
    newFavorite: (cmd: string) => {
      dispatch(sidebar.setDraftScript(cmd, 'favorites'))
    },
    newProjectFile: (cmd: string) => {
      dispatch(sidebar.setDraftScript(cmd, 'project files'))
    },
    onCloseClick: async (id: string, requestId: string, request?: Request) => {
      if (request && request.status === REQUEST_STATUS_PENDING) {
        dispatch(cancelRequest(requestId))
        await sleep(3000) // sleep for 3000 ms to let user read the cancel info
      }
      dispatch(remove(id))
    },
    onRunClick: () => {
      ownProps.runQuery()
    },
    // TODO styling is off for framesize
    // TODO look closer into  frame vs frame-stack. reusing with guides is buggy. also. server disconnect is weird.
    onReRunClick: ({ useDb, id, requestId }: Frame, cmd: string) => {
      if (requestId) {
        dispatch(cancelRequest(requestId))
      }

      dispatch(
        commands.executeCommand(cmd, {
          id,
          useDb,
          isRerun: true,
          source: commands.commandSources.rerunFrame
        })
      )
    },
    togglePinning: (id: string, isPinned: boolean) => {
      isPinned ? dispatch(unpin(id)) : dispatch(pin(id))
    }
  }
}

export default withBus(
  connect(mapStateToProps, mapDispatchToProps)(FrameTitlebar)
)
