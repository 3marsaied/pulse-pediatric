"use client"
import React, { useState, Fragment } from 'react';
import { formatTime, formatTimeNum } from '@/utils/formatFuncs';
import { Transition } from '@headlessui/react';

interface Appointment {
  id: number,
  parentId: number,
  doctorId: number,
  patientId: number,
  appointmentDate: string,
  From: string,
  To: string,
  isTaken: true
}
const DoctorAppointmentTable = ({ appointments, selectedDrId, currentPatientId }: { appointments: Appointment[], selectedDrId: number, currentPatientId: number | undefined }) => {
  const userId = Number(localStorage.getItem("userId"))
  const [openModal, setOpenModal] = useState(false)
  const [openModalInvalid, setOpenModalInvalid] = useState(false)
  const [appointmentData, setAppointmentData] = useState<any>({})
  async function addAppointment(data: any) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data)
    };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_NAME}/add/appointment?token=${localStorage.getItem("accessToken")}`, requestOptions
    );
    if (!response.ok) {
      console.log("ERRORRR")
    }
  }
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const hours = Array.from({ length: 9 }, (_, index) => index + 9);
  const handleBookAppointment = (parentId: number, doctorId: number, patientId: number | undefined, appointmentDate: string, From: number | undefined, To: number | undefined, isTaken: true) => {
    // add confirmation of booking
    setOpenModal(true)
    setAppointmentData({ parentId: parentId, doctorId: doctorId, patientId: patientId, appointmentDate: appointmentDate, From: String(From), To: String(To), isTaken: isTaken })
  }
  const handleConfirm = (data: any) => {
    addAppointment(data);
    setOpenModal(false)
  }
  return (
    <>
      {openModal &&
        <Transition appear show={openModal} as={Fragment}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className='fixed top-0 left-0 bg-gray-400 bg-opacity-70 flex justify-center items-center w-screen h-screen z-40'>
              <div className='bg-neutral-100 min-w-[10rem] min-h-[10rem] flex flex-col justify-between rounded-xl p-4'>
                <div className='flex justify-center text-xl font-bold'>
                  Are you sure you want to book from {formatTime(appointmentData.From)} to {formatTime(appointmentData.To)}?
                </div>
                <div className='px-4 space-x-2 flex flex-row justify-evenly'>
                  <button onClick={() => setOpenModal(!openModal)} className="w-full px-4 py-2 opacity-80 text-black rounded-md h-full hover:bg-red-100 hover:text-black hover:transition duration-150 ease-linear">
                    Cancel
                  </button>
                  <button onClick={() => handleConfirm(appointmentData)} className="w-full px-4 py-2 opacity-80 text-black rounded-md h-full hover:bg-lime-100 hover:text-black hover:transition duration-150 ease-linear">
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </Transition>
      }
      {openModalInvalid &&
        <Transition appear show={openModalInvalid} as={Fragment}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className='fixed top-0 left-0 bg-gray-400 bg-opacity-70 flex justify-center items-center w-screen h-screen z-40'>
              <div className='bg-neutral-100 min-w-[10rem] min-h-[10rem] flex flex-col justify-between rounded-xl p-4'>
                <div className='flex justify-center text-xl font-bold'>
                  Sorry, This appointment is already taken. Please choose another slot.
                </div>
                <div className='px-4 space-x-2 flex flex-row justify-evenly'>
                  <button onClick={() => setOpenModalInvalid(!openModalInvalid)} className="max-w-fit px-4 py-2 opacity-80 text-black rounded-md h-full hover:bg-lime-100 hover:text-black hover:transition duration-150 ease-linear">
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </Transition>
      }
      <div className='w-full h-full p-4'>
        <table className='w-full rounded-t-3xl rounded-t-3xl h-full p-2 bg-neutral-100'>
          <thead className='p-2'>
            <tr className='p-2'>
              <th className='p-2'>Time</th>
              {days.map((day) => (
                <th className='p-2' key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody className='p-2'>
            {hours.map((hour) => (
              <tr className='p-2' key={hour}>
                <td className='p-2 text-center'>{`${formatTimeNum(hour)}:00`}</td>
                {days.map((day) => {
                  const appointment = appointments.find(
                    (appt) => appt.appointmentDate === day && Number(appt.From) === hour
                  );
                  return (
                    <td
                      key={`${day}-${hour}`}
                      style={
                        {
                          backgroundColor: appointment && appointment.isTaken ? '#fee2e2' : '#ecfccb',
                          cursor: appointment && appointment.isTaken ? 'not-allowed' : 'pointer',
                        }
                      }
                      className='border border-neutral-300 p-2 text-center text-md font-light hover:contrast-50 cursor-pointer'
                      onClick={appointment?.isTaken ? () => setOpenModalInvalid(true) : () => handleBookAppointment(userId, selectedDrId, currentPatientId, day, hour, hour + 1, true)}
                    >
                      {appointment && appointment.isTaken ? 'Not Available' : 'Available'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default React.memo(DoctorAppointmentTable);
