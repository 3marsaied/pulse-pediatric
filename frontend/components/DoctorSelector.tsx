import React, { Fragment, SetStateAction, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { formatFullName } from '@/utils/formatFuncs'
import { cn } from '@/utils/cn'
interface Doctor {
    title: string;
    link: string;
    thumbnail: string;
    numberOfReviews: number;
    avarageRating: number;
    id: number;
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
}
function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const DoctorSelector = ({
    className,
    doctorList,
    message,
    selected,
    setSelected,
    appointments,
    setAppointments }: {
        className: string,
        doctorList: Doctor[] | undefined,
        message: string, selected: Doctor,
        setSelected: React.Dispatch<SetStateAction<Doctor>>,
        appointments: Appointment[],
        setAppointments: React.Dispatch<SetStateAction<Appointment[]>>
    }) => {
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    };
    async function fetchAppointmentList(selectedDrId: number) {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_NAME}/get/doctor/appointments/table/${selectedDrId}/${localStorage.getItem("userId")}?token=${localStorage.getItem("accessToken")}`,
            { headers }
        );
        if (!response.ok) {
            console.log("ERRORRR")
        }
        const data = await response.json();
        setAppointments(data);
    };
    const handleChangeDoctor = (newDoc: Doctor) => {
        setSelected(newDoc)
        fetchAppointmentList(newDoc.id)
    }
    return (
        <div className={cn("flex justify-start items-center h-8 space-x-4", className)}>
            <Listbox value={selected} onChange={handleChangeDoctor} >
                {({ open }) => (
                    <>
                        <Listbox.Label className="flex text-lg font-medium leading-6 text-black">{message}</Listbox.Label>
                        <div className="relative">
                            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <span className="flex items-center">
                                    <img src={selected.thumbnail} alt="/default.jpg" className="h-5 w-5 flex-shrink-0 rounded-full object-cover" />
                                    <span className="ml-3">{formatFullName(selected.title)}</span>
                                    {selected.id === 0 ? <span className=''>Please select a Doctor</span> : ""}
                                    <span className='ml-4 text-sm font-light'>{`${selected.avarageRating}`}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#FFD700" className="w-4 h-4">
                                        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                                    </svg>
                                    <span className='ml-2 text-sm font-light'>{`(${selected.numberOfReviews} reviews)`}</span>

                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </span>
                            </Listbox.Button>

                            <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {doctorList?.map((person) => (
                                        <Listbox.Option
                                            key={person.title}
                                            className={({ active }) =>
                                                classNames(
                                                    active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                                                    'relative cursor-default select-none py-2 pl-3 pr-9'
                                                )
                                            }
                                            value={person}
                                        >
                                            {({ selected, active }) => (
                                                <>
                                                    <div className="flex items-center">
                                                        <img src={person.thumbnail} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
                                                        <span
                                                            className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                                                        >
                                                            {formatFullName(person.title)}
                                                        </span>
                                                    </div>

                                                    {selected ? (
                                                        <span
                                                            className={classNames(
                                                                active ? 'text-white' : 'text-indigo-600',
                                                                'absolute inset-y-0 right-0 flex items-center pr-4'
                                                            )}
                                                        >
                                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </>
                )}
            </Listbox>
        </div>
    )
}

export default React.memo(DoctorSelector)