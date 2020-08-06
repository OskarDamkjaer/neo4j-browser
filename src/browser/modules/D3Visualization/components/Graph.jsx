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

import React, { Component } from 'react'
import { createGraph, mapRelationships, getGraphStats } from '../mapper'
import { GraphEventHandler } from '../GraphEventHandler'
import '../lib/visualization/index'
import { dim } from 'browser-styles/constants'
import { StyledZoomHolder, StyledSvgWrapper, StyledZoomButton } from './styled'
import { ZoomInIcon, ZoomOutIcon } from 'browser-components/icons/Icons'
import graphView from '../lib/visualization/components/graphView'

export class GraphComponent extends Component {
  graphInit(el) {
    this.svgElement = el
  }

  componentDidMount() {
    if (this.svgElement != null) {
      if (!this.graphView) {
        const NeoConstructor = graphView
        const measureSize = () => {
          return {
            width: 400,
            height: 400
          }
        }
        this.graph = createGraph(this.props.nodes, this.props.relationships)
        this.graphView = new NeoConstructor(
          this.svgElement,
          measureSize,
          this.graph,
          this.props.graphStyle
        )

        this.graphView.resize()
        this.graphView.update()
      }
    }
  }

  componentDidUpdate(prevProps) {
    this.graphView.update()
  }

  render() {
    return (
      <StyledSvgWrapper>
        <svg className="neod3viz" ref={this.graphInit.bind(this)} />
      </StyledSvgWrapper>
    )
  }
}
