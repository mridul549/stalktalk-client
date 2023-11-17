import React, { useState } from 'react'
import logo from '../assets/images/Stock Talk.png'
import Spinner from './Spinner';

export default function Navbar() {
    const [loading, setLoading] = useState(false)

    const handleDownload = async () => {
        try {
            setLoading(true)
            const response = await fetch('https://stocktalkapi.onrender.com/sheet/create'); // Assuming your Express route is mounted at /api
            const blob = await response.blob();
            setLoading(false)
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'sheet.xlsx'; 
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    return (
        <div>
            <nav class="bg-gray-800 rounded-2xl m-6 pt-2 pb-2 drop-shadow-xl">
                <div class="mx-auto px-2 sm:px-6 lg:px-8">
                    <div class="relative h-16 grid grid-cols-3 w-full">
                        <div className='flex mr-auto h-16'>
                        </div>
                        <img class="h-16 w-auto mx-auto" src={logo} alt="Your Company"/>
                        <button onClick={handleDownload} disabled={loading} className={`ml-auto text-black bg-white text-xl my-auto border-white h-14 w-40 rounded-xl border-2 ${!loading ? 'hover:text-white hover:bg-transparent': 'bg-gray-300 border-gray-300'}  transition duration-300 ease-in-out`}>
                            {loading ? 
                                <div className='flex h-14 items-center'>
                                    <Spinner />
                                </div> :
                                <>
                                    <i class="fa-regular fa-file-excel fa-xl pr-2"></i> 
                                    Download
                                </>
                            }
                        </button>
                    </div>
                </div>

            </nav>

        </div>
    )
}
