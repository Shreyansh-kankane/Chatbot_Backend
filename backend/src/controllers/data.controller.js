const { createWebModel, findWebModelByNamespace } = require('../dao/webModelDao.ts');
const crypto = require('crypto'); // For hashing the URL to generate namespace

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

    // Ensure required fields are provided
    if (!URL || !firstName || !lastName) {
      return res.status(400).json({ message: 'Required fields are missing: URL, firstName, lastName.' });
    }

    // Generate a namespace using a hash of the URL
    const namespace = crypto.createHash('sha256').update(URL).digest('hex').substring(0, 16); // Use the first 16 characters

    // Check if the namespace already exists
    const existingRecord = await findWebModelByNamespace(namespace);
    if (existingRecord) {
      return res.status(400).json({ message: 'Namespace derived from this URL already exists.' });
    }

    // Create a new WebModel record using the DAO
    const webModel = await createWebModel({
      namespace,
      URL,
      'firsName': firstName,
      'lastName': lastName,
      mobile,
      city,
      'postalCode': postalCode,
      'streetAddress': streetAddress,
      country,
      region,
      about,
    });

    res.status(201).json({
      message: 'Bot initialized successfully.',
      data: webModel,
    });
  } catch (error) {
    console.error('Error during initialization:', error);
    res.status(500).json({ message: 'An error occurred during bot initialization.', error: error.message });
  }
};

module.exports = { handleInitialization };
