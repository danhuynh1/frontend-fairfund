import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_URL;
const SETTLEMENT_API_URL = `${BASE_URL}/settlements`;

/**
 * Records a settlement payment between two users.
 * @param {object} settlementData - The details of the settlement.
 * @param {string} settlementData.from - The user ID of the person paying.
 * @param {string} settlementData.to - The user ID of the person being paid.
 * @param {string} settlementData.group - The group ID this settlement belongs to.
 * @param {number} settlementData.amount - The amount being settled.
 * @param {string} token - The current user's JWT for authorization.
 * @returns {Promise<object>} The newly created settlement record.
 */
export const recordSettlement = async (settlementData, token) => {
  try {
    console.log("Recording settlement:", settlementData);
    const response = await axios.post(SETTLEMENT_API_URL, settlementData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error recording settlement:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "Failed to record settlement." };
  }
};

/**
 * Gets the settlement payment history for a specific group.
 * @param {string} groupId - The ID of the group.
 * @param {string} token - The user's auth token.
 * @returns promise that resolves to an array of settlement records.
 */
export const getSettlementHistory = async (groupId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  try {
    const response = await axios.get(
      `${SETTLEMENT_API_URL}/group/${groupId}`,
      config
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching settlement history:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "A network error occurred." };
  }
};
