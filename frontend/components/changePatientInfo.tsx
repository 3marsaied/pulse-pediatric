import { cn } from '@/utils/cn';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { SetStateAction, useState } from 'react';
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
const changePatientInfo = ({ currentPatient }: { currentPatient: Patient | undefined }) => {
    const [formData, setFormData] = useState({
        firstName: currentPatient?.firstName,
        lastName: currentPatient?.lastName,
        age: currentPatient?.age,
        gender: currentPatient?.gender,
        parentId: localStorage.getItem("userId")
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
        <div className='max-w-md w-full p-2 pt-6 mx-auto my-auto rounded-none md:rounded-2xl shadow-input bg-white dark:bg-black flex flex-col'>
            <form className="bg-white ml-2" onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                    <LabelInputContainer>
                        <Label htmlFor="firstname">Patient Firstname</Label>
                        <Input id="firstname" name='firstName' value={formData.firstName} onChange={handleChange} required placeholder={currentPatient?.firstName} type="text" />
                    </LabelInputContainer>
                    <LabelInputContainer>
                        <Label htmlFor="lastname">Patient Lastname</Label>
                        <Input id="lastname" name='lastName' value={formData.lastName} onChange={handleChange} required placeholder={currentPatient?.lastName} type="text" />
                    </LabelInputContainer>
                </div>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="age">Patient Age</Label>
                    <Input id="age" name='age' value={formData.age} onChange={handleChange} required placeholder={currentPatient?.age?.toString()} type="number" />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="gender">Patient Gender</Label>
                    <Input id="gender" name='gender' value={formData.gender} onChange={handleChange} required placeholder={currentPatient?.gender} type="text" />
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
        </div>
    )
}

export default React.memo(changePatientInfo)