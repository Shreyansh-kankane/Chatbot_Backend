import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState  } from 'react';

function App() {
  const { register: loginRegister, handleSubmit: handleLoginSubmit } = useForm();
  const { register: registerRegister, handleSubmit: handleRegisterSubmit } = useForm();
  const [activeTab, setActiveTab] = useState('login');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const onLoginSubmit = async (data) => {
    try {
      const response = await axios.post('/auth/login', data);
      console.log('Login successful:', response.data);
    } catch (error) {
      console.error('Error logging in:', error.response ? error.response.data : error.message);
    }
  };

  const onRegisterSubmit = async (data) => {
    try {
      const response = await axios.post('/auth/register', data);
      console.log('Registration successful:', response.data);
    } catch (error) {
      console.error('Error registering:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="p-8 my-10 flex flex-col w-full max-w-lg mx-auto bg-[#16141A] text-white shadow-lg rounded-lg">
      {/* Tabs */}
      <div className="flex justify-between mb-5 border-b border-gray-200 font-bold text-lg">
        <button
          onClick={() => handleTabClick('login')}
          className={`pb-2 w-1/2 text-center ${activeTab === 'login' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-white'}`}
        >
          Login
        </button>
        <button
          onClick={() => handleTabClick('register')}
          className={`pb-2 w-1/2 text-center ${activeTab === 'register' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-white'}`}
        >
          Register
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex flex-col items-center">
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="w-full">
            <p className="text-center mb-3">Sign in with:</p>
            {/* Social Media Buttons */}
            <div className="flex justify-between mb-5 w-1/2 mx-auto">
              {/* Add your social media buttons here */}
            </div>
            <p className="text-center mb-3">or:</p>
            <input
              {...loginRegister('email', { required: 'Email is required' })}
              type="email"
              placeholder="Email address"
              className="mb-4 p-3 w-full border border-gray-300 rounded"
            />
            <input
              {...loginRegister('password', { required: 'Password is required' })}
              type="password"
              placeholder="Password"
              className="mb-4 p-3 w-full border border-gray-300 rounded"
            />
            <button className="w-full p-3 bg-blue-500 text-white rounded">Sign in</button>
          </form>
        )}

        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit(onRegisterSubmit)} className="w-full">
            <p className="text-center mb-3">Sign up with:</p>
            {/* Social Media Buttons */}
            <div className="flex justify-between mb-5 w-1/2 mx-auto">
              {/* Add your social media buttons here */}
            </div>
            <p className="text-center mb-3">or:</p>
            <input
              {...registerRegister('name', { required: 'Name is required' })}
              type="text"
              placeholder="Name"
              className="mb-4 p-3 w-full border border-gray-300 rounded"
            />
            <input
              {...registerRegister('mobile', { required: 'Mobile number is required' })}
              type="text"
              placeholder="Mobile No."
              className="mb-4 p-3 w-full border border-gray-300 rounded"
            />
            <input
              {...registerRegister('email', { required: 'Email is required' })}
              type="email"
              placeholder="Email"
              className="mb-4 p-3 w-full border border-gray-300 rounded"
            />
            <input
              {...registerRegister('password', { required: 'Password is required' })}
              type="password"
              placeholder="Password"
              className="mb-4 p-3 w-full border border-gray-300 rounded"
            />
            <button className="w-full p-3 bg-blue-500 text-white rounded">Sign up</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;
