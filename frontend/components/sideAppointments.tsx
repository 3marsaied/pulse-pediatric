import React, { useEffect, useState } from 'react'
import { formatName, formatTime } from '@/utils/formatFuncs'
import { CircularProgress } from "@mui/material";
interface Appointment {
    id: number,
    parentId: number,
    doctorId: number,
    appointmentDate: string,
    From: string,
    To: string,
    isTaken: true
};
interface DoctorObj {
    doctorId: number,
    firstName: string,
    lastName: string,
    email: string,
    userName: string,
    createdAt: string,
    profilePicture: string,
    role: string,
    rating: number,
    numberOfRating: number,
    price: number
};
const SideAppointments = () => {
    const [myAppointments, setMyAppointments] = useState([] as Appointment[])
    const [doctors, setDoctors] = useState({} as Record<number, DoctorObj>);
    const [loading, setLoading] = useState(false)
    const [loadingList, setLoadingList] = useState(false)

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    };
    async function fetchMyAppointmentList() {
        setLoadingList(true)
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_NAME}/get/appointment/${localStorage.getItem("userId")}?token=${localStorage.getItem("accessToken")}`,
            { headers }
        );
        if (!response.ok) {
            console.log("ERRORRR")
        }
        if (response.ok) {
            setLoadingList(false)
        }
        const data = await response.json();
        setMyAppointments(data);
        setLoadingList(false)
    };
    async function fetchDoctor(doctorId: number) {
        if (!doctors[doctorId]) {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_NAME}/get/doctor/${doctorId}/${localStorage.getItem("userId")}?token=${localStorage.getItem("accessToken")}`,
                { headers }
            );
            const data = await response.json();
            setDoctors((prevDoctors) => ({
                ...prevDoctors,
                [doctorId]: data.doctor,
            }));
        }
    };
    async function deleteAppointment(appointmentId: number) {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_NAME}/delete/appointment/${appointmentId}/${localStorage.getItem("userId")}?token=${localStorage.getItem("accessToken")}`,
            { method: 'DELETE', headers }
        );
        if (response.ok) {
            setLoading(false);
            location.reload();
        }
        setLoading(false)
    };
    useEffect(() => {
        fetchMyAppointmentList();
    }, []);
    const handleAppointmentDelete = (appointmentId: number) => {
        setLoading(true);
        deleteAppointment(appointmentId);
    }

    let myAppointmentList = myAppointments.length === 0 ? (
        <div>No appointments yet</div>
    ) : (
        myAppointments.map((appointment) => {
            if (appointment.doctorId !== null) {
                fetchDoctor(appointment.doctorId);
            }
            const doctor = doctors[appointment.doctorId];
            return (
                <div className='w-[95%] h-20 text-black bg-neutral-50 border rounded-xl p-4 flex justify-between items-center'>
                    <div className='flex max-w-[13rem] flex-row space-x-4 items-center'>
                        <span>
                            <img className='h-12 w-12 rounded-full object-cover min-w-12' src={doctor?.profilePicture} alt='DocPic' />
                        </span>
                        <span className='text-neutral-700 font-semibold hover:text-black'>Dr.{formatName(doctor?.firstName)} {formatName(doctor?.lastName)}
                        </span>
                    </div>
                    <div className='text-sm space-x-2 font-light'>
                        <span>
                            {formatTime(appointment.From)}-{formatTime(appointment.To)}
                        </span>
                        <span className='ml-2'>
                            {appointment.appointmentDate}
                        </span>
                        <span className='ml-2'>
                            <button disabled={loading ? true : false} onClick={() => handleAppointmentDelete(appointment.id)} className="px-1.5 rounded-full text-sm bg-gradient-to-br from-black to-neutral-600 text-white hover:shadow-xl transition duration-200">
                                {loading ? <CircularProgress size={"0.8rem"} color="warning" /> : <>X</>}
                            </button>
                        </span>
                    </div>
                </div>
            );
        })
    );
    return (
        <>{!loadingList ? <div className='space-y-2'>{myAppointmentList}</div> : <div className="w-full h-full flex justify-center items-center"><CircularProgress color="primary" size={'10rem'} /></div>}</>
    )
}

export default React.memo(SideAppointments)