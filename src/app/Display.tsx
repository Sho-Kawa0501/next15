'use client';
import React, {useState} from 'react';


const Display = (props) => {
  // const [enabled, setEnabled] = useState<boolean>(false);
  
  const { displayText } = props

  // const handleClick = () => {
  //   console.log("buttontest")
  // }
  return (
    <p>{displayText}</p>
  )
}

export default Display;
