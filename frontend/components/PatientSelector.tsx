import React, { Fragment, SetStateAction, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { formatFullName, formatName } from '@/utils/formatFuncs'
import { cn } from '@/utils/cn'
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
function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const PatientSelector = ({
    className,
    patientList,
    message,
    selected,
    setCurrentPatient,
    setSelected }: {
        className: string,
        patientList: PatientObj[] | undefined,
        message: string, selected: PatientObj,
        setCurrentPatient: React.Dispatch<SetStateAction<Patient | undefined>>
        setSelected: React.Dispatch<SetStateAction<PatientObj>>,
    }) => {

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    };
    async function fetchCurrentPatient(patientId: number) {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_NAME}/patient/${patientId}/${localStorage.getItem("userId")}?token=${localStorage.getItem("accessToken")}`,
            { headers }
        );
        if (!response.ok) {
            console.log("Error: Request sent no data")
        }
        const data = await response.json();
        setCurrentPatient(data);
    };
    const handleChangeDoctor = (newPatient: PatientObj) => {
        setSelected(newPatient)
        fetchCurrentPatient(newPatient.patientId)
    }

    return (
        <div className={cn("flex justify-start items-center h-8 space-x-4", className)}>
            <Listbox value={selected} onChange={handleChangeDoctor} >
                {({ open }) => (
                    <>
                        <Listbox.Label className="flex text-md font-bold leading-6 text-black">{message}</Listbox.Label>
                        <div className="relative">
                            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <span className="flex items-center">
                                    <img src={selected.parentPic} alt="/default.jpg" className="h-5 w-5 flex-shrink-0 rounded-full object-cover" />
                                    <span className="ml-3">{formatName(selected.patientFirstName)}</span>
                                    {selected.patientId === 0 ? <span className=''>Please select a Patient</span> : ""}
                                    <span className='ml-2 text-sm font-light'>{`(${formatFullName(selected.parentFirstName + " " + selected.parentLastName)})`}</span>

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
                                    {patientList?.map((person) => (
                                        <Listbox.Option
                                            key={person.patientFirstName}
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
                                                        <img src={person.parentPic} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
                                                        <span
                                                            className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                                                        >
                                                            {formatName(person.patientFirstName)} {`(${formatFullName(person.parentFirstName + " " + person.parentLastName)})`}
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

export default React.memo(PatientSelector)