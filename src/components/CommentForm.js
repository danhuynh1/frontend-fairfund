import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CommentService } from "../api/commentService";

const CommentForm = ({ expenseId, onCommentAdded }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      await CommentService.postComment(expenseId, message, user.token);
      setMessage("");
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Add a comment..."
        className="flex-grow p-2 border rounded-md"
      />
      <button
        type="submit"
        disabled={loading || !message.trim()}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
};

export default CommentForm;
