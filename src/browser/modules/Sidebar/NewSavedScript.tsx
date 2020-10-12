/*
 * Copyright (c) 2002-2020 "Neo4j,"
 * Neo4j Sweden AB [http://neo4j.com]
 * This file is part of Neo4j.
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
const StyledForm = styled.form`
  color: black;
  padding-left: 25px;
  margin-bottom: 20px;
`

const StyledHeaderText = styled.h4`
  color: white;
`
const StyledSubmitButton = styled.button`
  margin-left: 4px;
`
const StyledInputField = styled.input`
  font-size: 14px;
`

interface NewSavedScriptProps {
  onSubmit: (name: string) => void
  defaultName: string
  headerText: string
}

function NewSavedScript({
  onSubmit,
  defaultName,
  headerText
}: NewSavedScriptProps): JSX.Element {
  const [name, setName] = useState(defaultName)
  const [shouldShow, setShouldShow] = useState(!!defaultName)
  useEffect(() => {
    setShouldShow(!!defaultName)
  }, [defaultName])

  function formSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(name)
    setShouldShow(false)
  }
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    setName(e.target.value)
  }

  return shouldShow ? (
    <>
      <StyledForm onSubmit={formSubmit}>
        <StyledHeaderText> {headerText} </StyledHeaderText>
        <StyledInputField value={name} onChange={onChange} />
        <StyledSubmitButton type="submit"> save </StyledSubmitButton>
      </StyledForm>
    </>
  ) : (
    <span />
  )
}

export default NewSavedScript
