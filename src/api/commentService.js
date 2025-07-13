import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_URL;

const API_URL = `${BASE_URL}/comments`;

export class CommentService {
  static async getComments(expenseId, token) {
    try {
      const res = await axios.get(`${API_URL}/${expenseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      throw error;
    }
  }

  static async postComment(expenseId, message, token) {
    try {
      const res = await axios.post(
        `${API_URL}/${expenseId}`,
        { message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Failed to post comment:", error);
      throw error;
    }
  }
}
