import React from 'react'
import { SFSymbolProps } from './types'
import symbols from './symbols.json'

export function Symbol(props: SFSymbolProps) {
  // @ts-ignore
  const selectedSymbol = symbols[props.weight][props.name]

  return (
    <svg
      className={`flex-grow-0 block ${props.className}`}
      viewBox={`0 0 ${selectedSymbol.width} ${selectedSymbol.height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={selectedSymbol.d} />
    </svg>
  )
}

Symbol.defaultProps = {
  className: '',
  name: 'square.dashed',
  style: {},
  weight: 'regular',
}
