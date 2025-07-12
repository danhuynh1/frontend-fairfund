import axios from "axios";

const BASE_URL = "http://localhost:5000/api/comments";

export class CommentService {
  static async getComments(expenseId, token) {
    try {
      const res = await axios.get(`${BASE_URL}/${expenseId}`, {
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
        `${BASE_URL}/${expenseId}`,
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
