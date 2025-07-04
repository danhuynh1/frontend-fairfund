import React, { useState, useContext } from "react";
import { recordSettlement } from "../api/settlementService";
import { AuthContext } from "../context/AuthContext";

const GroupBalances = ({
  groupId,
  balances,
  isLoading,
  onSettlementSuccess,
  settlementHistory = [],
}) => {
  const [error, setError] = useState("");
  const [settlement, setSettlement] = useState({
    from: "",
    to: "",
    amount: "",
  });
  const { user: currentUser } = useContext(AuthContext);

  const handleSettleSubmit = async (e) => {
    e.preventDefault();
    if (!settlement.from || !settlement.to || !settlement.amount) {
      setError("Please fill out all settlement fields.");
      return;
    }
    try {

      const newSettlement = await recordSettlement(
        { ...settlement, group: groupId },
        currentUser.token
      );

      setSettlement({ from: "", to: "", amount: "" });
      setError("");

      onSettlementSuccess(newSettlement);
    } catch (err) {
      setError(err.message || "Failed to record settlement.");
    }
  };

  const handleSettlementChange = (e) => {
    const { name, value } = e.target;
    setSettlement((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <p className="text-center mt-4 text-gray-500">Loading balances...</p>
    );
  }

  if (!balances) {
    return null;
  }

  const members = Object.entries(balances);
  const debtors = members.filter(([_, data]) => data.net < 0);
  const creditors = members.filter(([_, data]) => data.net > 0);
  const totalPaidInGroup = members.reduce(
    (sum, [_, data]) => sum + data.paid,
    0
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <h3 className="text-2xl font-bold mb-4">Group Settlements</h3>
      {error && <p className="text-center mb-4 text-red-500">{error}</p>}

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-semibold text-lg text-red-600 mb-2">
            Who Owes Money
          </h4>
          {debtors.length > 0 ? (
            debtors.map(([userId, data]) => (
              <div
                key={userId}
                className="flex justify-between items-center p-2 bg-red-50 rounded-md mb-2"
              >
                <span>{data.name}</span>
                <span className="font-bold text-red-700">
                  Owes ${Math.abs(data.net).toFixed(2)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No one owes money.</p>
          )}
        </div>
        <div>
          <h4 className="font-semibold text-lg text-green-600 mb-2">
            Who Is Owed Money
          </h4>
          {creditors.length > 0 ? (
            creditors.map(([userId, data]) => (
              <div
                key={userId}
                className="flex justify-between items-center p-2 bg-green-50 rounded-md mb-2"
              >
                <span>{data.name}</span>
                <span className="font-bold text-green-700">
                  Is owed ${data.net.toFixed(2)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No one is owed money.</p>
          )}
        </div>
      </div>

      <div className="mt-6 border-t pt-6">
        <h4 className="font-semibold text-xl mb-3">Record a Payment</h4>
        {totalPaidInGroup === 0 && debtors.length === 0 ? (
          <div className="text-center p-4 bg-gray-50 rounded-md">
            <p className="text-gray-600">No expenses have been added yet.</p>
          </div>
        ) : debtors.length === 0 && creditors.length === 0 ? (
          <div className="text-center p-4 bg-gray-50 rounded-md">
            <p className="text-gray-600">Everything is settled up.</p>
          </div>
        ) : (
          <form onSubmit={handleSettleSubmit}>
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[150px]">
                <label
                  htmlFor="from"
                  className="block text-sm font-medium text-gray-700"
                >
                  From
                </label>
                <select
                  name="from"
                  value={settlement.from}
                  onChange={handleSettlementChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                >
                  <option value="">Select Payer</option>
                  {debtors.map(([userId, data]) => (
                    <option key={data.userId} value={data.userId}>
                      {data.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label
                  htmlFor="to"
                  className="block text-sm font-medium text-gray-700"
                >
                  To
                </label>
                <select
                  name="to"
                  value={settlement.to}
                  onChange={handleSettlementChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                >
                  <option value="">Select Recipient</option>
                  {creditors.map(([userId, data]) => (
                    <option key={data.userId} value={data.userId}>
                      {data.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[100px]">
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  placeholder="0.00"
                  step="0.01"
                  value={settlement.amount}
                  onChange={handleSettlementChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
              >
                Settle Up
              </button>
            </div>
          </form>
        )}
      </div>

  

    </div>
  );
};

export default GroupBalances;
