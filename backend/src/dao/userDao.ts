const prisma = require('../utils/prisma');

type UserData = { email: string, password: string, name: string, mobile: string };

// Create a new user
export async function createUser(data: UserData) {
  try {
    const user = await prisma.user.create({
      data,
    });
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error creating user: ' + error.message);
    } else {
      throw new Error('An unknown error occurred during user creation');
    }
  }
}

// Find user by email
export async function findUserByEmail(email: string) {
  try {
    const user = await prisma.users.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error creating user: ' + error.message);
    } else {
      throw new Error('An unknown error occurred during user creation');
    }
  }
}

// Find user by ID (optional, in case you need this in the future)
export async function findUserById(id: number) {
  try {
    const user = await prisma.users.findUnique({
      where: { id },
    });
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error creating user: ' + error.message);
    } else {
      throw new Error('An unknown error occurred during user creation');
    }
  }
}

