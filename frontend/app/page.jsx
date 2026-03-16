"use client"

import { useState } from 'react'


export default function Page() {

  const [count, setCount] = useState(0)

  function addOne() {
    setCount(count + 1)
  }

  return <>
    <h1>Hello</h1>
    <button style={{width:"50px", height:"50px"}}onClick={addOne}>{ count }</button>
  </>
}
