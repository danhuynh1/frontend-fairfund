// src/components/GroupList.js
// This new component is responsible for just rendering the list of groups.
import React from 'react';
import { Link } from 'react-router-dom';

const GroupList = ({ groups }) => {
  if (!groups || groups.length === 0) {
    return <p className="text-gray-500 mt-4">You are not a member of any groups yet.</p>;
  }

  return (
    <ul className="space-y-3 mt-4">
      {groups.map((group) => (
        <li key={group._id} className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors">
          <Link to={`/groups/${group._id}`} className="font-semibold text-blue-600">
            {group.name}
          </Link>
          <p className="text-sm text-gray-500">
            Created by: {group.createdBy ? group.createdBy.name : 'Unknown'}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default GroupList;
