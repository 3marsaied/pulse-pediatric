import { cn } from '@/utils/cn';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { Fragment, useState } from 'react';
import { Transition } from '@headlessui/react';
import { CircularProgress } from '@mui/material';


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
}
const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};
const changePatientInfo = ({ openModal, setOpenModal, currentPatient }: { openModal: boolean, setOpenModal: React.Dispatch<React.SetStateAction<boolean>>, currentPatient: Patient | undefined }) => {
    const [formData, setFormData] = useState({
        firstName: currentPatient?.firstName,
        lastName: currentPatient?.lastName,
        age: currentPatient?.age,
        gender: currentPatient?.gender,
        parentId: currentPatient?.parentId
    })
    const [loading, setLoading] = useState(false)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            },
            body: JSON.stringify(formData),
        };
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_NAME}/update/patient/${currentPatient?.id}/${localStorage.getItem("userId")}?token=${localStorage.getItem("accessToken")}`, requestOptions);
            if (response.status === 201 || response.status === 200) {
                setLoading(false)
                location.reload()
            }
            else {
                setLoading(false)
            }
        }
        catch (error) {
            console.error('Error Updating Patient:', error)
        }
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    return (
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
                <div className="fixed top-0 left-0 w-full h-full bg-gray-400 bg-opacity-70 z-40 flex justify-center items-center">
                    <div className='max-w-md w-full mx-auto my-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black flex flex-col'>
                        <div className='w-full flex justify-between'>
                            <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                                Edit this Patient's Information
                            </p>
                            <button onClick={() => setOpenModal(!openModal)} className="px-2 rounded-full bg-gradient-to-br from-black to-neutral-600 text-white hover:shadow-xl transition duration-200">
                                X
                            </button>
                        </div>
                        <form className="my-8 bg-white" onSubmit={handleSubmit}>
                            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                                <LabelInputContainer>
                                    <Label htmlFor="firstname">Firstname</Label>
                                    <Input id="firstname" name='firstName' value={formData.firstName} onChange={handleChange} required placeholder={currentPatient?.firstName} type="text" />
                                </LabelInputContainer>
                                <LabelInputContainer>
                                    <Label htmlFor="lastname">Lastname</Label>
                                    <Input id="lastname" name='lastName' value={formData.lastName} onChange={handleChange} required placeholder={currentPatient?.lastName} type="text" />
                                </LabelInputContainer>
                            </div>
                            <LabelInputContainer className="mb-4">
                                <Label htmlFor="age">Age</Label>
                                <Input id="age" name='age' value={formData.age} onChange={handleChange} required placeholder={currentPatient?.age?.toString()} type="number" />
                            </LabelInputContainer>
                            <LabelInputContainer className="mb-4">
                                <Label htmlFor="gender">Gender</Label>
                                <Input id="gender" name='gender' value={formData.gender} onChange={handleChange} required placeholder={currentPatient?.gender} type="text" />
                            </LabelInputContainer>
                            <LabelInputContainer className="mb-4">
                                <Label htmlFor="parentId">Parent ID</Label>
                                <Input id="parentId" name='parentId' value={formData.parentId} onChange={handleChange} required placeholder="" type="text" />
                            </LabelInputContainer>
                            <div className='flex justify-center'>
                                <button
                                    className="bg-gradient-to-br relative group/btn from-black to-neutral-600 block w-[50%] text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
                                    type="submit"
                                    disabled={loading ? true : false}
                                >
                                    {loading ? <CircularProgress color="warning" size={"1.3rem"} /> : <p>Update Patient Data</p>}
                                </button>
                            </div>
                        </form>
                        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
                    </div>
                </div>
            </Transition.Child>
        </Transition>
    )
}

export default React.memo(changePatientInfo)