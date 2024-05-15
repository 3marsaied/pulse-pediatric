import { Fragment, SetStateAction, useState } from 'react'
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
function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function PatientSelector({
    className,
    patientList,
    message,
    selected,
    setSelected }: {
        className: string,
        patientList: PatientObj[] | undefined,
        message: string, selected: PatientObj,
        setSelected: React.Dispatch<SetStateAction<PatientObj>>,
    }) {

    const handleChangeDoctor = (newPatient: PatientObj) => {
        setSelected(newPatient)
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
                                    <img src={selected.parentPic} alt="/default.jpg" className="h-5 w-5 flex-shrink-0 rounded-full" />
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