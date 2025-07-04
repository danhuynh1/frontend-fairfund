import React from "react";
import { Link } from "react-router-dom";

const GroupList = ({ groups }) => {
  if (groups.length === 0) {
    return (
      <div className="text-center mt-8">
        <p className="text-gray-500">
          You haven't joined or created any groups yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <Link to={`/groups/${group._id}`} key={group._id} className="block">
          <div className="p-4 bg-white rounded-lg border hover:border-blue-500 hover:shadow-md transition-all flex justify-between items-center">
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
    </div>
  );
};

export default GroupList;
