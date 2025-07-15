import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  getGroupDetails,
  updateGroupBudget,
  addBudgetPlan,
  deleteBudgetPlan,
  getGroupActivity,
  getGroupBalances,
} from "../api/groupService";
import { getGroupExpenses } from "../api/expenseService";
// import {
//   getGroupBalances,
//   // getSettlementHistory,
// } from "../api/settlementService";

import AddExpenseForm from "../components/AddExpenseForm";
// import ExpenseList from "../components/ExpenseList";
import AddMemberForm from "../components/AddMemberForm";
import GroupBalances from "../components/GroupBalances";
import ActivityFeed from "../components/ActivityFeed";
import ActivityPieChart from "../components/ActivityPieChart";

const GroupDetail = () => {
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const [settlementHistory, setSettlementHistory] = useState([]);
  const [activity, setActivity] = useState([]);

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudget, setNewBudget] = useState("");
  const [showAddPlanForm, setShowAddPlanForm] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newLimit, setNewLimit] = useState("");
  const { id: groupId } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const [addPlanError, setAddPlanError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchAllGroupData = async () => {
      if (!currentUser?.token || !groupId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [
          groupData,
          expensesData,
          balancesData,
          // historyData,
          activityData,
        ] = await Promise.all([
          getGroupDetails(groupId, currentUser.token),
          getGroupExpenses(groupId, currentUser.token),
          getGroupBalances(groupId, currentUser.token),
          // getSettlementHistory(groupId, currentUser.token),
          getGroupActivity(groupId, currentUser.token),
        ]);

        setGroup(groupData);
        setNewBudget(groupData.budget || "");
        setExpenses(expensesData);
        setBalances(balancesData);
        // setSettlementHistory(historyData || []);
        setActivity(activityData);
        setError("");
      } catch (err) {
        setError("Failed to load group data. You may not be a member.");
        console.error(err); // Log error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchAllGroupData();
  }, [groupId, currentUser, refreshTrigger]);

  // --- Handlers ---
  const handleDataRefresh = () => {
    setRefreshTrigger((count) => count + 1);
  };

  const handleUpdateBudget = async () => {
    if (isNaN(parseFloat(newBudget))) {
      setError("Please enter a valid number for the budget.");
      return;
    }
    try {
      await updateGroupBudget(
        groupId,
        { budget: parseFloat(newBudget) },
        currentUser.token
      );
      setIsEditingBudget(false);
      handleDataRefresh();
    } catch (err) {
      setError("Failed to update budget.");
    }
  };

  const handleAddBudgetPlan = async (e) => {
    e.preventDefault();
    if (!newCategory.trim() || !newLimit.trim()) {
      setAddPlanError("Please enter both a category and a limit.");
      return;
    }
    try {
      await addBudgetPlan(
        groupId,
        {
          category: newCategory.trim(),
          limit: parseFloat(newLimit),
        },
        currentUser.token
      );
      setShowAddPlanForm(false);
      setNewCategory("");
      setNewLimit("");
      setAddPlanError("");
      handleDataRefresh();
    } catch (err) {
      setAddPlanError("Failed to add budget plan.");
    }
  };

  const handleDeleteBudgetPlan = async (e, categoryId) => {
    e.preventDefault();
    if (!groupId || !categoryId) {
      //setAddPlanError("Please enter both a category and a limit.");
      return;
    }
    try {
      await deleteBudgetPlan(
        groupId,
        categoryId,
        currentUser.token
      );
      setShowAddPlanForm(false);
      setNewCategory("");
      setNewLimit("");
      setAddPlanError("");
      handleDataRefresh();
    } catch (err) {
      setAddPlanError("Failed to add budget plan.");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!group) return <div className="p-8 text-center">Group not found.</div>;

  const totalOutstanding = balances
    ? Object.values(balances)
        .filter((data) => data.net > 0)
        .reduce((sum, creditor) => sum + creditor.net, 0)
    : 0;

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const userTotals = {};

  expenses.forEach((expense) => {
    const payer = expense.paidBy?.name || "Unknown";
    userTotals[payer] = (userTotals[payer] || 0) + expense.amount;
  });

  const chartData = Object.entries(userTotals).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <h2 className="text-center text-4xl font-bold mb-2">{group.name}</h2>
      <p className=" text-center text-gray-500 mb-8"> {group.description}</p>

      {totalOutstanding > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-lg font-semibold text-blue-800">
            Total Outstanding Balance to be Settled:
          </p>
          <p className="text-3xl font-bold text-blue-900">
            ${totalOutstanding.toFixed(2)}
          </p>
        </div>
      )}

      {/* --- Budget Overview and Editing Section --- */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 border">
        <h3 className="text-2xl font-semibold mb-2">Group Budget Overview</h3>
        <div className="flex items-center gap-4">
          {!isEditingBudget ? (
            <div className="flex items-center gap-4">
              <p className="text-gray-700">
                Total Spent:
                <span
                  className={`font-bold ${
                    group.budget > 0 && totalSpent > group.budget
                      ? "text-red-600" // Over budget
                      : "text-green-600" // Under or at budget
                  }`}
                >
                  {" "}
                  ${totalSpent.toFixed(2)}
                </span>
                {group.budget > 0 && (
                  <>
                    {" "}
                    of{" "}
                    <span className="font-bold">
                      ${group.budget.toFixed(2)}
                    </span>
                  </>
                )}
              </p>
              <button
                onClick={() => setIsEditingBudget(true)}
                className="text-sm text-blue-600 hover:underline"
              >
                Edit Budget
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                className="p-2 border rounded-md w-32"
                placeholder="Set budget"
              />
              <button
                onClick={handleUpdateBudget}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditingBudget(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        <div className="flex justify-center items-center">
          <ActivityPieChart data={chartData} />
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-2xl font-semibold mb-4">Members</h3>
          <ul className="space-y-2 mb-6">
            {group.members?.map((member) => (
              <li key={member._id} className="p-3 bg-gray-100 rounded-md">
                {member.name}
              </li>
            ))}
          </ul>
          <AddMemberForm groupId={groupId} onMemberAdded={handleDataRefresh} />
        </div>

        <h3 className="text-2xl font-semibold mt-8 mb-4">Group Activity</h3>
        <ActivityFeed items={activity} />

        <GroupBalances
          groupId={groupId}
          balances={balances}
          isLoading={loading}
          onSettlementSuccess={handleDataRefresh}
        />
      </div>
      <div className="h-6" />

      {/* --- Category Budgets Section --- */}
      <div className="bg-white p-6 rounded-lg shadow mb-6 border">
        <h3 className="text-2xl font-semibold mb-4">Category Budgets</h3>
        <div className="space-y-3">
          {group.budgetPlans?.length > 0 ? (
            group.budgetPlans.map((plan) => {
              const spent = expenses
                .filter((e) => e.category === plan.category)
                .reduce((sum, e) => sum + e.amount, 0);
              return (
                <div
                  key={plan.category}
                  className="bg-gray-50 p-3 border rounded-md"
                >
                  <div class="flex justify-between items-center">
                    <h4 className="font-medium text-gray-800">{plan.category}</h4>
                    <button class="text-red-500 hover:text-red-700 text-sm font-medium" onClick={(event) =>  {
                      const confirmDelete = window.confirm("Are you sure you want to delete this item?");
                      if (confirmDelete) {
                        handleDeleteBudgetPlan(event, plan._id);
                      }
                    }}>Delete</button>
                  </div>
                  <p className="text-sm text-gray-600">
                    ${spent.toFixed(2)} of ${plan.limit.toFixed(2)} used
                  </p>
                  <div className="w-full bg-gray-200 h-2 rounded mt-1">
                    <div
                      className={`h-2 rounded ${
                        spent > plan.limit ? "bg-red-500" : "bg-green-500"
                      }`}
                      style={{
                        width: `${Math.min(100, (spent / plan.limit) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No category budgets have been set.</p>
          )}
        </div>
        <div className="mt-4">
          {!showAddPlanForm ? (
            <button
              onClick={() => {
                setShowAddPlanForm(true);
                setAddPlanError("");
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              + Add Category Budget
            </button>
          ) : (
            <div className="mt-4 p-4 border-t">
              <form onSubmit={handleAddBudgetPlan}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <input
                    type="text"
                    placeholder="Category Name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="p-2 border rounded-md flex-grow"
                  />
                  <input
                    type="number"
                    placeholder="Limit"
                    value={newLimit}
                    onChange={(e) => setNewLimit(e.target.value)}
                    className="p-2 border rounded-md w-32"
                  />
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddPlanForm(false);
                      setNewCategory("");
                      setNewLimit("");
                      setAddPlanError("");
                    }}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
              {addPlanError && (
                <p className="text-red-600 text-sm mt-3 ml-1">{addPlanError}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-3">
          <AddExpenseForm
            groupId={groupId}
            members={group.members}
            onExpenseAdded={handleDataRefresh}
            categories={group.budgetPlans?.map((plan) => plan.category)}
          />
          {/* <h3 className="text-2xl font-semibold mt-8 mb-4">Expense History</h3> */}
          {/* <ExpenseList expenses={expenses} /> */}
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;
