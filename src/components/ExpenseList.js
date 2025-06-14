// src/components/ExpenseList.js
import React from 'react';
const ExpenseList = ({ expenses }) => {
  if (!expenses || expenses.length === 0) {
    return <p className="mt-4 text-gray-500">No expenses have been added to this group yet.</p>;
  }

  return (    <div className="mt-4 space-y-3">
      {expenses.map((expense) => (
        <div key={expense._id} className="p-4 bg-gray-50 border rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-800">{expense.description}</p>
            <p className="font-bold text-lg text-gray-900">${expense.amount.toFixed(2)}</p>
          </div>

          <p className="mt-1 text-sm text-gray-600">
            Added by {expense.paidBy?.name || 'Unknown User'} on{" "}
            {new Date(expense.createdAt).toLocaleDateString()}
          </p>

          <p className="mt-1 text-sm text-gray-500 italic">Category: {expense.category}</p>

          {/* 👥 Show splits */}
          <div className="mt-2 text-sm text-gray-700">
            <p className="font-semibold">Split between:</p>
            <ul className="ml-4 list-disc">
              {expense.splits.map((split, index) => (
                <li key={index}>
                  {split.user?.name || 'Unknown User'} owes ${split.amount.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  
  );
};


export default ExpenseList;
