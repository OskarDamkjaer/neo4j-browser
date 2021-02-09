import styled from 'styled-components'

export const SavedScriptsBody = styled.div`
  padding: 0 18px;
  margin-bottom: 12px;
`

export const SavedScriptsHeader = styled.h5`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #424650;
  font-size: 16px;
  margin-bottom: 12px;
  line-height: 39px;
  position: relative;
  font-weight: bold;
`

export const SavedScriptsListItemMain = styled.div<{
  stayVisible?: boolean
  isSelected?: boolean
}>`
  padding: 5px 3px;
  display: flex;
  justify-content: space-between;

  background-color: ${props =>
    props.isSelected ? props.theme.hoverBackground : 'inherit'};

  border-left: 3px solid
    ${props => (props.isSelected ? '#68BDF4' : 'transparent')};

  &:hover {
    color: inherit;
    background-color: ${props => props.theme.hoverBackground};
  }

  & .saved-scripts-hidden-more-info {
    visibility: ${props => (props.stayVisible ? 'visible' : 'hidden')};
  }

  &:hover .saved-scripts-hidden-more-info {
    visibility: visible;
  }
`

export const SavedScriptsNewFavorite = styled.div`
  flex: 1;
  user-select: none;
  cursor: pointer;
  color: #bcc0c9;
  font-size: 13px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-left: 6px;
  transition: color ease-in-out 0.3s;

  &:hover {
    color: inherit;
  }
`

export const SavedScriptsListItemDisplayName = styled.div`
  flex: 1;
  user-select: none;
  cursor: pointer;
  color: #bcc0c9;
  font-size: 13px;
  padding: 1px 0;
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const SavedScriptsFolderMain = styled.div`
  padding-bottom: 16px;
`
export const ChildrenContainer = styled.div`
  padding-left: 10px;
`

export const SavedScriptsFolderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 5px;
`

export const SavedScriptsFolderBody = styled.div`
  margin-left: 15px;
`

export const SavedScriptsFolderLabel = styled.div`
  flex: 1;
  margin-right: 10px;
  user-select: none;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
`

export const SavedScriptsFolderCollapseIcon = styled.span`
  margin-right: 3px;
  width: 8px;
  display: inline-block;
  vertical-align: middle;
`

export const SavedScriptsButtonWrapper = styled.div`
  min-width: 21px;

  > button:not(:last-of-type) {
    margin-right: 5px;
  }
`

export const StyledSavedScriptsButton = styled.button`
  color: #bcc0c9;
  background: transparent;
  border: none;
  outline: none;
  padding: 3px;
  transition: color ease-in-out 0.3s;
  cursor: pointer;

  &:hover {
    color: inherit;
  }
`

export const SavedScriptsInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-weight: normal;
  margin-right: 5px;
`
