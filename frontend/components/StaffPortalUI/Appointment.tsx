"use client"
import React from 'react'
import { Input} from '../ui/input'
import { Label } from '../ui/label';
import { cn } from '@/utils/cn';
import AutocompleteIntroduction from '../ui/DoctorsDropDown';
import AppointmentDate from '../ui/AppointmentDate';
import DoctorSelector from '@/components/DoctorSelector';
import DoctorAppointmentTable from '../appointmentTable'
import axios from 'axios';
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
interface Doctor {
  title: string;
  link: string;
  thumbnail: string;
  numberOfReviews: number;
  avarageRating: number;
  id: number;
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
const Appointment = () => {
    const LabelInputContainer = ({
        children,
        className,
      }: {
        children: React.ReactNode;
        className?: string;
      }) => {
        return (
          <div className={cn("flex flex-col col-span-1 space-y-2 w-full", className)}>
            {children}
          </div>
        );
      };
      const [options, setOptions] = React.useState([
        { value: 'chocolate', label: 'Chocolate' },
      ])
    
  const [doctorList, setDoctorList] = React.useState([] as Doctor[])
  const [currentPatient, setCurrentPatient] = React.useState({} as Patient | undefined)
  const [appointments, setAppointments] = React.useState([] as Appointment[])
  const [selectedDr, setSelectedDr] = React.useState({ title: "", link: "", thumbnail: "/default.jpg", numberOfReviews: 0, avarageRating: 0, id: 0, } as Doctor)
  const [patientID, setPatientID] = React.useState(Number)

async function fetchDoctorList() {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_NAME}/doctorList`,
      { headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      } })
      setDoctorList(response.data)
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
}
React.useEffect(() => {
  setAppointments([
    {
      id: 1,
      parentId: 1,
      doctorId: 1,
      patientId: 1,
      appointmentDate: "2022-01-01",
      From: "10:00",
      To: "10:30",
      isTaken: true
    },
    {
      id: 2,
      parentId: 1,
      doctorId: 1,
      patientId: 1,
      appointmentDate: "2022-01-01",
      From: "10:30",
      To: "11:00",
      isTaken: true
    },
    {
      id: 3,
      parentId: 1,
      doctorId: 1,
      patientId: 1,
      appointmentDate: "2022-01-01",
      From: "11:00",
      To: "11:30",
      isTaken: true
    }
  ])
  
  setCurrentPatient({
    id: 1,
    age: 10,
    firstName: "John",
    lastName: "Doe",
    parentFirstName: "Jane",
    parentLastName: "Doe",
    parentPhoneNumber: "1234567890",
    gender: "male",
    parentId: 1})
  fetchDoctorList()
}, [setAppointments]);
  const handlePatientID = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatientID(Number(e.target.value))
  }
  return (
    <form className= 'm-5 w-screen rounded-md shadow-lg flex-col   bg-zinc-200' >
        <div className='m-5 text-3xl from-neutral-800 '> Patient  Scheduling </div>
        <div className=' grid gap-10 grid-cols-1 md:grid-cols-3 m-3'>
        
        <LabelInputContainer>
            <Label> Patient First Name </Label>
            <Input id="firstname" name='firstName' required placeholder='First Name' type="text" />
        </LabelInputContainer>
        <LabelInputContainer>
            <Label> Patient Last Name </Label>
            <Input id='lastname'  name='lastname' placeholder='Last Name' type='text' />
        </LabelInputContainer>
        <LabelInputContainer>
            <Label> Patient ID</Label>
            <Input id='patientcode' value={patientID} onChange={handlePatientID} name='patientcode' placeholder='Patient Code' type='number' />
        </LabelInputContainer>
        <LabelInputContainer>
            
            <div className=' mt-5 mb-5'><DoctorSelector
            message='Choose a doctor '
            doctorList={doctorList} selected={selectedDr}
            setSelected={setSelectedDr} appointments={appointments}
            setAppointments={setAppointments} className="pl-4 h-fit"
          /></div>

        </LabelInputContainer>
        
        
        </div>
        <div className='mt-5' >
        <LabelInputContainer>
            <Label className='ml-3'> Pick appointment</Label>
            <DoctorAppointmentTable selectedDrId={selectedDr.id} appointments={appointments} currentPatientId={patientID} />
        </LabelInputContainer>
        </div>
        {/* <div className='flex justify-end mr-2 mt-10 mb-1'>
          <button
              className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-1/5 text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
            > Submit  </button>
        </div> */}
    </form>
  )
}

export default Appointment
