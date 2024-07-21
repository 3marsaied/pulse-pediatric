import React, { useState, Fragment } from 'react'
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Transition } from '@headlessui/react';
import { cn } from "@/utils/cn";
import { CircularProgress } from '@mui/material';

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
        </>
    );
};
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
const AddUser = ({ openModal, setOpenModal }: { openModal: boolean, setOpenModal: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        role: ""
    })
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            },
            body: JSON.stringify(formData),
        };
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_NAME}/add/user/${localStorage.getItem("userId")}?token=${localStorage.getItem("accessToken")}`, requestOptions);
            if (response.status === 201 || response.status === 200) {
                setLoading(false)
                setOpenModal(!openModal)
                location.reload()
            }
            else {
                setLoading(false)
            }
        }
        catch (error) {
            console.error('Error Updating Info:', error)
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
                                Add a user
                            </p>
                            <button onClick={() => setOpenModal(!openModal)} className="px-2 rounded-full bg-gradient-to-br from-black to-neutral-600 text-white hover:shadow-xl transition duration-200">
                                X
                            </button>
                        </div>
                        <form className="my-8 bg-white" onSubmit={handleSubmit}>
                            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                                <LabelInputContainer>
                                    <Label htmlFor="firstname">First name</Label>
                                    <Input id="firstname" name='firstName' value={formData.firstName} onChange={handleChange} required placeholder="" type="text" />
                                </LabelInputContainer>
                                <LabelInputContainer>
                                    <Label htmlFor="lastname">Last name</Label>
                                    <Input id="lastname" name='lastName' value={formData.lastName} onChange={handleChange} required placeholder="" type="text" />
                                </LabelInputContainer>
                            </div>
                            <LabelInputContainer className="mb-4">
                                <Label htmlFor="userName">User Name</Label>
                                <Input id="userName" name='userName' value={formData.userName} onChange={handleChange} required placeholder="" type="username" />
                            </LabelInputContainer>
                            <LabelInputContainer className="mb-4">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" name='email' value={formData.email} onChange={handleChange} required placeholder="" type="email" />
                            </LabelInputContainer>
                            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                                <LabelInputContainer className="mb-4">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" name='phone' value={formData.phone} onChange={handleChange} required placeholder="" type="phone" />
                                </LabelInputContainer>
                                <LabelInputContainer className="mb-4">
                                    <Label htmlFor="role">Role</Label>
                                    <Input id="role" name='role' value={formData.role} onChange={handleChange} required placeholder="" type="text" />
                                </LabelInputContainer>
                            </div>
                            <LabelInputContainer className="mb-4">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" value={formData.password} onChange={handleChange} placeholder="" type="password" />
                            </LabelInputContainer>
                            <button
                                className="bg-gradient-to-br relative group/btn from-black to-neutral-600 block w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
                                type="submit"
                                disabled={loading ? true : false}
                            >
                                {loading ? <CircularProgress color="warning" size={"1.3rem"} /> : <p>Add User</p>}
                                <BottomGradient />
                            </button>

                        </form>
                        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
                    </div>
                </div>
            </Transition.Child>
        </Transition>
    )
}

export default React.memo(AddUser)