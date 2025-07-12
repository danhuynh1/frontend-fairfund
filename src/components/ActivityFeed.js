import React, { useState } from "react";
import CommentForm from "./CommentForm";
import CommentsList from "./CommentsList";

const dateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
};

const ActivityFeed = ({ items }) => {
  const [refreshMap, setRefreshMap] = useState({});

  const handleCommentAdded = (expenseId) => {
    setRefreshMap((prev) => ({
      ...prev,
      [expenseId]: (prev[expenseId] || 0) + 1,
    }));
  };

  if (!items || items.length === 0) {
    return <p className="mt-4 text-gray-500">No activity in this group yet.</p>;
  }

  return (
    <div className="mt-4 space-y-3 max-h-[500px] overflow-y-auto pr-2 scroll-smooth">
      {items.map((item) => {
        const formattedDate = new Date(item.createdAt).toLocaleString(undefined, dateTimeFormatOptions);

        if (item.type === "expense") {
          return (
            <div key={item._id} className="p-4 bg-white border rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-800">{item.description}</p>
                <p className="font-bold text-lg text-red-600">-${item.amount.toFixed(2)}</p>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {item.paidBy ? item.paidBy.name : "A user"} paid on {formattedDate}
              </p>
              <p className="mt-1 text-sm italic text-gray-500">Category: {item.category}</p>

              {/* ✅ Comments Section */}
              <CommentsList expenseId={item._id} refreshTrigger={refreshMap[item._id]} />
              <CommentForm expenseId={item._id} onCommentAdded={() => handleCommentAdded(item._id)} />
            </div>
          );
        }

        if (item.type === "settlement") {
          return (
            <div key={item._id} className="p-4 bg-green-50 border-l-4 border-green-400">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-800">Settlement</p>
                <p className="font-bold text-lg text-green-600">+${item.amount.toFixed(2)}</p>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {item.from ? item.from.name : "A user"} paid {item.to ? item.to.name : "another user"} on {formattedDate}
              </p>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

export default ActivityFeed;
``