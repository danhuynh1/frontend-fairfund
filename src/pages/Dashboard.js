import React, { useState, useEffect, useContext, useCallback } from "react";
import CreateGroupForm from "../components/CreateGroupForm";
import GroupList from "../components/GroupList";
import { getMyGroups } from "../api/groupService";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

  const fetchGroups = useCallback(async () => {
    if (user && user.token) {
      try {
        setLoading(true);
        const userGroups = await getMyGroups(user.token);
        setGroups(userGroups);
      } catch (err) {
        setError("Failed to fetch your groups.");
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);
  const handleGroupCreated = () => {
    fetchGroups();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-500">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="p-8 max-w-4xl mx-auto">
        <div className="pb-8 border-b border-gray-200">
          <h1 className="text-center text-4xl font-extrabold text-gray-900 tracking-tight">
            Dashboard
          </h1>
        </div>

        <div className="mt-8">
          <CreateGroupForm onGroupCreated={handleGroupCreated} />

          <div className="mt-12">
            <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
              Your Groups
            </h2>

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg">
                <p>
                  <span className="font-bold">Oops!</span> {error}
                </p>
              </div>
            )}

            {!error && <GroupList groups={groups} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
