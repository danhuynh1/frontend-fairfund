import React, { useState } from "react";
import { Link } from "react-router-dom";

const GroupList = ({ groups }) => {
  const [filter, setFilter] = useState("all"); // 'all' or 'unsettled'

  if (!groups || groups.length === 0) {
    return (
      <div className="text-center mt-8">
        <p className="text-gray-500">
          You haven't joined or created any groups yet.
        </p>
      </div>
    );
  }

  const filteredGroups =
    filter === "unsettled"
      ? groups.filter((group) => group.isUnsettled)
      : groups;

  return (
    <div>
      <div className="mb-4 justify-center flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1 rounded-md border ${
            filter === "all"
              ? "bg-green-600 text-white"
              : "bg-white text-green-600 border-green-600"
          }`}
        >
          All Groups
        </button>
        <button
          onClick={() => setFilter("unsettled")}
          className={`px-4 py-1 rounded-md border ${
            filter === "unsettled"
              ? "bg-red-600 text-white"
              : "bg-white text-red-600 border-red-600"
          }`}
        >
          Unsettled Only
        </button>
      </div>

      <div className="space-y-4">
        {filteredGroups.map((group) => (
          <Link to={`/groups/${group._id}`} key={group._id} className="block">
            <div className="p-4 bg-white rounded-lg border hover:border-green-500 hover:shadow-md transition-all flex justify-between items-center">
              <span className="font-semibold text-lg text-gray-800">
                {group.name}
              </span>
              {group.isUnsettled && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-red-600">
                    Unsettled
                  </span>
                  <span className="h-3 w-3 bg-red-500 rounded-full"></span>
                </div>
              )}
            </div>
          </Link>
        ))}
        {filteredGroups.length === 0 && (
          <p className="text-gray-500 text-center mt-6">
            No {filter === "unsettled" ? "unsettled " : ""}groups to display.
          </p>
        )}
      </div>
    </div>
  );
};

export default GroupList;
