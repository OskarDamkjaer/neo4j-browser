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

import FrameTemplate from '../../Frame/FrameTemplate'
import ConnectionForm from './ConnectionForm'
import FrameError from '../../Frame/FrameError'
import { H3 } from 'browser-components/headers'
import { Lead } from 'browser-components/Text'

import Render from 'browser-components/Render'
import { StyledConnectionAside, StyledConnectionBodyContainer } from './styled'
import { connect } from 'react-redux'
import { inCloudEnv } from 'shared/modules/app/appDuck'

export class ConnectionFrame extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: {}
    }
  }

  error(e) {
    this.setState({ error: e })
  }

  success() {
    this.setState({ success: true })
  }

  render() {
    return (
      <FrameTemplate
        header={this.props.frame}
        statusbar={
          <FrameError
            code={this.state.error.code}
            message={this.state.error.message}
          />
        }
        contents={
          <>
            <StyledConnectionAside>
              {this.state.success ? (
                <>
                  <H3>Connected to Neo4j</H3>
                  <Lead>Nice to meet you.</Lead>
                </>
              ) : (
                <>
                  <H3>Connect to Neo4j</H3>
                  <Lead>
                    {this.props.inCloudEnv
                      ? 'Database access on Neo4j Aura requires an authenticated connection'
                      : 'Database access might require an authenticated connection.'}
                  </Lead>
                </>
              )}
            </StyledConnectionAside>
            <StyledConnectionBodyContainer>
              <ConnectionForm
                {...this.props}
                onSuccess={this.success.bind(this)}
                error={this.error.bind(this)}
              />
            </StyledConnectionBodyContainer>
          </>
        }
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    inCloudEnv: inCloudEnv(state)
  }
}

export default connect(mapStateToProps)(ConnectionFrame)
