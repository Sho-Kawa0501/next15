'use client';
import React, {useState, useEffect} from 'react';
import ChildButton from './child1';
import Display from './Display';


const MyButton = (props) => {
  // const [enabled, setEnabled] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0)
  // const { title, type, disabled, onClick, children} = props
  const [countArr, setCountArr] = useState<number[]>([])
  

  const handleClick = () => {
    setCount(count + 1) 
    // setCount(count + 1) 
    setCountArr((prev) => [...prev, count])
    // setCount((prev) => prev + 1)
    // setCount((prev) => prev + 1)
    console.log(count)
    console.log(JSON.stringify((countArr)))
  }
  // countに変更があったときにコールバック関数がよばれる
  useEffect(() => {
    console.log('count++')
    if(count > 15) {
      setCount(0)
    }
  }, [count])
  return (
    <>
      <ChildButton title="ttiitle" type="button" disabled={false} onClick={handleClick}>
        <span>testtest2</span>
      </ChildButton>
      <Display displayText={count} />
    </>
  )
}

export default MyButton;
