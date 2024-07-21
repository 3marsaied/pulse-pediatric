"use client"
import AddUser from '@/components/AdminComponents/AddUser';
import EditUser from '@/components/AdminComponents/EditUser';
import PatientSelector from '@/components/PatientSelector';
import Table from '@/components/Table';
import MedicalRecordEdit from '@/components/medicalRecordEdit';
import AdminSideBar from "@/components/AdminComponents/AdminSideBar"
import NavbarLanding from '@/components/navbarLanding';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaUser } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { PiBabyBold } from "react-icons/pi";
import { FaNotesMedical } from "react-icons/fa";
import { FaTable } from "react-icons/fa";
import { MdOutlineRateReview } from "react-icons/md";
import { FaChartPie } from "react-icons/fa";
import EditDoctor from '@/components/AdminComponents/EditDoctor';
import AddDoctor from '@/components/AdminComponents/AddDoctor';
import AddPatient from '@/components/AdminComponents/AddPatient';
import EditPatient from '@/components/AdminComponents/EditPatient';
import AddAppointment from '@/components/AdminComponents/AddAppointment';
import EditAppointment from '@/components/AdminComponents/EditAppointment';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import DoctorSelectorAdmin from '@/components/AdminComponents/DoctorSelectorAdmin';
import DoctorReviewsAdmin from '@/components/AdminComponents/DoctorReviewsAdmin';
import ReviewStatistics from '@/components/AdminComponents/reviewStatistics';


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
}
interface PatientObj {
  parentPic: string,
  patientFirstName: string,
  patientLastName: string,
  parentFirstName: string,
  parentLastName: string,
  patientId: number
};
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
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  userName: string,
  createdAt: string,
  profilePicture: string,
  price: number
}; //list
interface DoctorStat {
  title: string;
  link: string;
  thumbnail: string;
  numberOfReviews: number;
  avarageRating: number;
  id: number;
};

const adminPanel = () => {
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false)
  const [disable, setDisable] = useState(false)
  const [section, setSection] = useState(0)
  const sectionsIcons = [<FaUser className="w-16 h-16 p-4" />, <FaUserDoctor className="w-16 h-16 p-4" />, <PiBabyBold className="w-16 h-16 p-4" />, <FaNotesMedical className="w-16 h-16 p-4" />, <FaTable className="w-16 h-16 p-4" />, <FaChartPie className="w-16 h-16 p-4" />]

  // User States
  const [userList, setUserList] = useState([{ userId: 0, firstName: "", lastName: "", email: "", userName: "", createdAt: "", phone: "", age: 0, profilePicture: "", role: "" }] as User[])
  const [openModalUserAdd, setOpenModalUserAdd] = useState(false)
  const [openModalUserEdit, setOpenModalUserEdit] = useState(false)
  const [userToDelete, setUserToDelete] = useState<any>()

  // Doctor States
  const [doctorList, setDoctorList] = useState([{ id: 0, firstName: "", lastName: "", email: "", userName: "", createdAt: "", profilePicture: "", price: 0 }] as Doctor[])
  const [openModalDoctorAdd, setOpenModalDoctorAdd] = useState(false)
  const [openModalDoctorEdit, setOpenModalDoctorEdit] = useState(false)
  const [doctorToDelete, setDoctorToDelete] = useState<any>()

  // Patient States
  const [patientListAdmin, setPatientListAdmin] = useState([{ id: 0, age: 0, firstName: "", lastName: "", parentFirstName: "", parentLastName: "", parentPhoneNumber: "", gender: "", parentId: 0 }] as Patient[])
  const [openModalPatientAdd, setOpenModalPatientAdd] = useState(false)
  const [openModalPatientEdit, setOpenModalPatientEdit] = useState(false)
  const [patientToDelete, setPatientToDelete] = useState<any>()

  //Medical Record States
  const [patientList, setPatientList] = useState([] as PatientObj[])
  const [selectedPat, setSelectedPat] = useState({ parentPic: "/default.jpg", patientFirstName: "", patientLastName: "", parentFirstName: '', parentLastName: '', patientId: 0, } as PatientObj)
  const [currentPatient, setCurrentPatient] = useState({} as Patient | undefined) // medical record

  // Appointment States
  const [appointmentList, setAppointmentList] = useState([{ id: 0, firstName: "", lastName: "", email: "", userName: "", createdAt: "", profilePicture: "", price: 0 }] as Doctor[])
  const [openModalAppointmentAdd, setOpenModalAppointmentAdd] = useState(false)
  const [openModalAppointmentEdit, setOpenModalAppointmentEdit] = useState(false)
  const [appointmentToDelete, setAppointmentToDelete] = useState<any>()

  // Statistics States
  const [doctorListStat, setDoctorListStat] = useState([{ title: "", link: "", thumbnail: "/default.jpg", numberOfReviews: 0, avarageRating: 0, id: 0 }] as DoctorStat[])
  const [selected, setSelected] = useState({ title: "", link: "", thumbnail: "/default.jpg", numberOfReviews: 0, avarageRating: 0, id: 0 } as DoctorStat)
  const [doctorToView, setDoctorToView] = useState({ title: "", link: "", thumbnail: "/default.jpg", numberOfReviews: 0, avarageRating: 0, id: 0 } as DoctorStat)

  const handlePageLoad = () => {
    if (localStorage.getItem("role") !== "admin") {
      router.push('/Forbidden')
    }
    else {
      setHasAccess(true)
    }
  }
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
  };
  //User Functions
  async function fetchUserList() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_NAME}/get/all/users/${localStorage.getItem("userId")}?token=${localStorage.getItem("accessToken")}`,
      { headers }
    );
    if (!response.ok) {
      console.log("Error: Request sent no data")
    }
    const data: User[] = await response.json();
    const formattedData = data.map(user => ({
      ...user,
      createdAt: user.createdAt.substring(0, 10)
    }));
    setUserList(formattedData);

  };
  async function handleDeleteUser(id: number) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_NAME}/delete/user/${id}/${localStorage.getItem("userId")}?token=${localStorage.getItem("accessToken")}`,
      { method: 'DELETE', headers }
    );
    if (response.ok) {
      location.reload();
    }
  };
  async function fetchUser(id: number) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_NAME}/get/user/${id}/${localStorage.getItem("userId")}?token=${localStorage.getItem("accessToken")}`,
      { headers }
    );
    if (!response.ok) {
      console.log("Error: Request sent no data")
    }
    const data = await response.json();
    setUserToDelete(data);
  };
  async function handleEditUser(id: number) {
    setOpenModalUserEdit(true)
    fetchUser(id)
  };

  //Medical Record Functions
  async function fetchPatientList() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_NAME}/get/all/patientsObj/${localStorage.getItem("userId")}?token=${localStorage.getItem("accessToken")}`,
      { headers }
    );
    if (!response.ok) {
      console.log("Error: Request sent no data")
    }
    const data = await response.json();
    setPatientList(data);
  };

  // headers
  const headersUser =
    [
      { label: "ID", size: 50 },
      { label: "First Name", size: 120 },
      { label: "Last Name", size: 120 },
      { label: "Email", size: 300 },
      { label: "User Name", size: 180 },
      { label: "Created At", size: 120 },
      { label: "Phone", size: 120 },
      { label: "Age", size: 50 },
      { label: "Picture", size: 270 },
      { label: "Role", size: 90 }
    ];//1620
  const headersDoctor =
    [
      { label: "ID", size: 50 },
      { label: "First Name", size: 120 },
      { label: "Last Name", size: 120 },
      { label: "Email", size: 300 },
      { label: "User Name", size: 180 },
      { label: "Created At", size: 120 },
      { label: "Picture", size: 270 },
      { label: "Price", size: 100 },
    ];//1460
  const headersPatient =
    [
      { label: "ID", size: 50 },
      { label: "Age", size: 50 },
      { label: "First Name", size: 120 },
      { label: "Last Name", size: 120 },
      { label: "P First Name", size: 120 },
      { label: "P Last Name", size: 120 },
      { label: "P Phone", size: 120 },
      { label: "Gender", size: 120 },
      { label: "PID", size: 50 },
    ];//1070
  const headersAppointment =
    [
      { label: "ID", size: 50 },
      { label: "Patient First Name", size: 180 },
      { label: "Parent First Name", size: 180 },
      { label: "Parent Last Name", size: 180 },
      { label: "Doctor First Name", size: 180 },
      { label: "Doctor Last Name", size: 180 },
      { label: "DID", size: 50 },
      { label: "Date", size: 120 },
      { label: "From", size: 50 },
      { label: "To", size: 50 },
    ];//1420

  // Doctor Functions
  async function fetchDoctorList() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_NAME}/get/all/doctors/${localStorage.getItem("userId")}?token=${localStorage.getItem("accessToken")}`,
      { headers }
    );
    if (!response.ok) {
      console.log("Error: Request sent no data")
    }
    const data: Doctor[] = await response.json();
    const formattedData = data.map(doctor => ({
      ...doctor,
      createdAt: doctor.createdAt.substring(0, 10)
    }));
    setDoctorList(formattedData);
  };
  async function handleDeleteDoctor(id: number) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_NAME}/delete/doctor/${id}/${localStorage.getItem("userId")}?token=${localStorage.getItem("accessToken")}`,
      { method: 'DELETE', headers }
    );
    if (response.ok) {
      location.reload();
    }
  };
  async function fetchDoctor(id: number) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_NAME}/get/doctor/${id}/${localStorage.getItem("userId")}?token=${localStorage.getItem("accessToken")}`,
      { headers }
    );
    if (!response.ok) {
      console.log("Error: Request sent no data")
    }
    const data = await response.json();
    setDoctorToDelete(data.doctor);
  };
  async function handleEditDoctor(id: number) {
    setOpenModalDoctorEdit(true)
    fetchDoctor(id)
  };

  // Patient Functions
  async function fetchPatientListAdmin() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_NAME}/get/all/patients/${localStorage.getItem("userId")}?token=${localStorage.getItem("accessToken")}`,
      { headers }
    );
    if (!response.ok) {
      console.log("Error: Request sent no data")
    }
    const data = await response.json();
    setPatientListAdmin(data);

  };
  async function handleDeletePatient(id: number) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_NAME}/delete/patient/${id}/${localStorage.getItem("userId")}?token=${localStorage.getItem("accessToken")}`,
      { method: 'DELETE', headers }
    );
    if (response.ok) {
      location.reload();
    }
  };
  async function fetchPatient(id: number) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_NAME}/get/patient/${id}/${localStorage.getItem("userId")}?token=${localStorage.getItem("accessToken")}`,
      { headers }
    );
    if (!response.ok) {
      console.log("Error: Request sent no data")
    }
    const data = await response.json();
    setPatientToDelete(data);
  };
  async function handleEditPatient(id: number) {
    setOpenModalPatientEdit(true)
    fetchPatient(id)
  };

  // Appointment Functions
  async function fetchAppointmentList() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_NAME}/get/all/appointments/${localStorage.getItem("userId")}?token=${localStorage.getItem("accessToken")}`,
      { headers }
    );
    if (!response.ok) {
      console.log("Error: Request sent no data")
    }
    const data = await response.json();
    setAppointmentList(data);

  };
  async function handleDeleteAppointment(id: number) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_NAME}/delete/appointment/${id}/${localStorage.getItem("userId")}?token=${localStorage.getItem("accessToken")}`,
      { method: 'DELETE', headers }
    );
    if (response.ok) {
      location.reload();
    }
  };
  async function fetchAppointment(id: number) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_NAME}/get/appointment/${id}/${localStorage.getItem("userId")}?token=${localStorage.getItem("accessToken")}`,
      { headers }
    );
    if (!response.ok) {
      console.log("Error: Request sent no data")
    }
    const data = await response.json();
    setAppointmentToDelete(data);
  };
  async function handleEditAppointment(id: number) {
    setOpenModalAppointmentEdit(true)
    fetchAppointment(id)
  };

  // Statistics Functions
  async function fetchDoctorListStat() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_NAME}/doctorList`,
      { headers }
    );
    if (!response.ok) {
      console.log("Error: Request sent no data")
    }
    const data = await response.json();
    setDoctorListStat(data);

  };

  useEffect(() => {
    handlePageLoad()
    fetchUserList()
    fetchPatientList()
    fetchDoctorList()
    fetchPatientListAdmin()
    fetchAppointmentList()
    fetchDoctorListStat()
  }, []);
  // Assem
  const SkeletonUser = React.memo(() => (
    <>
      {openModalUserAdd && <AddUser openModal={openModalUserAdd} setOpenModal={setOpenModalUserAdd} />}
      {openModalUserEdit && <EditUser openModal={openModalUserEdit} setOpenModal={setOpenModalUserEdit} user={userToDelete} setUser={setUserToDelete} />}
      <div className='mx-auto my-auto'>
        <Table
          data={userList}
          height={500}
          width={1620}
          rowHeight={60}
          headers={headersUser}
          setAddModal={setOpenModalUserAdd}
          editHandler={handleEditUser}
          deleteHandler={handleDeleteUser}
          tableFor='User'
        />
      </div>
    </>
  ));
  const SkeletonMedicalRecord = React.memo(() => (
    <div className='mx-auto my-auto p-2 border border-neutral-300 rounded-2xl'>
      <div className='flex items-center justify-between font-bold border border-transparent'>
        <span>Patient Medical Record</span>
        <span><PatientSelector className='' message='Please select a Patient' selected={selectedPat} setSelected={setSelectedPat} setCurrentPatient={setCurrentPatient} patientList={patientList} /></span>
      </div>
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-dot-black/[0.2] font-bold border border-transparent ">
        <MedicalRecordEdit currentPatient={currentPatient} />
      </div>
    </div>
  ));

  const SkeletonPatient = React.memo(() => (
    <>
      {openModalPatientAdd && <AddPatient openModal={openModalPatientAdd} setOpenModal={setOpenModalPatientAdd} />}
      {openModalPatientEdit && <EditPatient openModal={openModalPatientEdit} setOpenModal={setOpenModalPatientEdit} currentPatient={patientToDelete} />}
      <div className='mx-auto my-auto'>
        <Table
          data={patientListAdmin}
          height={500}
          width={1070}
          rowHeight={60}
          headers={headersPatient}
          setAddModal={setOpenModalPatientAdd}
          editHandler={handleEditPatient}
          deleteHandler={handleDeletePatient}
          tableFor='Patient'
        />
      </div>
    </>
  ));

  // Yara
  const SkeletonDoctor = React.memo(() => (
    <>
      {openModalDoctorAdd && <AddDoctor openModal={openModalDoctorAdd} setOpenModal={setOpenModalDoctorAdd} />}
      {openModalDoctorEdit && <EditDoctor openModal={openModalDoctorEdit} setOpenModal={setOpenModalDoctorEdit} doctor={doctorToDelete} setDoctor={setDoctorToDelete} />}
      <div className='mx-auto my-auto'>
        <Table
          data={doctorList}
          height={500}
          width={1460}
          rowHeight={60}
          headers={headersDoctor}
          setAddModal={setOpenModalDoctorAdd}
          editHandler={handleEditDoctor}
          deleteHandler={handleDeleteDoctor}
          tableFor='Doctor'
        />
      </div>
    </>
  ));
  const SkeletonAppointment = React.memo(() => (
    <>
      {openModalAppointmentAdd && <AddAppointment openModal={openModalAppointmentAdd} setOpenModal={setOpenModalAppointmentAdd} />}
      {openModalAppointmentEdit && <EditAppointment openModal={openModalAppointmentEdit} setOpenModal={setOpenModalAppointmentEdit} appointment={appointmentToDelete} setAppointment={setAppointmentToDelete} />}
      <div className='mx-auto my-auto'>
        <Table
          data={appointmentList}
          height={500}
          width={1420}
          rowHeight={60}
          headers={headersAppointment}
          setAddModal={setOpenModalAppointmentAdd}
          editHandler={handleEditAppointment}
          deleteHandler={handleDeleteAppointment}
          tableFor='Appointment'
        />
      </div>
    </>
  ));


  const SkeletonStatistics = React.memo(() => (
    <div className='w-[1200px] h-[800px] flex space-y-4 justify-between items-center mx-auto my-auto p-2 border border-neutral-300 rounded-2xl'>
      <div className='flex flex-col space-y-4 justify-center items-center w-full h-full text-sm font-semibold '>
        <div className="min-h-[6rem] space-y-4 rounded-xl bg-dot-black/[0.2] font-bold border border-transparent ">
          <div className='flex space-y-4 items-center justify-between'>
            <span>Review doctors</span>
            <DoctorSelectorAdmin className="h-3" setDoctorToView={setDoctorToView} message='' doctorList={doctorListStat} selected={selected} setSelected={setSelected} />
          </div>
          <div>
            <DoctorReviewsAdmin doctor={selected} />
          </div>
        </div>
      </div>
      <div className=''>
        <ReviewStatistics />
      </div>
    </div>
  ));


  return (
    <>
      {hasAccess ?
        <div>
          <NavbarLanding />
          <div className='flex h-[850px]'>
            <div className='h-full'>
              <AdminSideBar section={section} setSection={setSection} tabs={sectionsIcons} />
            </div>
            <div className='flex h-full w-full'>
              {section === 0 && <SkeletonUser />}
              {section === 1 && <SkeletonDoctor />}
              {section === 2 && <SkeletonPatient />}
              {section === 3 && <SkeletonMedicalRecord />}
              {section === 4 && <SkeletonAppointment />}
              {section === 5 && <SkeletonStatistics />}

            </div>
          </div>
        </div> :
        <div className="text-8xl flex justify-center">Access Denied</div>}
    </>
  )
}

export default adminPanel