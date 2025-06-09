import React from 'react'
import ReactDOM from 'react-dom'
import { AppInit, setupSentry } from './AppInit'
import './init'

export function bootstrapBrowser() {
  ReactDOM.render(<AppInit />, document.getElementById('mount'))
  setupSentry()
}
