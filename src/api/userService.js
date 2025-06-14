// src/api/userService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

/**
 * Searches for a registered user by their exact email address.
 * @param {string} email - The email to search for.
 * @param {string} token - The current user's JWT for authorization.
 * @returns {Promise<object>} The found user's public data (_id, name, email).
 */
export const searchUserByEmail = async (email, token) => {
    console.log("Searching for user with email:", email);
  try {
    const response = await axios.get(`${API_URL}/search`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        email: email
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching for user:', error.response?.data || error.message);
    // Re-throw the error so the component can handle it
    throw error.response?.data || { message: 'A network error occurred.' };
  }
};
