import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { addExpense } from "../api/expenseService";

const AddExpenseForm = ({
  groupId,
  members,
  onExpenseAdded,
  categories = [],
}) => {
  const { user } = useContext(AuthContext);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [splitType, setSplitType] = useState("equal");
  const [customSplits, setCustomSplits] = useState([]);
  const [percentageSplits, setPercentageSplits] = useState([]);
  const [error, setError] = useState("");
  const [paidBy, setPaidBy] = useState(user?.userId || "");

  useEffect(() => {
    if (members) {
      const initialSplits = members.map((m) => ({
        user: m._id,
        name: m.name,
        amount: "",
      }));
      const initialPercentages = members.map((m) => ({
        user: m._id,
        name: m.name,
        percentage: "",
      }));
      setCustomSplits(initialSplits);
      setPercentageSplits(initialPercentages);
    }
  }, [members]);

  const handleCustomSplitChange = (userId, value) => {
    setCustomSplits((prev) =>
      prev.map((split) =>
        split.user === userId ? { ...split, amount: value } : split
      )
    );
  };

  const handlePercentageSplitChange = (userId, value) => {
    setPercentageSplits((prev) =>
      prev.map((split) =>
        split.user === userId ? { ...split, percentage: value } : split
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const totalAmount = parseFloat(amount);
    if (!description || !totalAmount || totalAmount <= 0) {
      setError("Please enter a valid description and amount.");
      return;
    }

    let expenseData = {
      description,
      amount: totalAmount,
      group: groupId,
      category: category || "None",
      splitType: splitType,
      paidBy,
    };

    if (splitType === "custom") {
      const splitsForApi = customSplits
        .filter((s) => parseFloat(s.amount) > 0)
        .map((s) => ({ user: s.user, amount: parseFloat(s.amount) }));

      const sumOfCustomSplits = splitsForApi.reduce(
        (sum, s) => sum + s.amount,
        0
      );

      if (Math.abs(sumOfCustomSplits - totalAmount) > 0.01) {
        setError(
          `Custom splits must add up to $${totalAmount.toFixed(
            2
          )}. Current total: $${sumOfCustomSplits.toFixed(2)}.`
        );
        return;
      }
      expenseData.splits = splitsForApi;
    } else if (splitType === "percentage") {
      const sumOfPercentages = percentageSplits.reduce(
        (sum, s) => sum + (parseFloat(s.percentage) || 0),
        0
      );

      if (Math.abs(sumOfPercentages - 100) > 0.01) {
        setError(
          `Percentages must add up to 100%. Current total: ${sumOfPercentages}%.`
        );
        return;
      }

      const splitsForApi = percentageSplits
        .filter((s) => parseFloat(s.percentage) > 0)
        .map((s) => ({
          user: s.user,
          amount: parseFloat(((totalAmount * s.percentage) / 100).toFixed(2)),
        }));

      const calculatedTotal = splitsForApi.reduce(
        (sum, s) => sum + s.amount,
        0
      );
      const remainder = totalAmount - calculatedTotal;
      if (splitsForApi.length > 0) {
        splitsForApi[0].amount += remainder;
      }

      expenseData.splits = splitsForApi;
    }

    try {
      await addExpense(expenseData, user.token);
      onExpenseAdded();

      // Reset form
      setDescription("");
      setAmount("");
      setCategory("");
      setSplitType("equal");

      if (members) {
        const initialSplits = members.map((m) => ({
          user: m._id,
          name: m.name,
          amount: "",
        }));
        const initialPercentages = members.map((m) => ({
          user: m._id,
          name: m.name,
          percentage: "",
        }));
        setCustomSplits(initialSplits);
        setPercentageSplits(initialPercentages);
      }
    } catch (err) {
      setError("Failed to add expense. Please try again.");
    }
  };

  const totalCustomAmount = customSplits.reduce(
    (sum, s) => sum + (parseFloat(s.amount) || 0),
    0
  );
  const remainingAmount = (parseFloat(amount) || 0) - totalCustomAmount;

  const totalPercentage = percentageSplits.reduce(
    (sum, s) => sum + (parseFloat(s.percentage) || 0),
    0
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border">
      <h3 className="text-xl font-semibold mb-4">Add a New Expense</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Paid By
          </label>
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="w-full mt-1 p-2 border rounded bg-white"
          >
            {members.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
            placeholder="e.g. Internet Bill"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount ($)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-1 p-2 border rounded bg-white"
            disabled={categories.length === 0}
          >
            <option value="">
              {categories.length > 0
                ? "Select a category"
                : "No categories available"}
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Split Type
          </label>
          <select
            value={splitType}
            onChange={(e) => setSplitType(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          >
            <option value="equal">Split Equally</option>
            <option value="custom">By Custom Amounts</option>
            <option value="percentage">By Percentage</option>
          </select>
        </div>

        {splitType === "custom" && (
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-2">
              Custom Split Amounts
            </h4>
            <p
              className={`text-sm mb-3 ${
                remainingAmount === 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              Amount remaining: ${remainingAmount.toFixed(2)}
            </p>
            {customSplits.map((split) => (
              <div key={split.user} className="flex items-center gap-4 mb-2">
                <label className="w-1/3">{split.name}</label>
                <input
                  type="number"
                  value={split.amount}
                  onChange={(e) =>
                    handleCustomSplitChange(split.user, e.target.value)
                  }
                  className="flex-grow p-2 border rounded"
                  placeholder="0.00"
                />
              </div>
            ))}
          </div>
        )}

        {splitType === "percentage" && (
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-2">
              Split by Percentage
            </h4>
            <p
              className={`text-sm mb-3 ${
                totalPercentage === 100 ? "text-green-600" : "text-red-600"
              }`}
            >
              Total Percentage: {totalPercentage}%
            </p>
            {percentageSplits.map((split) => (
              <div key={split.user} className="flex items-center gap-4 mb-2">
                <label className="w-1/3">{split.name}</label>
                <div className="relative flex-grow">
                  <input
                    type="number"
                    value={split.percentage}
                    onChange={(e) =>
                      handlePercentageSplitChange(split.user, e.target.value)
                    }
                    className="p-2 border rounded w-full pr-8"
                    placeholder="0"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                    %
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default AddExpenseForm;
