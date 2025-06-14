import React, { useState, useEffect, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getGroupDetails } from "../api/groupService";
import { getGroupExpenses } from "../api/expenseService";
import AddExpenseForm from "../components/AddExpenseForm";
import ExpenseList from "../components/ExpenseList";
import AddMemberForm from "../components/AddMemberForm";

const GroupDetail = () => {
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const fetchDetails = useCallback(async () => {
    if (user && user.token && id) {
      try {
        setLoading(true);
        const [groupData, expensesData] = await Promise.all([
          getGroupDetails(id, user.token),
          getGroupExpenses(id, user.token),
        ]);
        setGroup(groupData);
        setExpenses(expensesData);
      } catch (err) {
        setError("Failed to load group data. You may not be a member.");
      } finally {
        setLoading(false);
      }
    }
  }, [id, user]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleDataRefresh = () => {
    fetchDetails(); // Refetches both group details (members) and expenses
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!group) return <div className="p-8">Group not found.</div>;

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const categorySpending = group.budgetPlans?.map((plan) => {
    const spent = expenses
      .filter((e) => e.category === plan.category)
      .reduce((sum, e) => sum + e.amount, 0);
    return {
      ...plan,
      spent,
    };
  });

  const memberOwedTotals = {};
  expenses.forEach((exp) => {
    exp.splits.forEach((split) => {
      const userId = split.user?._id || split.user;
      if (!userId) return;
      if (!memberOwedTotals[userId]) memberOwedTotals[userId] = 0;
      memberOwedTotals[userId] += split.amount;
    });
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-2">{group.name}</h2>
      <p className="text-gray-500 mb-8">Created by: {group.createdBy?.name}</p>

      {/* Budget + Total Spending Overview */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 border">
        <h3 className="text-2xl font-semibold mb-2">Group Budget Overview</h3>
        <p className="text-gray-700 mb-2">
          Total Spent:
          <span className="font-bold">${totalSpent.toFixed(2)}</span>
          {group.budget > 0 && (
            <>
              {" "}
              of <span className="font-bold">${group.budget.toFixed(2)}</span>
            </>
          )}
        </p>

        {categorySpending?.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4">
            {categorySpending.map((plan) => (
              <div
                key={plan.category}
                className="bg-gray-50 p-3 border rounded-md"
              >
                <h4 className="font-medium text-gray-800">{plan.category}</h4>
                <p className="text-sm text-gray-600">
                  ${plan.spent.toFixed(2)} of ${plan.limit.toFixed(2)} used
                </p>
                <div className="w-full bg-gray-200 h-2 rounded mt-1">
                  <div
                    className={`h-2 rounded ${
                      plan.spent > plan.limit ? "bg-red-500" : "bg-green-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (plan.spent / plan.limit) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <AddExpenseForm
            groupId={id}
            members={group.members}
            onExpenseAdded={handleDataRefresh}
          />
          <h3 className="text-2xl font-semibold mt-8 mb-4">Expense History</h3>
          <ExpenseList expenses={expenses} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-2xl font-semibold mb-4">Members</h3>
          <ul className="space-y-2 mb-6">
            {group.members?.map((member) => (
              <li key={member._id} className="p-3 bg-gray-100 rounded-md">
                <div className="flex justify-between items-center">
                  <span>{member.name}</span>
                  <span className="text-sm text-gray-600">
                    Owes ${memberOwedTotals[member._id]?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <AddMemberForm groupId={id} onMemberAdded={handleDataRefresh} />
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;
