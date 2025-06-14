// src/api/expenseService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/expenses';

/**
 * Adds a new expense to a group.
 * @param {object} expenseData - The expense details { description, amount, group }.
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise<object>} The newly created expense object.
 */
export const addExpense = async (expenseData, token) => {
  try {
    const response = await axios.post(`${API_URL}/add`, expenseData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding expense:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetches all expenses for a specific group.
 * @param {string} groupId - The ID of the group.
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise<Array>} An array of expense objects for the group.
 */
export const getGroupExpenses = async (groupId, token) => {
  try {
    const response = await axios.get(`${API_URL}/group/${groupId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching group expenses:', error.response?.data || error.message);
    throw error;
  }
};
