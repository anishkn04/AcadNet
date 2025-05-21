import React from 'react'
import {Outlet} from 'react-router-dom'
const MainLayout = () => {
  return (
    <div>
        {/** header section */}
        <main>
            <Outlet/>
        </main>
        {/**footer section */}
    </div>
  )
}

export default MainLayout