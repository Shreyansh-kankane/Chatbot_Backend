import { useState } from 'react';
import Navbar from '../components/Navbar';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'

function Login() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {

    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (response.ok) {
        sessionStorage.setItem('authToken', result.token);
        toast.success('Login successfully')
        navigate('/initialize');
      } else {
        alert(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <>  
        <Navbar />
        <div className="p-8 my-10 flex flex-col w-full max-w-lg mx-auto bg-[#16141A] text-white shadow-lg rounded-lg">
        <form className="w-full" onSubmit={handleLogin}>
            <h2 className="text-2xl font-bold mb-5">Login</h2>
            <input
            type="email"
            name="email"
            placeholder="Email address"
            className="mb-4 p-3 w-full border border-gray-300 text-black rounded"
            value={loginData.email}
            onChange={handleInputChange}
            required
            />
            <input
            type="password"
            name="password"
            placeholder="Password"
            className="mb-4 p-3 w-full border border-gray-300 text-black rounded"
            value={loginData.password}
            onChange={handleInputChange}
            required
            />
            <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded">Sign in</button>
        </form>
        </div>

    </>
  );
}

export default Login;
