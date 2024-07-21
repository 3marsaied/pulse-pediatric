"use client"
import AddPatient from '@/components/addPatient';
import ChangePatientInfo from '@/components/changePatientInfo';
import Navbar from '@/components/navbar';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import MedicalRecord from "@/components/medicalRecord"
import DoctorSelector from '@/components/DoctorSelector';
import DoctorAppointmentTable from "@/components/appointmentTable";
import ChangeProfileInfo from "@/components/changeProfileInfo";
import Image from "next/image";
import RatingCards from "@/components/ratingCards"
import { CircularProgress } from '@mui/material';
import SideAppointments from '@/components/sideAppointments';
import { formatName } from '@/utils/formatFuncs';
import SideAppointmentsDrPortal from '@/components/sideAppointmentsDrPortal';

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
};
interface Doctor {
  title: string;
  link: string;
  thumbnail: string;
  numberOfReviews: number;
  avarageRating: number;
  id: number;
};
interface User {
  userId: number,
  firstName: string,
  lastName: string,
  email: string,
  userName: string,
  createdAt: string,
  phone: string,
  age: number,
  profilePicture: string,
  role: string
};
interface Appointment {
  id: number,
  parentId: number,
  doctorId: number,
  patientId: number,
  appointmentDate: string,
  From: string,
  To: string,
  isTaken: true
};
const patientPortal = () => {
  const router = useRouter();
  const [user, setUser] = useState({} as User | undefined)
  const [patients, setPatients] = useState([] as Patient[]);
  const [hasAccess, setHasAccess] = useState(false)
  const [idShown, setIdShown] = useState<number | undefined>()
  const [openModal, setOpenModal] = useState(false)
  const [openModalProfile, setOpenModalProfile] = useState(false)
  const [selectedDr, setSelectedDr] = useState({ title: "", link: "", thumbnail: "/default.jpg", numberOfReviews: 0, avarageRating: 0, id: 0, } as Doctor)
  const [loading, setLoading] = useState(false)
  const [currentPatient, setCurrentPatient] = useState({} as Patient | undefined)
  const [doctorList, setDoctorList] = useState([] as Doctor[])
  const [appointments, setAppointments] = useState([] as Appointment[])

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
  };
  async function fetchPatientList() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_NAME}/get/patients/${localStorage.getItem("userId")}?token=${localStorage.getItem("accessToken")}`,
      { headers }
    );
    if (!response.ok) {
      console.log("ERRORRR")
    }
    const data = await response.json();
    setPatients(data);
  };
  const handlePageLoad = () => {
    if (localStorage.getItem("role") !== "customer" || localStorage.getItem("role") !== "admin") {
      // router.push('/Forbidden')
      setHasAccess(true)
    }
    else {
      setHasAccess(true)
    }
  };
  async function fetchDoctorList() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_NAME}/doctorList`,
      { headers }
    );
    if (!response.ok) {
      console.log("Error: Request sent no data")
    }
    const data = await response.json();
    setDoctorList(data);
  };
  async function fetchCurrrentUser() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_NAME}/get/user/${localStorage.getItem("userId")}?token=${localStorage.getItem("accessToken")}`,
      { headers }
    );
    if (!response.ok) {
      console.log("Error: Request sent no data")
    }
    const data = await response.json();
    setUser(data);
  };
  useEffect(() => {
    handlePageLoad();
    fetchPatientList();
    fetchDoctorList();
    fetchCurrrentUser();
  }, []);
  const Skeleton1 = React.memo(() => (
    <>
      <div className='flex items-start font-bold border border-transparent'>
        Patient Medical Record
      </div>
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-dot-black/[0.2] font-bold border border-transparent ">
        <MedicalRecord currentPatient={currentPatient} />
      </div>
    </>
  ));
  const Skeleton2 = React.memo(() => (
    <>
      <div className='flex items-center justify-between font-bold border border-transparent'>
        <span>Change your patient's data</span>
        <span className='text-xs font-light'>{`(Select patient to edit)`}</span>
      </div>
      <div className="flex-col w-full h-full min-h-[6rem] rounded-xl bg-dot-black/[0.2] font-bold border border-transparent ">
        <div className='flex flex-col items-center justify-center space-y-4'>
          <Image className="w-48 h-48 rounded-full object-cover" src={user?.profilePicture ?? "/default.jpg"} alt='' width={1080} height={1080} />
          <div className='text-lg font-bold mb-6'>Mr.{formatName(user?.firstName ?? "") + " " + formatName(user?.lastName ?? "")}</div>
        </div>
        <ChangePatientInfo currentPatient={currentPatient} />
      </div>
    </>
  ));
  const Skeleton3 = React.memo(() => (
    <>
      <div className="flex flex-1 w-full h-fit rounded-xl font-bold ">Your Appointments</div>
      <div className='w-full h-full flex flex-col overflow-y-scroll'><SideAppointments /></div>
    </>
  ));
  const Skeleton4 = React.memo(() => (
    <>
      <div className='flex items-start font-bold border border-transparent'>
        Book an Appointment
      </div>
      <div className="flex w-full h-full min-h-[6rem] rounded-xl bg-dot-black/[0.2] font-bold border border-transparent ">
        <div className='flex flex-col items-start h-full w-full'>
          <DoctorSelector
            message='Choose a doctor to visit'
            doctorList={doctorList} selected={selectedDr}
            setSelected={setSelectedDr} appointments={appointments}
            setAppointments={setAppointments} className="pl-4"
          />
          <DoctorAppointmentTable selectedDrId={selectedDr.id} appointments={appointments} currentPatientId={currentPatient?.id} />
        </div>
      </div>
    </>
  ));
  const items = [
    {
      description: 'Contact your doctor if something is wrong',
      header: <Skeleton1 />,
      className: "md:col-span-2 border border-neutral-200 h-full",
    },
    {
      description: <></>,
      header: <Skeleton2 />,
      className: "md:col-span-1 border border-neutral-200 h-full",
    },
    {
      description: "These are your appointments, you pay at the clinic",
      header: <Skeleton3 />,
      className: "md:col-span-1 border border-neutral-200 h-full",
    },
    {
      description:
        "Book an appointment in one of the green slots",
      header: <Skeleton4 />,
      className: "md:col-span-2 border border-neutral-200 h-full",
    },
  ];
  return (
    <>
      {hasAccess ?
        <div className="">
          <Navbar
            patients={patients}
            setIdShown={setIdShown}
            setOpenModal={setOpenModal}
            setOpenModalProfile={setOpenModalProfile}
            setCurrentPatient={setCurrentPatient}
            user={user}
          />
          {openModal && <AddPatient openModal={openModal} setOpenModal={setOpenModal} />}
          {openModalProfile && <ChangeProfileInfo openModalProfile={openModalProfile} setOpenModalProfile={setOpenModalProfile} user={user} setUser={setUser} />}
          <section className="h-lvh w-[100%]">
            <BentoGrid className="w-[95%] mx-auto h-lvh md:auto-rows-[20rem]">
              {items.map((item, i) => (
                <BentoGridItem
                  key={i}
                  description={item.description}
                  header={item.header}
                  className={item.className}
                />
              ))}
            </BentoGrid>
          </section>
          {/* <section className=''>
            <RatingCards />
          </section> */}
        </div> :
        <div>Access Denied</div>}
    </>
  )
}

export default React.memo(patientPortal)