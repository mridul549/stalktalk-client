import { React, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SearchBar.css'
import Spinner from './Spinner'

export default function Home() {
    const [page, setPage] = useState(0)
    const [total, setTotal] = useState({ pages: 1, companies: 0 })
    const [companyArray, setCompanyArray] = useState([])
    const [range, setRange] = useState({ start: 0, end: 0 })
    const [loading, setLoading] = useState(false)
    const [companyForm, setCompanyForm] = useState({ securityCode: '', companyName: '', city: '', state: '' })
    const [entryForm, setEntryForm] = useState({ companyId: '', companyName: '', esp: '', resultTime: '' })
    const [searchCompanyInput, setSearchCompanyInput] = useState('')
    const [entryCompanies, setEntryCompanies] = useState([])

    const addCompanyModal = () => {
        document.getElementById('addCompanyModal').showModal()
    }

    const addEntryModal = () => {
        document.getElementById('addEntryModal').showModal()
    }

    const nextPage = () => {
        setPage(page + 1)
    }

    const prevPage = () => {
        setPage(page - 1)
    }

    const filteredCompaniesNoP = async (value) => {
        setEntryCompanies([])
        console.log(value);
        const response = await fetch(`https://stocktalkapi.onrender.com/company/filterNoP?value=${value}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
        const json = await response.json()

        if (response.status === 200) {
            console.log(json);
            setEntryCompanies(json.companies)
        }
    }

    const filteredCompanies = async (value) => {
        if(value.length===0){
            fetchCompanies()
            return
        }
        setLoading(true)
        setCompanyArray([])

        const response = await fetch(`https://stocktalkapi.onrender.com/company/filter?page=${page}&value=${value}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
        const json = await response.json()

        if (response.status === 200) {
            setLoading(false)
            setCompanyArray(json.companies)
            setTotal({ pages: json.totalPages, companies: json.totalCompanies })
            setRange({ start: json.resultRange.start, end: json.resultRange.end })
        }
    }

    const fetchCompanies = async () => {
        setLoading(true)
        setCompanyArray([])
        setSearchCompanyInput('')
        const response = await fetch(`https://stocktalkapi.onrender.com/company/getCompanies?page=${page}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
        const json = await response.json()

        if (response.status === 200) {
            setLoading(false)
            setCompanyArray(json.companies)
            setTotal({ pages: json.totalPages, companies: json.totalCompanies })
            setRange({ start: json.resultRange.start, end: json.resultRange.end })
        }
    }

    const addCompany = async (e) => {
        e.preventDefault()

        toast.promise(
            fetch(`https://stocktalkapi.onrender.com/company/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: companyForm.companyName, address: { city: companyForm.city, state: companyForm.state }, securityCode: companyForm.securityCode })
            }).then((response) => response.json()),
            {
                pending: {
                    render() {
                        return `Please wait...`;
                    },
                    icon: true,
                },
                success: {
                    render({ data }) {
                        fetchCompanies()
                        setCompanyForm({ companyName: '', securityCode: '', city: '', state: ''})
                        return data.message
                    },
                },
                error: {
                    render({ data }) {
                        return "Internal server error";
                    },
                }
            }
        );
    }

    const addEntry = (e) => {
        e.preventDefault()

        toast.promise(
            fetch(`https://stocktalkapi.onrender.com/pricing/setPrice`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ companyid: entryForm.companyId, companyName: entryForm.companyName, eps: entryForm.esp, resultTime: entryForm.resultTime })
            }).then(async (response) => {
                if(response.status>=400){
                    const json = await response.json()
                    throw new Error(`${json.message}`);
                }
                return response.json()
            }),
            {
                pending: {
                    render() {
                        return `Please wait...`;
                    },
                    icon: true,
                },
                success: {
                    render({ data }) {
                        setEntryForm({ companyId: '', companyName: '', esp: '', resultTime: ''})
                        return data.message
                    },
                },
                error: {
                    render({ data }) {
                        console.log(data);
                        return data.message;
                    },
                }
            }
        );
    }

    const searchCompanyOnChange = (e) => {
        if(searchCompanyInput.length===0){
            setPage(0)
        }
        setSearchCompanyInput(e.target.value)
        filteredCompanies(e.target.value)
    }

    const companyOnChange = (e) => {
        setCompanyForm({ ...companyForm, [e.target.name]: e.target.value });
    }

    const entryOnChange = (e) => {
        if(e.target.id==="companyName"){
            filteredCompaniesNoP(e.target.value)
        }
        setEntryForm({ ...entryForm, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        fetchCompanies()
    }, [page])

    return (
        <div className='bg-white h-max m-6 rounded-2xl p-7 drop-shadow-xl'>
            <div className='head'>
                <div className='head1'>
                    <div className='searchBar grid grid-cols-3'>
                        <input value={searchCompanyInput} onChange={searchCompanyOnChange} type="text" className='border rounded-full w-72 p-3 pl-6 focus:outline-gray-700' placeholder='Seach Company' />
                        <h1 className='font-bold text-4xl m-auto'>Companies</h1>
                        <div className='ml-auto my-auto'>
                            <button onClick={() => addEntryModal()} className='bg-gray-800 text-white p-2 pl-4 pr-4 rounded-xl transition duration-300 ease-in-out  hover:bg-gray-700 '>Add Entry</button>
                            <button onClick={() => addCompanyModal()} className='bg-gray-800 text-white p-2 pl-4 pr-4 ml-2 rounded-xl transition duration-300 ease-in-out  hover:bg-gray-700'>Add Company</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className='body mt-10'>
                <dialog id="addCompanyModal" className="modal rounded-xl focus:outline-none focus:border-none" style={{ width: '70vh' }}>
                    <div className="modal-box rounded-3xl p-5">
                        <div className='head flex items-center border-b pb-3'>
                            <h1 className='text-2xl ml-auto font-bold'>Add company</h1>
                            <form method="dialog" className="modal-backdrop ml-auto">
                                <button><i className="fa-solid fa-x fa-xl hover:text-gray-500"></i></button>
                            </form>
                        </div>
                        <div className='body mt-3'>
                            <form id='companyForm' className='pl-4 pr-4' autoComplete='off' onSubmit={addCompany}>
                                <div className="relative z-0 w-full mb-6 group">
                                    <input value={companyForm.securityCode} onChange={companyOnChange} type="text" name="securityCode" id="securityCode" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300  focus:outline-none focus:ring-0 focus:border-gray-600 peer" placeholder=" " required />
                                    <label htmlFor="securityCode" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-gray-600 peer-focus:dark:text-gray-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Security Code</label>
                                </div>
                                <div className="relative z-0 w-full mb-6 group">
                                    <input value={companyForm.companyName} onChange={companyOnChange} type="text" name="companyName" id="companyName" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300  focus:outline-none focus:ring-0 focus:border-gray-600 peer" placeholder=" " required />
                                    <label htmlFor="companyName" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-gray-600 peer-focus:dark:text-gray-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Company Name</label>
                                </div>

                                <div className="grid md:grid-cols-2 md:gap-6">
                                    <div className="relative z-0 w-full mb-6 group">
                                        <input value={companyForm.city} onChange={companyOnChange} type="text" name="city" id="city" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300   focus:outline-none focus:ring-0 focus:border-gray-600 peer" placeholder=" " required />
                                        <label htmlFor="city" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-gray-600 peer-focus:dark:text-gray-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">City</label>
                                    </div>
                                    <div className="relative z-0 w-full mb-6 group">
                                        <input value={companyForm.state} onChange={companyOnChange} type="text" name="state" id="state" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300   focus:outline-none focus:ring-0 focus:border-gray-600 peer" placeholder=" " required />
                                        <label htmlFor="state" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-gray-600 peer-focus:dark:text-gray-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">State</label>
                                    </div>
                                </div>

                                <div className='flex'>
                                    <button type="submit" className="text-white mx-auto bg-gray-800 hover:bg-gray-700 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
                                </div>

                            </form>

                        </div>
                    </div>
                </dialog>

                <dialog id="addEntryModal" className="modal rounded-xl focus:outline-none focus:border-none" style={{ width: '70vh' }}>
                    <div className="modal-box rounded-3xl p-5">
                        <div className='head flex items-center border-b pb-3'>
                            <h1 className='text-2xl ml-auto font-bold'>Add Entry</h1>
                            <form method="dialog" className="modal-backdrop ml-auto">
                                <button><i className="fa-solid fa-x fa-xl hover:text-gray-500"></i></button>
                            </form>
                        </div>
                        <div className='body mt-3'>
                            <form onSubmit={addEntry} className='pl-4 pr-4' autoComplete='off'>
                                <div className="relative z-0 w-full mb-6 group">
                                    <input value={entryForm.companyName} onChange={entryOnChange} type="text" name="companyName" id="companyName" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-non focus:outline-none focus:ring-0 focus:border-gray-600 peer" placeholder=" " required />
                                    <label htmlFor="companyName" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-gray-600 peer-focus:dark:text-gray-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Company Name</label>
                                    <div className='dropdown'>
                                        {entryForm.companyName && entryCompanies.map((company, i) => {
                                            return <div onClick={() => {
                                                setEntryForm({companyName: company.name, companyId: company._id})
                                                setEntryCompanies([])
                                            }} className={`dropdown-row pl-2 hover:bg-gray-100 mb-3 ${i===entryCompanies.length-1 && 'rounded-b-lg'}`} key={company._id}>
                                                {company.name}
                                            </div>
                                        })}
                                    </div>
                                </div>

                                <div className="relative z-0 w-full mb-6 group">
                                    <input value={entryForm.esp} onChange={entryOnChange} type="number" name="esp" id="esp" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-600 peer" placeholder=" " required />
                                    <label htmlFor="esp" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-gray-600 peer-focus:dark:text-gray-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">ESP</label>
                                </div>

                                <div className="relative z-0 w-full mb-6 group">
                                    <input value={entryForm.resultTime} onChange={entryOnChange} type="time" name="resultTime" id="resultTime" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-600 peer" placeholder=" " required />
                                    <label htmlFor="resultTime" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-gray-600 peer-focus:dark:text-gray-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Result Time</label>
                                </div>

                                <div className='flex'>
                                    <button type="submit" className="text-white mx-auto bg-gray-800 hover:bg-gray-700 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
                                </div>

                            </form>

                        </div>
                    </div>
                </dialog>

                <table className="table-auto w-full rounded-xl text-left">
                    <thead className='text-xl'>
                        <tr className='bg-gray-50'>
                            <th className='p-2 '>Security Code</th>
                            <th className='p-2'>Company Name</th>
                            <th className='p-2'>City</th>
                            <th className='p-2'>State</th>
                        </tr>
                    </thead>
                    <tbody className='text-lg'>
                        {!loading && companyArray.length===0 ? 'No Companies found' : companyArray.map((company) => {
                            return <tr className='border-b' key={company._id}>
                                <td className='pl-2'>{company.securityCode}</td>
                                <td className='pl-2'>{company.name}</td>
                                <td className='pl-2'>{company.address.city}</td>
                                <td className='pl-2'>{company.address.state}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
                {loading ? <Spinner /> : ''}

                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <a href="#2" className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</a>
                        <a href="#2" className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</a>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{range.start}</span> to <span className="font-medium">{range.end} </span> of <span className="font-medium">{total.companies} </span> companies
                            </p>
                        </div>
                        <div className=''>
                            <nav aria-label="Page navigation example">
                                <ul class="flex items-center -space-x-px h-8 text-sm">
                                    <li>
                                        <button onClick={() => prevPage()} disabled={page===0} class={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg ${page!==0 ? 'hover:bg-gray-100 hover:text-white dark:hover:bg-gray-700 dark:hover:text-white  dark:text-white' : 'dark:text-gray-400'}  dark:bg-gray-800 dark:border-gray-700 `}>
                                            <span class="sr-only">Previous</span>
                                            <svg class="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4" />
                                            </svg>
                                        </button>
                                    </li>
                                    <li>
                                        <p class="flex items-center justify-center px-3 h-8 leading-tight text-white bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white">
                                            Page {page+1} of {total.pages}
                                        </p>
                                    </li>
                                    <li>
                                        <button onClick={() => nextPage()} disabled={page===total.pages-1} class={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg  ${page!==total.pages-1 ? 'hover:bg-gray-100 hover:text-gray-700  dark:hover:bg-gray-700 dark:hover:text-white dark:text-white' : 'dark:text-gray-400'} dark:bg-gray-800 dark:border-gray-700 `}>
                                            <span class="sr-only">Next</span>
                                            <svg class="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                                            </svg>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
