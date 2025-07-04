import axios from "axios";

const API_URL = "http://localhost:5000/api/groups";

/**
 * Creates a new group.
 * @param {string} groupName - The name of the new group.
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise<object>} The newly created group object.
 */
export const createGroup = async (groupData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.post(`${API_URL}/create`, groupData, config);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating group:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "A network error occurred." };
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
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching groups:",
      error.response?.data || error.message
    );
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
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching group details:",
      error.response?.data || error.message
    );
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
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error adding users to group:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Updates the budget of a specific group.
 * @param {string} groupId - The ID of the group to update.
 * @param {object} budgetData - An object containing the new budget, e.g., { budget: 500 }.
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise<object>} The server's response.
 */
export const updateGroupBudget = async (groupId, budgetData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.put(
      `${API_URL}/${groupId}/budget`,
      budgetData,
      config
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating group budget:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "A network error occurred." };
  }
};

/**
 * Adds a category-specific budget plan to a group.
 * @param {string} groupId - The ID of the group.
 * @param {object} planData - An object with { category, limit }.
 * @param {string} token - The user's auth token.
 * @returns {Promise<object>} The updated group object.
 */
export const addBudgetPlan = async (groupId, planData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  try {
    const response = await axios.post(
      `${API_URL}/${groupId}/budget-plans`,
      planData,
      config
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error adding budget plan:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "A network error occurred." };
  }
};


export const getGroupActivity = async (groupId, token) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/activity`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching group activity:', error.response?.data || error.message);
    throw error;
  }
};
