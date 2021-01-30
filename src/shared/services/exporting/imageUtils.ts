/*
 * Copyright (c) "Neo4j"
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

import canvg from 'canvg'

import { prepareForExport } from './svgUtils'
import FileSaver from 'file-saver'

export const downloadPNGFromSVG = (svg: any, graph: any, type: any) => {
  const svgObj = prepareForExport(svg, graph, type)
  const svgData = htmlCharacterRefToNumericalRef(svgObj.node())

  const canvas = document.createElement('canvas')
  canvas.width = svgObj.attr('width') as any
  canvas.height = svgObj.attr('height') as any

  canvg(canvas, svgData)
  return downloadWithDataURI(`${type}.png`, canvas.toDataURL('image/png'))
}

export const downloadSVG = (svg: any, graph: any, type: any) => {
  const svgObj = prepareForExport(svg, graph, type)
  const svgData = htmlCharacterRefToNumericalRef(svgObj.node())

  return download(`${type}.svg`, 'image/svg+xml;charset=utf-8', svgData)
}

const htmlCharacterRefToNumericalRef = (node: any) =>
  new window.XMLSerializer()
    .serializeToString(node)
    .replace(/&nbsp;/g, '&#160;')

const download = (filename: any, mime: any, data: any) => {
  const blob = new Blob([data], { type: mime })
  return FileSaver.saveAs(blob, filename)
}

const downloadWithDataURI = (filename: any, dataURI: any) => {
  let byteString, i, j, ref
  byteString = null
  if (dataURI.split(',')[0].indexOf('base64') >= 0) {
    byteString = window.atob(dataURI.split(',')[1])
  } else {
    byteString = unescape(dataURI.split(',')[1])
  }
  const mimeString = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0]
  const ia = new Uint8Array(byteString.length)
  for (
    i = j = 0, ref = byteString.length;
    ref >= 0 ? j <= ref : j >= ref;
    i = ref >= 0 ? ++j : --j
  ) {
    ia[i] = byteString.charCodeAt(i)
  }
  return download(filename, mimeString, ia)
}
