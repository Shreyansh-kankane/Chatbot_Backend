
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Users } from '../models/model.js';


const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use an environment variable for JWT secret

// Register function - creates a new user
export async function register(req, res) {
  const { email, password, name, mobile } = req.body;

  // Validate input fields
  if (!email || !password || !name || !mobile) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  try {
    // Check if the email already exists
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email is already registered' });
      return;
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in the database
    const user = new Users({
      email,
      password: hashedPassword,
      name,
      mobile,
    });

    // Save the user to the database
    await user.save();

    // Respond with the created user (avoid sending password)
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, email: user.email, name: user.name, mobile: user.mobile },
    });
  } catch (error) {
    console.error('Register failed: ', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

// Login function - authenticates user
export async function login(req, res) {
  const { email, password } = req.body;

  console.log('----backend----')
  console.log(req.body)

  // Validate input fields
  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  try {
    // Find the user by email
    const user = await Users.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Respond with the token and user data (avoid sending the password)
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error('Login failed: ', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}