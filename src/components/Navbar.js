import React from 'react'
import logo from '../assets/images/Stock Talk.png'

export default function Navbar() {
    return (
        <div>
            <nav class="bg-gray-800 rounded-2xl m-6 pt-2 pb-2 drop-shadow-xl">
                <div class="mx-auto  px-2 sm:px-6 lg:px-8">
                    <div class="relative h-16 grid grid-cols-3 w-full">
                        {/* <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
                            <button type="button" class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                                <span class="absolute -inset-0.5"></span>
                                <span class="sr-only">Open main menu</span>
                                <svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
 
                                <svg class="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div> */}

                        <div></div>
                        <img class="h-16 w-auto mx-auto" src={logo} alt="Your Company"/>
                        <button className='ml-auto text-black bg-white text-xl my-auto  h-14 w-40 rounded-xl border-2 hover:text-white hover:bg-transparent transition duration-300 ease-in-out'><i class="fa-regular fa-file-excel fa-xl pr-1"></i> Download</button>
                    </div>
                </div>

            </nav>

        </div>
    )
}
