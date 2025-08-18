import React from 'react'
import Sidebar from '../components/Sidebar'
import Messagearea from '../components/Messagearea'
import getMessage from '../customHooks/getMessages'

function Home() {
  getMessage()
  return (
    <div className='w-full h-[100vh] flex overflow-hidden'>
      <Sidebar/>
      <Messagearea/>
    </div>
  )
}

export default Home
