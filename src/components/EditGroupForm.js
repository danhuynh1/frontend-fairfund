import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { editGroup } from "../api/groupService";
import {getGroupDetails} from "../api/groupService";

const EditGroupForm = ({ onGroupEdited, onCancel }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id:groupId } = useParams();

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchGroupData = async () => {
        if (!user?.token || !groupId) {
        setLoading(false);
        return;
        }

        try {
        const groupData = await getGroupDetails(groupId, user.token);
        setGroup(groupData);
        setName(groupData?.name || "");
        setDescription(groupData?.description || "");
        setError("");
        } catch (err) {
        setError("Failed to load group data. You may not be a member.");
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    fetchGroupData();
  }, [groupId, user]);
    


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      setError("Group name is required.");
      return;
    }

    if (!user?.token) {
      setError("You must be logged in to create a group.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const editedGroup = await editGroup(groupId, { name, description }, user.token);
      onGroupEdited(editedGroup);
    } catch (err) {
      setError(err.message || "Failed to edit group.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!group) return <div className="p-8 text-center">Group not found.</div>;

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md border">
      <h3 className="text-xl font-semibold mb-4">Edit Group Details</h3>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="groupName"
              className="block text-sm font-medium text-gray-700"
            >
              Group Name
            </label>
            <input
              type="text"
              id="groupName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="Something like 'Friends Trip' or 'Office Expenses'"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label
              htmlFor="groupDescription"
              className="block text-sm font-medium text-gray-700"
            >
              Description (Optional)
            </label>
            <textarea
              id="groupDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="A short description of your group's purpose"
              disabled={isSubmitting}
            ></textarea>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-blue-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Modifying..." : "Modify Group"}
          </button>
        </div>
        <div className="mt-1">
          <button
            type="button"
            className="w-full flex-1 bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-400"
            onClick={onCancel}
            >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditGroupForm;