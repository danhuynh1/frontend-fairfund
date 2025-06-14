import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { createGroup } from '../api/groupService';

// --- Add these logs right after the import ---
console.log('--- DEBUGGING CreateGroupForm ---');
console.log('The imported createGroup is a:', typeof createGroup);
console.log('Value of createGroup:', createGroup);
console.log('---------------------------------');
// ---------------------------------------------

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
      // The error is happening here
      await createGroup(groupName, user.token);
      
      setMessage(`Successfully created group: "${groupName}"`);
      setGroupName('');
      if (onGroupCreated) {
        onGroupCreated({ name: groupName }); // Pass a mock object for now
      }
    } catch (err) {
      console.error('The API call threw an error.', err);
      setError('Failed to create group. Please check the console.');
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