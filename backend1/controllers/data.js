import { WebModel } from '../models/model.js'; // Adjust the path as per your project structure
import crypto from 'crypto'; // For hashing the URL to generate namespace

const handleInitialization = async (req, res) => {
  try {
    const {
      URL,
      firstName,
      lastName,
      mobile,
      city,
      postalCode,
      streetAddress,
      country,
      region,
      about,
    } = req.body;
    console.log(req.body)

    // Ensure required fields are provided
    if (!URL || !firstName || !lastName) {
      return res.status(400).json({ message: 'Required fields are missing: URL, firstName, lastName.' });
    }

    // Generate a namespace using a hash of the URL
    const namespace = crypto.createHash('sha256').update(URL).digest('hex').substring(0, 16); // Use the first 16 characters

    // Check if the namespace already exists
    const existingRecord = await WebModel.findOne({ namespace });
    if (existingRecord) {
      return res.status(400).json({ message: 'Namespace derived from this URL already exists.' });
    }


    // Create a new WebModel record
    const webModel = new WebModel({
      namespace,
      URL,
      firstName,
      lastName,
      mobile,
      city,
      postalCode,
      streetAddress,
      country,
      region,
      about,
    });

    // Save the record to the database
    const savedModel = await webModel.save();

    res.status(201).json({
      message: 'Bot initialized successfully.',
      data: savedModel,
    });
  } catch (error) {
    console.error('Error during initialization:', error);
    res.status(500).json({ message: 'An error occurred during bot initialization.', error: error.message });
  }
};


const getMapping = async (req, res) => {
    console.log("finding mapp")
    try {
      const { domain } = req.query; // Extract domain from the query parameters
  
      if (!domain) {
        return res.status(400).json({ message: 'Domain is required' });
      }
  
      // Find the WebModel record that matches the given domain
      const mapping = await WebModel.findOne({ URL: domain });
  
      if (!mapping) {
        return res.status(404).json({ message: 'No mapping found for the provided domain' });
      }
  
      // Respond with the namespace and any other relevant data

      console.log(mapping)
      res.status(200).json({
        namespace: mapping.namespace,
        message: 'Mapping retrieved successfully',
      });
    } catch (error) {
      console.error('Error retrieving mapping:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };
  

export { handleInitialization,getMapping };

