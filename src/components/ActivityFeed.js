import React from "react";
const dateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
};
const ActivityFeed = ({ items }) => {
  if (!items || items.length === 0) {
    return <p className="mt-4 text-gray-500">No activity in this group yet.</p>;
  }

  return (
    <div className="mt-4 space-y-3 max-h-[500px] overflow-y-auto pr-2 scroll-smooth">
      {items.map((item) => {
        // Now you can reuse the constant for formatting
        const formattedDate = new Date(item.createdAt).toLocaleString(
          undefined,
          dateTimeFormatOptions
        );
        // Conditionally render based on the item type from the backend
        if (item.type === "expense") {
          return (
            <div
              key={item._id}
              className="p-4 bg-white border rounded-lg shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-800">
                  {item.description}
                  <p className="mt-1 text-sm text-gray-500 italic">
                    Category: {item.category}
                  </p>
                </p>

                <p className="font-bold text-lg text-red-600">
                  -${item.amount.toFixed(2)}
                </p>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {item.paidBy ? item.paidBy.name : "A user"} paid on{" "}
                {formattedDate}
              </p>
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
    </div>
  );
};

export default ActivityFeed;
