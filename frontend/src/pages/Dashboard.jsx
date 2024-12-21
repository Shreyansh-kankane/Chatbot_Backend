import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/hero'
import { NavLink } from 'react-router-dom'
import DashboardHero from '../components/dashboardHero'



function Dashboard() {

  const handleScrap = async () =>{

  }

  return (
    <>
      <nav className="flex flex-row  items-center w-full bg-[#16141A] p-4 shadow-md text-white">
        <div className="flex flex-row justify-between w-1/2 text-xl font-bold">
          <NavLink to="/">
            Vartalap.ai
          </NavLink>
        </div>
      </nav>
      <div className="flex flex-row">
        <DashboardHero />
      </div>
    </>
  )
}

export default Dashboard