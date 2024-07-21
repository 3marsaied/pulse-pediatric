import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Image from "next/image";
import { BarChart } from '@mui/x-charts/BarChart';
import { formatName } from '@/utils/formatFuncs';
import { CircularProgress } from '@mui/material';


const chartSetting = {
    xAxis: [
        {
            label: 'Ratings',
        },
    ],
    width: 400,
    height: 300,
};

interface DoctorStat {
    title: string;
    link: string;
    thumbnail: string;
    numberOfReviews: number;
    avarageRating: number;
    id: number;
};

const valueFormatter = (value: number | null) => `${value} people`;

const DoctorReviews = ({ doctor }: { doctor: DoctorStat }) => {
    const [dataset, setDataSet] = useState();
    const [avgReviews, setAvgReviews] = useState<any>({ count: 0, avgRating: 0 });

    const headers = useMemo(() => ({
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    }), []);

    const fetchBarChart = useCallback(async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_NAME}/get/reviews/barchart/${doctor.id}/${localStorage.getItem("userId")}?token=${localStorage.getItem("accessToken")}`,
            { headers }
        );
        if (!response.ok) {
            console.log("ERRORRR")
            return;
        }
        const data = await response.json();
        setDataSet(data);
    }, [headers]);

    const fetchAvgReviews = useCallback(async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_NAME}/get/doctor/avg/rating/${doctor.id}/${localStorage.getItem("userId")}?token=${localStorage.getItem("accessToken")}`,
            { headers }
        );
        if (!response.ok) {
            console.log("ERRORRR");

            return;
        }
        const data = await response.json();
        setAvgReviews(data);
    }, [headers]);
    ;
    useEffect(() => {
        fetchBarChart();
        if (doctor.id !== 0) { fetchAvgReviews(); }
    }, [fetchBarChart, fetchAvgReviews]);
    return (
        <>
            {doctor.thumbnail ? <div className='flex flex-col justify-start items-center'>
                <div className='flex flex-col items-center justify-center'>
                    <div className='flex items-center justify-center'>
                        <Image className='w-48 h-48 object-cover rounded-full mb-2' alt="/default.jpg" src={doctor.thumbnail ?? "/default.jpg"} width={1080} height={1080} />
                    </div>
                    <div className='flex space-x-2'>
                        <p className='text-sm'>{`${doctor.title}`}</p>
                        {avgReviews && <span className='flex justify-center text-sm lg:text-[1rem] space-x-2'>
                            <span className='flex items-center text-sm'>
                                {avgReviews.avgRating}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#FFD700" className="w-4 h-4 lg:w-[1.25rem] lg:h-[1.25rem]">
                                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                                </svg>
                            </span>
                            <span className='flex items-center text-sm'> {`(${avgReviews.count} reviews)`}</span>
                        </span>}
                    </div>
                </div>
                {dataset && <BarChart
                    dataset={dataset}
                    yAxis={[{ scaleType: 'band', dataKey: 'stars' }]}
                    series={[{ dataKey: 'number', label: 'Number of Reviews', valueFormatter }]}
                    layout="horizontal"
                    colors={['#0891b2']}
                    {...chartSetting}
                />}
            </div> : <div className="w-full h-full flex justify-center items-center"><CircularProgress color="primary" size={'10rem'} /></div>}
        </>
    )
}

export default React.memo(DoctorReviews)