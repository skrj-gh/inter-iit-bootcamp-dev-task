import React from 'react'
import Main from './main/main'
import Sidebar from './sidebar/sidebar'

const Home = () => {
  return (
    <>
        <Sidebar/>
        <Main/>
        <div id="photo-picker-element"></div>
    </>
  )
}

export default Home