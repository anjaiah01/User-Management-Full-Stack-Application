import React from 'react'
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react'
import axios from 'axios'

import noData from '../assets/noData.svg'
const UserInfo = () => {
    const [userData, setUserData] = useState([])
    const [name,setName] = useState("")
    const [mobile, setmobile] = useState("")
    const [email, setEmail] = useState("")
    const [formVisible, setFormVisible] = useState(false)
    const [editingUserId, setEditingUserId] = useState(null);
    const [error, setError] = useState({
        nameError:"",
        mobileError:"",
        emailError:""
    })

    const onDeleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:3000/delete-user/${userId}`);
            setUserData(prevUsers => prevUsers.filter(user => user._id !== userId));
        } catch (error) {
            console.log("Error deleting user", error);
        }
    };
    

    useEffect(() => {
        axios.get("http://localhost:3000/users")
        .then((response) => {
            setUserData(response.data)
        }).catch((error)=>{
            console.log("Error while fetching", error)
            
        })
    },[userData])

    const addNewuser = async (newUser) => {
        try{
            const response = await axios.post("http://localhost:3000/add-user", newUser)
            console.log("User Added", response.data)
            setUserData(prevUsers => [...prevUsers, response.data])
        }catch(error){
            console.log("Error:",error)
        }
    }
    const onSubmitUser = (e) =>{
        e.preventDefault()
        if (!name || !mobile || !email) {
            setError({
                nameError: !name ? "*Name is required" : "",
                mobileError: !mobile ? "*Mobile is required" : "",
                emailError: !email ? "*Email is required" : "",
            });
            return; // Prevent form submission if there's any error
        }
        if(mobile[0]==="0" || mobile.length<10){
            setError({
                mobileError:"*Enter Valid Mobile Number"
            })
            return 
        }
        const newUser = {
            name:name,
            mobile:mobile,
            email:email
        }
        setFormVisible(false)
        addNewuser(newUser)
        setName("")
        setEmail("")
        setmobile("")

    }
    const onBlur = (e) => {
        const { id, value } = e.target;
        setError(prevErrors => ({
            ...prevErrors,
            [id]: value ? "" : `${id.charAt(0).toUpperCase() + id.slice(1)} is required`, // Dynamic error message
        }));
    };

    
    
    const onUpdateUser = (id) => {
        const updateUser = userData.find(user => user._id === id);
        if (updateUser) {
            setName(updateUser.name);
            setmobile(updateUser.mobile);
            setEmail(updateUser.email);
            setEditingUserId(id);  // Store the ID of the user being edited
            setFormVisible(true);
        }
    };

    return (
        <div className='flex flex-col p-10 relative min-h-screen'>
            <div className='flex flex-row justify-around mb-10'>
                <p className='text-3xl font-bold'>Users Information</p>
                <button className='border-1 pl-2 pr-2 bg-[#ed771c] text-white rounded cursor-pointer' onClick={() => setFormVisible(true)}>Add User</button>
            </div>
            <hr className='mb-10' />
            <div className='flex flex-col'>
                <table className='table-auto border-collapse border border-gray-300 w-full text-left'>
                    <thead>
                        <tr>
                            <th className='border border-gray-300 p-2'>Name</th>
                            <th className='border border-gray-300 p-2'>Mobile</th>
                            <th className='border border-gray-300 p-2'>Email</th>
                            <th className='border border-gray-300 p-2'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            userData.length === 0? (
                                <tr>
                                    <td colSpan="4" className="text-center flex flex-col items-center justify-center">
                                        <img className='w-100 h-100' src={noData} alt="No Data" />
                                        <p className='text-3xl font-bold'>No users found</p>
                                    </td>
                                </tr>
                            ):
                            (userData.map((user) => (
                                <tr key={user._id}>
                                    <td className='border border-gray-300 p-2'>{user.name}</td>
                                    <td className='border border-gray-300 p-2'>{user.mobile}</td>
                                    <td className='border border-gray-300 p-2'>{user.email}</td>
                                    <td className='border border-gray-300 p-2'>
                                        <button className='mr-2 px-2 py-1 bg-blue-500 text-white rounded cursor-pointer' onClick={() => onUpdateUser(user._id)}>Update</button>
                                        <button className='px-2 py-1 bg-red-500 text-white rounded cursor-pointer' onClick={() => onDeleteUser(user._id)}>Delete</button>
                                    </td>
                                </tr>
                            )))
                        }
                        
                    </tbody>
                </table>
            </div>
            {formVisible && (
                <div className='flex flex-col bg-teal-200/30 backdrop-blur-sm p-10 absolute top-0 right-0 left-0 bottom-0 items-center justify-center'>
                    <p className='text-2xl font-bold mb-4'>Enter User Details</p>
                    <form className='flex flex-col gap-4 w-100 bg-white p-10 rounded shadow-lg' onSubmit={onSubmitUser}>
                            <label htmlFor='name'>Name
                            <input
                                type="text"
                                id="name"
                                className="border rounded p-2 w-full outline-none"
                                placeholder="Enter your name"
                                onChange={(e)=>setName(e.target.value)}
                                onBlur={onBlur}
                            />
                            {error.nameError && <p className="text-red-500 text-sm">{error.nameError}</p>}
                            </label>
                            <label htmlFor='mobile'>Mobile
                            <input
                                type="text"
                                id="mobile"
                                className="border rounded p-2 w-full outline-none"
                                placeholder="Enter your mobile number"
                                onChange={(e)=>setmobile(e.target.value)}
                                onBlur={onBlur}
                            />
                            {error.mobileError && <p className="text-red-500 text-sm">{error.mobileError}</p>}
                            </label>
                            <label htmlFor='email'>E-mail
                            <input
                                type="email"
                                id="email"
                                className="border rounded p-2 w-full outline-none"
                                placeholder="Enter your email"
                                onChange={(e)=>setEmail(e.target.value)}
                                onBlur={onBlur}
                            />
                            {error.emailError && <p className="text-red-500 text-sm">{error.emailError}</p>}
                            </label>
                            <div className='flex flex-row justify-center items-center mt-3'>
                            <button type="submit" className='text-white bg-green-500 px-4 py-2 rounded cursor-pointer' >
                                Submit
                            </button>
                            </div>
                    </form>
                </div>
            )}
        </div>
    )
}
export default UserInfo
