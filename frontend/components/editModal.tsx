import React, { useState, Fragment } from 'react'
import { Transition } from '@headlessui/react';
import { cn } from "@/utils/cn";
import { CircularProgress } from '@mui/material';
import { CiSaveUp2 } from "react-icons/ci";
interface Record {
    id: number;
    patientId: number;
    notes: string;
    treatment: string;
    createdAt: string;
    healthCondition: string;
    vaccin: string;
    allergies: string;
    pastConditions: string;
    chronicConditions: string;
    surgicalHistory: string;
    medications: string;
    radiologyReport: string;
}
const EditModal = (
    {
        openModal,
        setOpenModal,
        patientFirstName,
        section,
        medicalRecord,
        setMedicalRecord,
        data
    }: {
        openModal: boolean,
        setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
        patientFirstName: string | undefined,
        section: string,
        medicalRecord: Record | undefined,
        setMedicalRecord: React.Dispatch<React.SetStateAction<Record | undefined>>
        data: string | undefined
    }) => {
    const drugs = [
        "Please Select to Add",
        "Panadol",
        "Zithromycin",
        "Amoxicillin",
        "Albuterol",
        "Amoxicillin/Clavulanate",
        "Cefdinir",
        "Cephalexin",
        "Fluticasone",
        "Atovaquone/Proguanil",
        "Beclomethasone",
        "Insulin Glargine"
    ];
    const vaccines = [
        "Please Select to Add",
        "Chickenpox (Varicella)",
        "Diphtheria",
        "Flu (Influenza)",
        "Hepatitis A",
        "Hepatitis B",
        "Hib",
        "HPV (Human Papillomavirus)"
    ];
    const allergies = [
        "Please Select to Add",
        "Allergy to: Tree pollen",
        "Allergy to: Grass pollen",
        "Allergy to: Weed pollen",
        "Allergy to: Natural rubber latex",
        "Allergy to: Molds",
        "Allergy to: Dust mites",
        "Allergy to: Animal dander",
        "Allergy to: lactose",
        "Allergy to: Oil from skin",
        "Allergy to: peanuts",
        "Allergy to: eggs",
        "Allergy to: milk",
    ];
    const pastConditions = [
        "Please Select to Add",
        "Sore Throat",
        "Ear Pain",
        "Urinary Tract Infection",
        "Skin Infection",
        "Bronchitis",
        "Bronchiolitis",
        "Pain",
        "Common Cold",
        "Gastroenteritis (Stomach Flu)",
        "Conjunctivitis (Pink Eye)"
    ];
    const surgeries = [
        "Please Select to Add",
        "Removal of brain tumors",
        "Correction of bone malformations of the skull and face",
        "Repair of congenital heart disease",
        "Transplantation of organs",
        "Repair of intestinal malformations",
        "Correction of spinal abnormalities",
        "Treatment of injuries sustained from major blunt trauma",
        "Correction of problems in fetal development of the lungs",
        "Correction of problems in fetal development of the intestines",
        "Correction of problems in fetal development of the diaphragm",
        "Correction of problems in fetal development of the anus",
        "Placement of ear tubes",
        "Hernia repairs"
    ];
    const ages = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

    const handleTypeOfRecord = () => {
        if (section === "Treatment")
            return medicalRecord?.treatment
        else if (section === "Vaccines")
            return medicalRecord?.vaccin
        else if (section === "Medications")
            return medicalRecord?.medications
        else if (section === "Radiology Report")
            return medicalRecord?.radiologyReport
        else if (section === "Allergies")
            return medicalRecord?.allergies
        else if (section === "Past Conditions")
            return medicalRecord?.pastConditions
        else if (section === "Surgical History")
            return medicalRecord?.surgicalHistory
    }
    const handleType = () => {
        if (section === "Treatment")
            return "treatment"
        else if (section === "Vaccines")
            return "vaccin"
        else if (section === "Medications")
            return "medications"
        else if (section === "Radiology Report")
            return "radiologyReport"
        else if (section === "Allergies")
            return "allergies"
        else if (section === "Past Conditions")
            return "pastConditions"
        else if (section === "Surgical History")
            return "surgicalHistory"
    }

    const [loading, setLoading] = useState(false)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        const type = handleType()
        const data = handleTypeOfRecord()
        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            },
            body: JSON.stringify({ [type ? type : ""]: data ? data : "" }),
        };
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_NAME}/update/medicalRecord/${handleType()}/${localStorage.getItem("userId")}/${medicalRecord?.id}?token=${localStorage.getItem("accessToken")}`, requestOptions);
            if (response.status === 201 || response.status === 200) {
                setLoading(false)
                setOpenModal(!openModal)
                // location.reload()
            }
            else {
                setLoading(false)
            }
        }
        catch (error) {
            console.error('Error Adding Patient:', error)
        }
    }
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (medicalRecord) {
            const type = handleType()
            setMedicalRecord({
                ...medicalRecord,
                [type ? type : ""]: e.target.value,
            })
        };
    };
    const handleAppend = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (medicalRecord) {
            const type = handleType()
            const data = handleTypeOfRecord()
            const selected = e.target.value;
            setMedicalRecord({
                ...medicalRecord,
                [type ? type : ""]: data + ',' + selected,
            })
        };
    };
    const dropMenuText = () => {
        if (section === "Treatment")
            return <select disabled className="p-1 rounded-md bg-neutral-100 text-gray-800 focus:outline-none focus:border-blue-500 transition duration-150">
                <option value=""> No treatments available</option>
            </select>
        else if (section === "Vaccines")
            return <select onChange={handleAppend} className="p-1 rounded-md bg-neutral-100 text-gray-800 focus:outline-none focus:border-blue-500 transition duration-150">
                {vaccines.map((vac, index) => (
                    <option key={index} value={vac}>{vac}</option>
                ))}
            </select>
        else if (section === "Medications")
            return <select onChange={handleAppend} className="p-1 rounded-md bg-neutral-100 text-gray-800 focus:outline-none focus:border-blue-500 transition duration-150">
                {drugs.map((drug, index) => (
                    <option key={index} value={drug}>{drug}</option>
                ))}
            </select>
        else if (section === "Radiology Report")
            return <select disabled className="p-1 rounded-md bg-neutral-100 text-gray-800 focus:outline-none focus:border-blue-500 transition duration-150">
                <option value=""> No Radiology Reports available</option>
            </select>
        else if (section === "Allergies")
            return <select onChange={handleAppend} className="p-1 rounded-md bg-neutral-100 text-gray-800 focus:outline-none focus:border-blue-500 transition duration-150">
                {allergies.map((allergy, index) => (
                    <option key={index} value={allergy}>{allergy}</option>
                ))}
            </select>
        else if (section === "Past Conditions")
            return <select onChange={handleAppend} className="p-1 rounded-md bg-neutral-100 text-gray-800 focus:outline-none focus:border-blue-500 transition duration-150">
                {pastConditions.map((cond, index) => (
                    <option key={index} value={cond}>{cond}</option>
                ))}
            </select>
        else if (section === "Surgical History")
            return <select onChange={handleAppend} className="p-1 rounded-md bg-neutral-100 text-gray-800 focus:outline-none focus:border-blue-500 transition duration-150">
                {surgeries.map((surg, index) => (
                    <option key={index} value={surg}>{surg}</option>
                ))}
            </select>
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
                    <div className='max-w-[50%] w-full mx-auto my-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black flex flex-col'>
                        <div className='w-full flex justify-between items-center'>
                            <p className="text-neutral-600 text-sm max-w-sm">
                                Edit {patientFirstName}'s {section} section
                            </p>
                            <span className=''>
                                {dropMenuText()}
                                <button onClick={() => setOpenModal(!openModal)} className="px-2 rounded-full bg-gradient-to-br from-black to-neutral-600 text-white hover:shadow-xl transition duration-200 ml-2">
                                    X
                                </button>
                            </span>
                        </div>
                        <form className="my-8 bg-white h-full" onSubmit={handleSubmit}>
                            <textarea
                                className="p-2 text-md w-full h-80 bg-neutral-100 rounded-xl focus:outline-none focus:ring-[2px] focus:ring-orange-400"
                                name={handleType()}
                                value={data}
                                onChange={handleChange}
                            />
                            <button
                                className="mt-4 bg-gradient-to-br relative group/btn from-black to-neutral-600 block w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
                                type="submit"
                                disabled={loading ? true : false}
                            >
                                {loading ? <CircularProgress color="warning" size={"1.3rem"} /> : <p className='flex justify-center items-center'>Save <CiSaveUp2 className='w-6 h-6 ml-2 font-bold' /></p>}
                            </button>
                        </form>
                    </div>
                </div>
            </Transition.Child>
        </Transition>
    )
}

export default React.memo(EditModal)