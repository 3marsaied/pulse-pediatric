import React, { SetStateAction } from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import { MdOutlineEdit } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import styles from "@/styles/Table.module.css"


const Table = (
    {
        data,
        height,
        width,
        rowHeight,
        headers,
        setAddModal,
        editHandler,
        deleteHandler,
        tableFor
    }: {
        data: any[],
        height: number,
        width: number,
        rowHeight: number,
        headers: { label: string, size: number }[],
        setAddModal: React.Dispatch<SetStateAction<boolean>>,
        editHandler: (id: number) => Promise<void>,
        deleteHandler: (id: number) => Promise<void>,
        tableFor: string
    }) => {

    const columns = Object.keys(data[0] || {});
    const Row = ({ index, style }: ListChildComponentProps) => {
        const row = data[index];
        return (
            <div style={style} className="flex py-1 divide-x divide-neutral-200 border border-b w-full">
                {columns.map((column, colIndex) => (
                    <div key={column} style={{ width: headers[colIndex]?.size }} className="flex p-2 font-medium items-center justify-center">{row[column]}</div>
                ))}
                <div className='w-[200px] flex justify-center items-center space-x-2'>
                    <button onClick={() => editHandler(row.id)} className='px-4 py-2 text-yellow-500 rounded-3xl text-sm font-light hover:text-black hover:bg-yellow-100 hover:transition duration-150 ease-linear flex items-center'>
                        Edit <MdOutlineEdit className='ml-1 text-md' />
                    </button>
                    <button onClick={() => deleteHandler(row.id)} className='px-4 py-2 text-red-500 rounded-3xl text-sm font-light hover:text-black hover:bg-red-100 hover:transition duration-150 ease-linear flex items-center'>
                        Delete <MdDelete className='ml-1 font-light' />
                    </button>
                </div>
            </div>
        );
    };
    let tableHeaders = headers.map((header) => {
        return <div style={{ width: header.size }} className="flex p-2 items-center justify-center">{header.label}</div>
    })
    return (
        <div className={styles.table_container} style={{ width, height }}>
            <div className="flex bg-neutral-200 border border-neutral-400 rounded-t-xl py-1 divide-x divide-neutral-300 font-bold sticky top-0 z-10 w-full">
                {tableHeaders}
                <div className='w-[200px] flex justify-center'>
                    <button onClick={() => setAddModal(true)} className='px-4 py-2 rounded-3xl text-sm font-bold hover:bg-green-100 hover:transition duration-150 ease-linear flex items-center'>
                        Add {tableFor} <FaPlus className='ml-1' />
                    </button>
                </div>
            </div>
            <List
                height={height - 35}
                itemCount={data.length}
                itemSize={rowHeight}
                width={width}
                className='border border-neutral-400 rounded-b-xl'
            >
                {Row}
            </List>
        </div>
    );
};

export default React.memo(Table);
