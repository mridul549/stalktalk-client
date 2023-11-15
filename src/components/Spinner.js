import React from 'react'
import spinner from '../assets/images/loading1.gif'

function Spinner () {
  return (
    <div className='flex items-center justify-center w-full'>
      <img className='w-20' src={spinner} alt="spin" />
    </div>
  )
}

export default Spinner