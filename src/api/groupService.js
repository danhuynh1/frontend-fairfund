// src/api/groupService.js
// This file contains all API calls related to groups.
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/groups';

/**
 * Creates a new group.
 * @param {string} groupName - The name of the new group.
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise<object>} The newly created group object.
 */
export const createGroup = async (groupName, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/create`,
      { name: groupName },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating group:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetches all groups for the currently logged-in user.
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise<Array>} An array of the user's groups.
 */
export const getMyGroups = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching groups:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetches the details for a single group by its ID.
 * @param {string} groupId - The ID of the group to fetch.
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise<object>} The group object with populated members.
 */
export const getGroupDetails = async (groupId, token) => {
  try {
    const response = await axios.get(`${API_URL}/${groupId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching group details:', error.response?.data || error.message);
    throw error;
  }
};
/**
 * Adds one or more users to a group.
 * @param {string} groupId - The ID of the group to update.
 * @param {Array<string>} userIds - An array containing the IDs of users to add.
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise<object>} The updated group object.
 */
export const addUsersToGroup = async (groupId, userIds, token) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/api/groups/${groupId}/add-users`,
      { userIds }, // The request body, expecting an object with a userIds array
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding users to group:', error.response?.data || error.message);
    throw error;
  }
};