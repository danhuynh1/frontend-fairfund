// src/pages/Dashboard.js
// This is the updated Dashboard page that fetches and manages the groups state.
import React, { useState, useEffect, useContext } from 'react';
import CreateGroupForm from '../components/CreateGroupForm';
import GroupList from '../components/GroupList';
import { getMyGroups } from '../api/groupService';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  // Fetch the user's groups when the component loads
  useEffect(() => {
    const fetchGroups = async () => {
      // Make sure the user object and token exist before trying to fetch
      if (user && user.token) {
        try {
          setLoading(true);
          const userGroups = await getMyGroups(user.token);
          setGroups(userGroups);
        } catch (err) {
          setError('Failed to fetch groups.');
        } finally {
          setLoading(false);
        }
      } else {
        // If there's no user or token, don't attempt to load
        setLoading(false);
      }
    };

    fetchGroups();
  }, [user]); // Re-run this effect if the user object changes (e.g., on login)

  // This function is called by the form when a group is created successfully
  const handleGroupCreated = (newGroup) => {
    // Add the new group to the top of the list for an immediate UI update
    setGroups([newGroup, ...groups]);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold">Dashboard</h2>
      <p className="mt-2 text-gray-600">
        Welcome, {user?.name}! Create a new group or view your existing ones.
      </p>

      <CreateGroupForm onGroupCreated={handleGroupCreated} />

      <div className="mt-8">
        <h3 className="text-2xl font-bold">Your Groups</h3>
        {loading && <p>Loading groups...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && <GroupList groups={groups} />}
      </div>
    </div>
  );
};

export default Dashboard;
