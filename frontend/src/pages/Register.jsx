import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { toast } from 'react-hot-toast'

function Register() {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`http://localhost:3001/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const result = await response.json();

      console.log("registering...")

      if (response.ok) {
        toast.success('Register successfully')
        navigate('/login');
      } else {
        alert(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  return (
    <>
        <Navbar />
        <div className="p-8 my-10 flex flex-col w-full max-w-lg mx-auto bg-[#16141A] text-white shadow-lg rounded-lg">
        <form className="w-full" onSubmit={handleRegister}>
            <h2 className="text-2xl font-bold mb-5">Register</h2>
            <input
            type="text"
            name="name"
            placeholder="Name"
            className="mb-4 p-3 w-full border border-gray-300 text-black rounded"
            value={registerData.name}
            onChange={handleInputChange}
            required
            />
            <input
            type="text"
            name="mobile"
            placeholder="Mobile No."
            className="mb-4 p-3 w-full border border-gray-300 text-black rounded"
            value={registerData.mobile}
            onChange={handleInputChange}
            required
            />
            <input
            type="email"
            name="email"
            placeholder="Email"
            className="mb-4 p-3 w-full border border-gray-300 text-black rounded"
            value={registerData.email}
            onChange={handleInputChange}
            required
            />
            <input
            type="password"
            name="password"
            placeholder="Password"
            className="mb-4 p-3 w-full border border-gray-300 text-black rounded"
            value={registerData.password}
            onChange={handleInputChange}
            required
            />
            <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded">Sign up</button>
        </form>
        </div> 
    </>
  );
}

export default Register;
