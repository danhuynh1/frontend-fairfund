import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { createGroup } from '../api/groupService'; 

// This is the final, working version of the component.
// It correctly receives 'onGroupCreated' as a prop from the Dashboard.
const CreateGroupForm = ({ onGroupCreated }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // It gets the user and token from the AuthContext.
    const { user } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) {
            setError('Group name is required.');
            return;
        }
        
        if (!user?.token) {
            setError('You must be logged in to create a group.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // It calls the real 'createGroup' function from your API service.
            const newGroup = await createGroup({ name, description }, user.token);
            
            // It calls the real 'onGroupCreated' function passed down from the Dashboard.
            onGroupCreated(newGroup); 

            // Reset form fields for the next entry.
            setName('');
            setDescription('');
        } catch (err) {
            setError(err.message || 'Failed to create group.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md border">
            <h3 className="text-xl font-semibold mb-4">Create a New Group</h3>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">
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
                        <label htmlFor="groupDescription" className="block text-sm font-medium text-gray-700">
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
                        {isSubmitting ? 'Creating...' : 'Create Group'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateGroupForm;
