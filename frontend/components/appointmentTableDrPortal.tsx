"use client"
import React, { useState, Fragment, useEffect } from 'react';
import { formatName, formatTime, formatTimeNum } from '@/utils/formatFuncs';
import { Transition } from '@headlessui/react';

interface Appointment {
  appointmentId: number;
  parentId: number;
  patientId: number;
  patientFirstName: string;
  parentFirstName: string;
  parentLastName: string;
  parentPic: string;
  appointmentDate: string;
  From: string;
  To: string;
  isTaken: boolean;
}


const DoctorAppointmentTableDrPortal = () => {


  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const hours = Array.from({ length: 9 }, (_, index) => index + 9);

  const [appointments, setMyAppointments] = useState([] as Appointment[])

  //create list called patients
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
  };

  useEffect(() => {

    fetchMyAppointmentList();

  }, []);


  async function fetchMyAppointmentList() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_NAME}/get/doctor/appointments/table/${localStorage.getItem("userId")}/${localStorage.getItem("userId")}?token=${localStorage.getItem("accessToken")}`,
      { headers }
    );
    if (!response.ok) {
      console.log("ERRORRR")
    }
    const data = await response.json();
    setMyAppointments(data);
    // for (let i = 0; i < data.length; i++) {
    //     await fetchMyPatient(data[i].patientId);
    // }

  };





  return (
    <>


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
                          backgroundColor: appointment && appointment.isTaken ? '#ffffff' : '#ecfccb',
                        }
                      }
                      className='border border-neutral-300 px-2 text-center text-md font-light'
                    >
                      {
                        appointment && appointment.isTaken ? (
                          <div className='w-[100%] h-10 text-black bg-neutral-50 rounded-xl flex justify-center items-center'>
                            <div className='flex max-w-[13rem] flex-row space-x-4 items-center'>
                              <span>
                                <img className='h-9 w-9 rounded-full object-cover min-w-9' src={appointment?.parentPic} alt='PatPic' />
                              </span>
                              <span className='text-neutral-700 font-semibold hover:text-black'>{formatName(appointment?.patientFirstName ?? 'N/A')} {formatName(appointment?.parentFirstName ?? 'N/A')}
                              </span>
                            </div>


                          </div>
                        ) : 'Available'
                      }

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
}


export default DoctorAppointmentTableDrPortal