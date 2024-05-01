"use client"
import styles from "../styles/navbar.module.css";
import Link from "next/link";
import Image from "next/image";
import { HoveredLink, Menu, MenuItem } from "@/components/ui/navbar-menu";
import { cn } from "@/utils/cn";
import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";

interface Patient {
  id: number;
  age: number;
  firstName: string;
  lastName: string;
  parentFirstName: string;
  parentLastName: string;
  parentPhoneNumber: string;
  gender: string;
  parentId: number;
}
const Navbar = ({
  patients,
  setIdShown,
  idShown,
  setOpenModal
}
  : {
    patients: Patient[],
    setIdShown: React.Dispatch<React.SetStateAction<number | undefined>>,
    idShown: number | undefined
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
  }
) => {
  const [active, setActive] = useState<string | null>(null);
  const [active2, setActive2] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)
  const [buttonTitle, setButtonTitle] = useState("Choose your patient")
  const formatName = (name: string) => {
    return name[0].toUpperCase() + name.slice(1)
  }
  let patientList = patients.map((patient) => {
    return (
      <div className="flex justify-between space-x-4">
        <HoveredLink onClick={() => handlePatientChange(patient.id, `${formatName(patient.firstName) + " " + formatName(patient.lastName)}`)} href="">
          {formatName(patient.firstName)} {formatName(patient.lastName)}
        </HoveredLink>
        <button onClick={() => handlePatientDelete(patient.id)} className="px-2 rounded-full text-sm bg-gradient-to-br from-black to-neutral-600 text-white hover:shadow-xl transition duration-200">
          {loading ? <CircularProgress size={"0.8rem"} color="warning" /> : <>X</>}
        </button>
      </div>)
  });
  const handlePatientChange = (patientId: number, patientName: string) => {
    setButtonTitle(patientName)
    setIdShown(patientId)
    // if (idShown !== undefined) {
    //   setCurrentPatient(patients.find(patient => patient.id === patientId))
    // }
  };
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
  };
  async function DeletePatient(patiendId: number) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_NAME}/delete/patient/${patiendId}?token=${localStorage.getItem("accessToken")}`,
      { method: 'DELETE', headers }
    );
    if (response.ok) {
      setLoading(false)
      location.reload()
    }
  }
  const handlePatientDelete = (patiendId: number) => {
    setLoading(true)
    DeletePatient(patiendId)
  };
  return (
    <nav className="bg-black w-screen h-24 grid grid-cols-2 items-center px-6 md:px-12 lg:px-24 sticky top-0 z-50">
      <div className="">
        <Link className="lg:w-72 lg:h-24 md:w-48 md:h-16 w-48 h-16 flex" href="/">
          <Image
            className="lg:w-72 lg:h-24 md:w-48 md:h-16 w-48 h-16 md:p-1 lg:p-2"
            src="/logoSmall.png"
            alt="logo"
            width={1080}
            height={1}
          />
        </Link>
      </div>
      <div className="flex justify-end gap-2 h-full">
        <div
          className={cn("flex justify-end")}
        >
          <Menu setActive={setActive}>
            <MenuItem setActive={setActive} active={active} item={`${buttonTitle}`}>
              <div className="flex flex-col space-y-4 px-2 text-md">
                {patientList}
              </div>
            </MenuItem>
          </Menu>
          <Menu setActive={setActive2}>
            <Link href='' onClick={() => setOpenModal(true)}>
              <MenuItem setActive={setActive2} active={null} item="Add Patient">
              </MenuItem>
            </Link>
          </Menu>
        </div>

      </div>
    </nav>
  );
};
export default Navbar;