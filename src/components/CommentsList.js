import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CommentService } from "../api/commentService";

const CommentsList = ({ expenseId, refreshTrigger }) => {
  const [comments, setComments] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await CommentService.getComments(expenseId, user.token);
        setComments(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchComments();
  }, [expenseId, user.token, refreshTrigger]);

  if (comments.length === 0) return null;

  return (
    <div class="mt-2 space-y-1 min-h-12 max-h-24 overflow-y-auto overflow-x-hidden pr-2">
      {comments.map((comment) => (
        <div
          key={comment._id}
          className="text-sm text-gray-700 border rounded px-2 py-1 bg-gray-50"
        >
          <strong>{comment.user?.name || "User"}:</strong> {comment.message}
        </div>
      ))}
    </div>
  );
};

export default CommentsList;
