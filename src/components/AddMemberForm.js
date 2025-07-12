import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { searchUserByEmail } from "../api/userService";
import { addUsersToGroup } from "../api/groupService";

const AddMemberForm = ({ groupId, onMemberAdded }) => {
  const [email, setEmail] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user: currentUser } = useContext(AuthContext);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setFoundUser(null);
    try {
      const result = await searchUserByEmail(email, currentUser.token);
      setFoundUser(result);
    } catch (error) {
      setMessage(error.message || "Search failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!foundUser) return;
    setIsLoading(true);
    setMessage("");
    try {
      await addUsersToGroup(groupId, [foundUser._id], currentUser.token);
      setMessage(`Successfully added ${foundUser.name} to the group.`);
      onMemberAdded();
      setFoundUser(null);
      setEmail("");
    } catch (error) {
      setMessage("Failed to add member.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 border rounded-lg shadow-sm bg-white">
      <h3 className="text-xl font-semibold mb-4">Add New Member</h3>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter user's email"
          className="flex-grow p-2 border rounded"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
      {foundUser && (
        <div className="mt-4 p-4 bg-green-50 border-green-200 border rounded-lg flex justify-between items-center">
          <div>
            <p className="font-semibold">{foundUser.name}</p>
            <p className="text-sm text-gray-500">{foundUser.email}</p>
          </div>
          <button
            onClick={handleAddMember}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded disabled:bg-green-300"
            disabled={isLoading}
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
};

export default AddMemberForm;
