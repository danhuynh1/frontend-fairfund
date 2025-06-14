import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { addExpense } from '../api/expenseService';
const AddExpenseForm = ({ groupId, members, onExpenseAdded }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [splitType, setSplitType] = useState('equal');
  const [customSplits, setCustomSplits] = useState([]);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Initialize custom splits when members are available
    if (members) {
      setCustomSplits(members.map(m => ({ user: m._id, name: m.name, amount: '' })));
    }
  }, [members]);

  const handleCustomSplitChange = (userId, value) => {
    const newSplits = customSplits.map(split => 
      split.user === userId ? { ...split, amount: value } : split
    );
    setCustomSplits(newSplits);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const totalAmount = parseFloat(amount);
    if (!description || !totalAmount || totalAmount <= 0) {
      setError('Please enter a valid description and amount.');
      return;
    }

    let expenseData = {
      description,
      amount: totalAmount,
      group: groupId,
      splitType,
    };
    
    if (splitType === 'custom') {
      const splitsForApi = customSplits
        .filter(s => parseFloat(s.amount) > 0)
        .map(s => ({ user: s.user, amount: parseFloat(s.amount) }));

      const sumOfCustomSplits = splitsForApi.reduce((sum, s) => sum + s.amount, 0);

      if (Math.abs(sumOfCustomSplits - totalAmount) > 0.01) {
        setError(`Custom splits must add up to $${totalAmount.toFixed(2)}. Current total: $${sumOfCustomSplits.toFixed(2)}.`);
        return;
      }
      expenseData.splits = splitsForApi;
    }

    try {
      await addExpense(expenseData, user.token);
      onExpenseAdded();
      // Reset form
      setDescription('');
      setAmount('');
      setSplitType('equal');
      setCustomSplits(members.map(m => ({ user: m._id, name: m.name, amount: '' })));
    } catch (err) {
      setError('Failed to add expense. Please try again.');
    }
  };
  
  const totalCustomAmount = customSplits.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);
  const remainingAmount = (parseFloat(amount) || 0) - totalCustomAmount;

  return (
    <div className="p-6 border rounded-lg shadow-sm bg-white">
      <h3 className="text-xl font-semibold mb-4">Add New Expense</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., Groceries, Rent" className="w-full p-2 border rounded mt-1"/>
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount ($)</label>
          <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full p-2 border rounded mt-1"/>
        </div>
        <div className="mb-4">
          <label htmlFor="splitType" className="block text-sm font-medium text-gray-700">Split Method</label>
          <select id="splitType" value={splitType} onChange={(e) => setSplitType(e.target.value)} className="w-full p-2 border rounded mt-1">
            <option value="equal">Split Equally</option>
            <option value="custom">Split by Custom Amounts</option>
          </select>
        </div>
        
        {splitType === 'custom' && (
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-2">Enter Custom Amounts:</h4>
             <p className={`text-sm mb-3 ${remainingAmount === 0 ? 'text-green-600' : 'text-red-600'}`}>
                Amount remaining: ${remainingAmount.toFixed(2)}
             </p>
            {customSplits.map((split) => (
              <div key={split.user} className="flex items-center gap-4 mb-2">
                <label htmlFor={`split-${split.user}`} className="w-1/3">{split.name}</label>
                <input
                  type="number"
                  id={`split-${split.user}`}
                  value={split.amount}
                  onChange={(e) => handleCustomSplitChange(split.user, e.target.value)}
                  placeholder="0.00"
                  className="flex-grow p-2 border rounded"
                />
              </div>
            ))}
          </div>
        )}

        <button type="submit" className="w-full mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Add Expense</button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default AddExpenseForm;
