import React from 'react'
import { useRouter } from 'next/navigation';

const LogoutButton = () => {
    const router = useRouter();
    const handleLogOut = () => {
        localStorage.clear()
        router.push('/')
    };
    return (
        <button onClick={() => handleLogOut()} className='flex px-4 py-2 opacity-80 text-black rounded-md h-full hover:bg-red-300 hover:text-black hover:transition duration-150 ease-linear'>
            Logout
        </button>
    )
}

export default LogoutButton