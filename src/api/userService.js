import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_URL;
const API_URL = `${BASE_URL}/users`;

/**
 * Searches for a registered user by their exact email address.
 * @param {string} email - The email to search for.
 * @param {string} token - The current user's JWT for authorization.
 * @returns The found user's public data (_id, name, email).
 */
export const searchUserByEmail = async (email, token) => {
  console.log("Searching for user with email:", email);
  try {
    const response = await axios.get(`${API_URL}/search`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        email: email,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error searching for user:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "A network error occurred." };
  }
};
