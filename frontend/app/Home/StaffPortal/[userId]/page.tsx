"use client"
import NavbarLanding from '@/components/navbarLanding';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import StaffSideBar from '@/components/staffSideBar';
import Appointment from '@/components/StaffPortalUI/Appointment';
import Schedule from '@/components/StaffPortalUI/Schedule';
import "@/styles/staff.module.css"
const staffPortal = () => {
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(true)
  const [section, setSection] = useState(1)
  const handlePageLoad = () => {
    if (localStorage.getItem("role") !== "staff") {
      router.push('/Forbidden')
    }
    else {
      setHasAccess(true)
    }
  }
  useEffect(() => {
    handlePageLoad()
  }, [hasAccess]);
  
  return (
    <>
      {hasAccess ?
        <div className="grad_bg h-full md:h-screen">
          <NavbarLanding />
          <div className='flex grid-cols-5 gap-2 '>
            <StaffSideBar setSection={setSection} />
            {section==1&&<Appointment />}
            {section==2&&<Schedule />}
          </div>

        </div> :
        <div>Access Denied</div>}
    </>
  )
}

export default staffPortal