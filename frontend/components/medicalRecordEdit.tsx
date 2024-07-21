"use client";
import Image from "next/image";
import { Tabs } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import EditModal from "./editModal";
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
const medicalRecordEdit = ({ currentPatient }: { currentPatient: Patient | undefined }) => {
    function formatStringWithCommas(input: string | undefined): string {
        const parts = input?.split(',');
        const formattedString = parts?.join('\n');
        if (formattedString === undefined) {
            return ""
        }
        return formattedString;
    }
    const [editModeTreatment, setEditModeTreatment] = useState(false)
    const [editModeVaccin, setEditModeVaccin] = useState(false)
    const [editModeMedications, setEditModeMedications] = useState(false)
    const [editModeRadiology, setEditModeRadiology] = useState(false)
    const [editModeAllergies, setEditModeAllergies] = useState(false)
    const [editModePast, setEditModePast] = useState(false)
    const [editModeSurgical, setEditModeSurgical] = useState(false)
    const [medicalRecord, setMedicalRecord] = useState({} as Record | undefined);
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    };
    async function fetchMedicalRecord() {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_NAME}/get/medicalRecord/${localStorage.getItem("userId")}/${currentPatient?.id}?token=${localStorage.getItem("accessToken")}`,
            { headers }
        );
        const data = await response.json();
        setMedicalRecord(data[0]);
    }
    useEffect(() => {
        if (currentPatient !== undefined) {
            fetchMedicalRecord();
        }
    }, [currentPatient]);
    const tabs = [
        {
            title: "Treatment",
            value: "Treatment",
            content: (
                <div className="w-full overflow-hidden relative h-5/6 rounded-2xl p-4 text-black bg-neutral-50">
                    <p className="text-xl border-b-2 border-neutral-200 flex justify-between">
                        Treatment tab
                        <span className="mb-1">
                            <button onClick={() => setEditModeTreatment(!editModeTreatment)} className="px-4 py-2 rounded-3xl text-sm font-bold hover:bg-neutral-200 hover:transition duration-150 ease-linear flex items-center">
                                <FaPencilAlt /> <span className="ml-2">Edit</span>
                            </button>
                        </span>
                    </p>
                    <pre className="pt-4 text-md">{medicalRecord && medicalRecord?.treatment}</pre>
                </div>
            ),
        },
        {
            title: "Vaccines",
            value: "Vaccines",
            content: (
                <div className="w-full overflow-hidden relative h-5/6 rounded-2xl p-4 text-black bg-neutral-50">
                    <p className="text-xl border-b-2 border-neutral-200 flex justify-between">
                        Vaccines Tab
                        <span className="mb-1">
                            <button onClick={() => setEditModeVaccin(!editModeVaccin)} className="px-4 py-2 rounded-3xl text-sm font-bold hover:bg-neutral-200 hover:transition duration-150 ease-linear flex items-center">
                                <FaPencilAlt /> <span className="ml-2">Edit</span>
                            </button>
                        </span>
                    </p>
                    <pre className="pt-4 text-md">{formatStringWithCommas(medicalRecord?.vaccin)}</pre>
                </div>
            ),
        },
        {
            title: "Medications",
            value: "Medications",
            content: (
                <div className="w-full overflow-hidden relative h-5/6 rounded-2xl p-4 text-black bg-neutral-50">
                    <p className="text-xl border-b-2 border-neutral-200 flex justify-between">
                        Medications tab
                        <span className="mb-1">
                            <button onClick={() => setEditModeMedications(!editModeMedications)} className="px-4 py-2 rounded-3xl text-sm font-bold hover:bg-neutral-200 hover:transition duration-150 ease-linear flex items-center">
                                <FaPencilAlt /> <span className="ml-2">Edit</span>
                            </button>
                        </span>
                    </p>
                    <pre className="pt-4 text-md">{formatStringWithCommas(medicalRecord?.medications)}</pre>
                </div>
            ),
        },
        {
            title: "Radiology Report",
            value: "Radiology Report",
            content: (
                <div className="w-full overflow-hidden relative h-5/6 rounded-2xl p-4 text-black bg-neutral-50">
                    <p className="text-xl border-b-2 border-neutral-200 flex justify-between">Radiology Report tab
                        <span className="mb-1">
                            <button onClick={() => setEditModeRadiology(!editModeRadiology)} className="px-4 py-2 rounded-3xl text-sm font-bold hover:bg-neutral-200 hover:transition duration-150 ease-linear flex items-center">
                                <FaPencilAlt /> <span className="ml-2">Edit</span>
                            </button>
                        </span></p>
                    <pre className="pt-4 text-md">{medicalRecord?.radiologyReport}</pre>
                </div>
            ),
        },
        {
            title: "Allergies",
            value: "Allergies",
            content: (
                <div className="w-full overflow-hidden relative h-5/6 rounded-2xl p-4 text-black bg-neutral-50">
                    <p className="text-xl border-b-2 border-neutral-200 flex justify-between">Allergies tab
                        <span className="mb-1">
                            <button onClick={() => setEditModeAllergies(!editModeAllergies)} className="px-4 py-2 rounded-3xl text-sm font-bold hover:bg-neutral-200 hover:transition duration-150 ease-linear flex items-center">
                                <FaPencilAlt /> <span className="ml-2">Edit</span>
                            </button>
                        </span></p>
                    <pre className="pt-4 text-md">{formatStringWithCommas(medicalRecord?.allergies)}</pre>
                </div>
            ),
        },
        {
            title: "Past Conditions",
            value: "Past Conditions",
            content: (
                <div className="w-full overflow-hidden relative h-5/6 rounded-2xl p-4 text-black bg-neutral-50">
                    <p className="text-xl border-b-2 border-neutral-200 flex justify-between">Past Conditions tab
                        <span className="mb-1">
                            <button onClick={() => setEditModePast(!editModePast)} className="px-4 py-2 rounded-3xl text-sm font-bold hover:bg-neutral-200 hover:transition duration-150 ease-linear flex items-center">
                                <FaPencilAlt /> <span className="ml-2">Edit</span>
                            </button>
                        </span></p>
                    <pre className="pt-4 text-md">{formatStringWithCommas(medicalRecord?.pastConditions)}</pre>
                </div>
            ),
        },
        {
            title: "Surgical History",
            value: "Surgical History",
            content: (
                <div className="w-full overflow-hidden relative h-5/6 rounded-2xl p-4 text-black bg-neutral-50">
                    <p className="text-xl border-b-2 border-neutral-200 flex justify-between">Surgical History tab
                        <span className="mb-1">
                            <button onClick={() => setEditModeSurgical(!editModeSurgical)} className="px-4 py-2 rounded-3xl text-sm font-bold hover:bg-neutral-200 hover:transition duration-150 ease-linear flex items-center">
                                <FaPencilAlt /> <span className="ml-2">Edit</span>
                            </button>
                        </span></p>
                    <pre className="pt-4 text-md">{formatStringWithCommas(medicalRecord?.surgicalHistory)}</pre>
                </div>
            ),
        },

    ];
    return (
        <>
            {editModeTreatment &&
                <EditModal
                    openModal={editModeTreatment}
                    setOpenModal={setEditModeTreatment}
                    patientFirstName={currentPatient?.firstName}
                    data={medicalRecord?.treatment}
                    section="Treatment"
                    medicalRecord={medicalRecord}
                    setMedicalRecord={setMedicalRecord}
                />}
            {editModeVaccin &&
                <EditModal
                    openModal={editModeVaccin}
                    setOpenModal={setEditModeVaccin}
                    patientFirstName={currentPatient?.firstName}
                    data={medicalRecord?.vaccin}
                    section="Vaccines"
                    medicalRecord={medicalRecord}
                    setMedicalRecord={setMedicalRecord}
                />}
            {editModeMedications &&
                <EditModal
                    openModal={editModeMedications}
                    setOpenModal={setEditModeMedications}
                    patientFirstName={currentPatient?.firstName}
                    data={medicalRecord?.medications}
                    section="Medications"
                    medicalRecord={medicalRecord}
                    setMedicalRecord={setMedicalRecord}
                />}
            {editModeRadiology &&
                <EditModal
                    openModal={editModeRadiology}
                    setOpenModal={setEditModeRadiology}
                    patientFirstName={currentPatient?.firstName}
                    data={medicalRecord?.radiologyReport}
                    section="Radiology Report"
                    medicalRecord={medicalRecord}
                    setMedicalRecord={setMedicalRecord}
                />}
            {editModeAllergies &&
                <EditModal
                    openModal={editModeAllergies}
                    setOpenModal={setEditModeAllergies}
                    patientFirstName={currentPatient?.firstName}
                    data={medicalRecord?.allergies}
                    section="Allergies"
                    medicalRecord={medicalRecord}
                    setMedicalRecord={setMedicalRecord}
                />}
            {editModePast &&
                <EditModal
                    openModal={editModePast}
                    setOpenModal={setEditModePast}
                    patientFirstName={currentPatient?.firstName}
                    data={medicalRecord?.pastConditions}
                    section="Past Conditions"
                    medicalRecord={medicalRecord}
                    setMedicalRecord={setMedicalRecord}
                />}
            {editModeSurgical &&
                <EditModal
                    openModal={editModeSurgical}
                    setOpenModal={setEditModeSurgical}
                    patientFirstName={currentPatient?.firstName}
                    data={medicalRecord?.surgicalHistory}
                    section="Surgical History"
                    medicalRecord={medicalRecord}
                    setMedicalRecord={setMedicalRecord}
                />}
            <div className="h-full overflow-clip md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full items-start justify-start">
                <Tabs tabs={tabs} />
            </div>
        </>
    )
}

export default React.memo(medicalRecordEdit)