import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
// FIX IS HERE: Use a named import with curly braces
import { createGroup } from '../api/groupService'; 

const CreateGroupForm = ({ onGroupCreated }) => {
  const [groupName, setGroupName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!groupName.trim()) {
      setError('Group name cannot be empty.');
      return;
    }

    if (!user || !user.token) {
      setError('You must be logged in to create a group.');
      return;
    }

    try {
      // This line will now work correctly
      const newGroup = await createGroup(groupName, user.token);
      
      setMessage(`Successfully created group: "${newGroup.name}"`);
      setGroupName('');
      if (onGroupCreated) {
        onGroupCreated(newGroup);
      }
    } catch (err) {
      setError('Failed to create group. Please try again.');
    }
  };

  return (
    <div className="mt-6 p-4 border rounded-lg shadow-md bg-white">
      <h3 className="text-xl font-semibold mb-4">Create a New Group</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name"
          className="w-full p-2 border rounded mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Group
        </button>
      </form>
      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
};

export default CreateGroupForm;