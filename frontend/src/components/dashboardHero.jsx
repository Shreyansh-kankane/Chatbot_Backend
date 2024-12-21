import { motion } from "framer-motion";

import { styles } from "./styles";
import { toast } from 'react-hot-toast'
import axios from "axios";


// import { ComputersCanvas } from "./canvas";

const DashboardHero = () => {

    const webModelData = sessionStorage.getItem('webModel');

    const parsedData = JSON.parse(webModelData); // Parse the JSON string
    const firstName = parsedData.firstName; // Access firstName
    const lastName = parsedData.lastName; // Access lastName
    const url = parsedData.URL;
    const namespace = parsedData.namespace;

    async function handleScrape() {
        try {
            // Make the API request
            const response = await axios.get('http://localhost:8001/scrape', {
                params: { base_url: url, namespace }, // Pass parameters as query params
                headers: {
                    'Content-Type': 'application/json', // Not strictly necessary for GET requests
                },
            });

            if(response.ok){
                toast.success("Scraping start successfully")
            }
    
            // Log and return the response
            console.log('Scrape Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error during scraping:', error.response?.data || error.message);
            throw error; // Propagate the error for the calling function to handle
        }
    }


  return (
    <section className={`relative w-full h-screen mx-auto`}>
      <div
        className={`absolute inset-0 top-[120px]  max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5`}
      >
        <div className='flex flex-col justify-center items-center mt-5'>
          <div className='w-5 h-5 rounded-full bg-[#915EFF]' />
          <div className='w-1 sm:h-80 h-40 bg-[#915EFF]' />
        </div>

        <div>
          <h1 className={`${styles.heroHeadText} text-white`}>
            Hi, We're <span className='text-[#915EFF]'>Vartalap.AI</span>
          </h1>
          <p className={`${styles.heroSubText} mt-2 text-white-100`}>
          Welcome {firstName} {lastName} <br className='sm:block hidden' />
          customizable AI Chatbot for website with some Cool technologies and innovation.
          </p>
        </div>

        
      </div>
      {/* <ComputersCanvas /> */}

      <div className='absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center'>
        <button 
            className="text-[#915EFF] hover:text-violet-700 font-bold text-lg rounded-lg border-2 py-3 px-4 border-white bg-white"
            onClick={handleScrape}
        >
            Scrap
        </button>
      </div>
    </section>
  );
};

export default DashboardHero;

