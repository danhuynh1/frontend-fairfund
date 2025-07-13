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
  const [filter, setFilter] = useState("all"); // 'all' | 'expense' | 'settlement'
  const [refreshMap, setRefreshMap] = useState({});
  const [expandedItems, setExpandedItems] = useState({});

  const handleCommentAdded = (expenseId) => {
    setRefreshMap((prev) => ({
      ...prev,
      [expenseId]: (prev[expenseId] || 0) + 1,
    }));
  };

  const toggleDetails = (id) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredItems =
    filter === "all" ? items : items.filter((item) => item.type === filter);

  if (!items || items.length === 0) {
    return <p className="mt-4 text-gray-500">No activity in this group yet.</p>;
  }

  return (
    <div className="mt-4">
      {/* --- Filter Buttons --- */}
      <div className="flex w-full justify-center gap-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`w-32  py-1 rounded-md border ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 border-blue-600"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("expense")}
          className={`w-32  py-1 rounded-md border ${
            filter === "expense"
              ? "bg-red-600 text-white"
              : "bg-white text-red-600 border-red-600"
          }`}
        >
          Expenses
        </button>
        <button
          onClick={() => setFilter("settlement")}
          className={`w-32 py-1 rounded-md border ${
            filter === "settlement"
              ? "bg-green-600 text-white"
              : "bg-white text-green-600 border-green-600"
          }`}
        >
          Settlements
        </button>
      </div>

      {/* --- Activity Feed Scrollable List --- */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scroll-smooth">
        {filteredItems.map((item) => {
          const formattedDate = new Date(item.createdAt).toLocaleString(
            undefined,
            dateTimeFormatOptions
          );

          if (item.type === "expense") {
            return (
              <div
                key={item._id}
                className="p-4 bg-white border rounded-lg shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-800">
                    {item.description}
                  </p>
                  <p className="font-bold text-lg text-red-600">
                    -${item.amount.toFixed(2)}
                  </p>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {item.paidBy ? item.paidBy.name : "A user"} paid on{" "}
                  {formattedDate}
                </p>

                {/* Toggle Button */}
                <button
                  onClick={() => toggleDetails(item._id)}
                  className="text-sm text-blue-600 hover:underline mt-2"
                >
                  {expandedItems[item._id] ? "Hide Details" : "View Details"}
                </button>

                {/* Hidden by default, shown when toggled */}
                {expandedItems[item._id] && (
                  <>
                    <div className="mt-2 text-sm text-gray-700">
                      <p className="font-semibold">Split between:</p>
                      <ul className="ml-4 list-disc">
                        {item.splits.map((split, index) => (
                          <li key={index}>
                            {split.user?.name || "Unknown User"} owes $
                            {split.amount.toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <CommentsList
                      expenseId={item._id}
                      refreshTrigger={refreshMap[item._id]}
                    />
                    <CommentForm
                      expenseId={item._id}
                      onCommentAdded={() => handleCommentAdded(item._id)}
                    />
                  </>
                )}
              </div>
            );
          }

          if (item.type === "settlement") {
            return (
              <div
                key={item._id}
                className="p-4 bg-green-50 border-l-4 border-green-400"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-800">Settlement</p>
                  <p className="font-bold text-lg text-green-600">
                    +${item.amount.toFixed(2)}
                  </p>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {item.from ? item.from.name : "A user"} paid{" "}
                  {item.to ? item.to.name : "another user"} on {formattedDate}
                </p>
              </div>
            );
          }

          return null;
        })}
        {filteredItems.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No {filter} items to show.
          </p>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
