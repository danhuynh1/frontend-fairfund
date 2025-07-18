import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;
const API_URL = `${BASE_URL}/groups`;

export const createGroup = async (groupData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    const response = await axios.post(`${API_URL}/create`, groupData, config);
    return response.data;
  } catch (error) {
    console.error("Error creating group:", error.response?.data || error.message);
    throw error.response?.data || { message: "A network error occurred." };
  }
};

export const editGroup = async (groupId, groupData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    const response = await axios.put(`${API_URL}/${groupId}/edit`, groupData, config);
    return response.data;
  } catch (error) {
    console.error("Error modifying group information:", error.response?.data || error.message);
    throw error.response?.data || { message: "A network error occurred." };
  }
};

export const getMyGroups = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching groups:", error.response?.data || error.message);
    throw error;
  }
};

export const getGroupDetails = async (groupId, token) => {
  try {
    const response = await axios.get(`${API_URL}/${groupId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching group details:", error.response?.data || error.message);
    throw error;
  }
};

export const addUsersToGroup = async (groupId, userIds, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/${groupId}/add-users`,
      { userIds },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding users to group:", error.response?.data || error.message);
    throw error;
  }
};

export const updateGroupBudget = async (groupId, budgetData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    const response = await axios.put(`${API_URL}/${groupId}/budget`, budgetData, config);
    return response.data;
  } catch (error) {
    console.error("Error updating group budget:", error.response?.data || error.message);
    throw error.response?.data || { message: "A network error occurred." };
  }
};

export const addBudgetPlan = async (groupId, planData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  try {
    const response = await axios.post(`${API_URL}/${groupId}/budget-plans`, planData, config);
    return response.data;
  } catch (error) {
    console.error("Error adding budget plan:", error.response?.data || error.message);
    throw error.response?.data || { message: "A network error occurred." };
  }
};

export const deleteBudgetPlan = async (groupId, categoryId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  try {
    const response = await axios.delete(`${API_URL}/${groupId}/${categoryId}/delete-budget-plan`, config);
    return response.data;
  } catch (error) {
    console.error("Error deleting budget plan:", error.response?.data || error.message);
    throw error.response?.data || { message: "A network error occurred." };
  }
};

export const getGroupActivity = async (groupId, token) => {
  try {
    const response = await axios.get(`${API_URL}/${groupId}/activity`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching group activity:", error.response?.data || error.message);
    throw error;
  }
};


/**
 * Gets the current balances for all members in a group.
 * @param {string} groupId - The ID of the group.
 * @param {string} token - The current user's JWT for authorization.
 * @returns An object containing the balance details for each member.
 */
export const getGroupBalances = async (groupId, token) => {
  try {
    const response = await axios.get(`${API_URL}/${groupId}/balances`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching group balances:",
      error.response?.data || error.message
    );
    throw (
      error.response?.data || { message: "Failed to fetch group balances." }
    );
  }
};