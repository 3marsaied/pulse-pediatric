import React, { useEffect, useState } from 'react'
import { formatName, formatTime } from '@/utils/formatFuncs'
import { CircularProgress } from "@mui/material";
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
interface Patient {

    firstName: string,
    lastName: string,
    parentFirstName: string,
    parentLastName: string,
    parentPic: string,
    age: number,
    id: number,


};
const SideAppointmentsDrPortal = () => {

    const [myAppointments, setMyAppointments] = useState([] as Appointment[])
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    };
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
    };



    useEffect(() => {
        fetchMyAppointmentList();

    }, []);

    //   async function fetchMyPatient(patientId: number) {
    //     const response = await fetch(
    //         `${process.env.NEXT_PUBLIC_SERVER_NAME}/patient/${patientId}/${localStorage.getItem("userId")}/?token=${localStorage.getItem("accessToken")}`,
    //         { headers }
    //     );
    //     if (!response.ok) {
    //         console.log("ERRORRR")
    //     }
    //     const data = await response.json();

    // };

    let myAppointmentList = myAppointments.length === 0 ? (
        <div>No appointments yet</div>
    ) : (
        myAppointments.map((appointment) => {
            if (appointment.patientId !== null) {
                console.log(appointment.patientId);
                console.log(localStorage.getItem("userId"));

            }


            return (
                <div className='w-[95%] h-20 text-black bg-neutral-50 border rounded-xl p-4 flex justify-between items-center'>
                    <div className='flex max-w-[13rem] flex-row space-x-4 items-center'>
                        <span>
                            <img className='h-12 w-12 rounded-full object-cover min-w-12' src={appointment?.parentPic} alt='PatPic' />
                        </span>
                        <span className='text-neutral-700 font-semibold hover:text-black'>{formatName(appointment?.patientFirstName ?? 'N/A')} {formatName(appointment?.parentFirstName ?? 'N/A')}
                        </span>
                    </div>
                    <div className='text-sm space-x-2 font-light'>

                        <span>
                            {formatTime(appointment.From)}-{formatTime(appointment.To)}
                        </span>
                        <span className='ml-2'>
                            {appointment.appointmentDate}
                        </span>

                    </div>
                </div>
            );
        })
    );
    return (
        <div className='space-y-2'>{myAppointmentList}</div>
    )
}

export default SideAppointmentsDrPortal