import styled, { css } from 'styled-components'
import { Handle as Port } from 'react-flow-renderer'

export const Container = styled.div.attrs((props) => props)`
  min-width: 400px;
  min-height: 1120px;
  max-width: 400px;
  background: #555;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  position: relative;
  ${({ selected }) =>
    selected &&
    css`
      outline: 1px solid rgba(0, 89, 220, 0.8);
    `}

  ${({ warning }) =>
    warning &&
    css`
      box-shadow: #e67e2266 0px 4px 4px, #e67e2266 0px 0px 4px 4px;
    `}

    word-break: break-all;
`

export const Avatar = styled.div`
  width: 50px;
  height: 50px;
  padding: 10px;
  background: ${(props) => props.color}22;
  border-radius: 5px;
`

export const Tag = styled.div`
  background: #5fd07e66;
  border-radius: 5px;
  padding: 5px 20px;
  color: #5fd07e;
  display: inline;
`

export const HandleContainer = styled.div`
  position: absolute;
  top: calc(70% - 12px);
  right: -6px;
`

export const Handle = styled(Port)`
  && {
    background: #555;
    outline: 4px solid ${(props) => props.color}77;
    transform: translate(0);
    width: 12px;
    height: 12px;
    top: 6px;
    position: relative;
    &:hover {
      transform: scale(1.5);
    }
  }
`
