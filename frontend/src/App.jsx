import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock Data
const mockTransactions = [
  { id: 1, date: '2026-03-15', amount: 5000, category: 'Salary', type: 'income', description: 'Monthly Salary' },
  { id: 2, date: '2026-03-18', amount: 1200, category: 'Groceries', type: 'expense', description: 'Weekly groceries' },
  { id: 3, date: '2026-03-19', amount: 2500, category: 'Rent', type: 'expense', description: 'Monthly rent' },
  { id: 4, date: '2026-03-20', amount: 800, category: 'Entertainment', type: 'expense', description: 'Movies and games' },
  { id: 5, date: '2026-03-21', amount: 3000, category: 'Freelance Work', type: 'income', description: 'Project payment' },
  { id: 6, date: '2026-03-22', amount: 150, category: 'Utilities', type: 'expense', description: 'Electricity bill' },
  { id: 7, date: '2026-03-23', amount: 500, category: 'Transportation', type: 'expense', description: 'Fuel and parking' },
  { id: 8, date: '2026-03-25', amount: 2000, category: 'Shopping', type: 'expense', description: 'Clothes and accessories' },
  { id: 9, date: '2026-03-26', amount: 1500, category: 'Healthcare', type: 'expense', description: 'Medical checkup' },
  { id: 10, date: '2026-03-28', amount: 800, category: 'Dining', type: 'expense', description: 'Restaurant meals' },
];

const monthlyTrendData = [
  { month: 'Jan', balance: 2500 },
  { month: 'Feb', balance: 4200 },
  { month: 'Mar', balance: 6800 },
  { month: 'Apr', balance: 8500 },
];

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const App = () => {
  const [userRole, setUserRole] = useState('viewer');
  const [transactions, setTransactions] = useState(mockTransactions);
  const [sortBy, setSortBy] = useState('date');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    date: '',
    amount: '',
    category: 'Other',
    type: 'expense',
    description: '',
  });

  // Calculate summary data
  const summary = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, balance };
  }, [transactions]);

  // Process spending by category
  const categoryData = useMemo(() => {
    const categories = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      });

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value,
    }));
  }, [transactions]);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let result = transactions;

    if (filterType !== 'all') {
      result = result.filter((t) => t.type === filterType);
    }

    if (searchTerm) {
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'amount-high') {
      result.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === 'amount-low') {
      result.sort((a, b) => a.amount - b.amount);
    }

    return result;
  }, [transactions, sortBy, filterType, searchTerm]);

  // Calculate insights
  const insights = useMemo(() => {
    if (categoryData.length === 0) return [];

    const topCategory = categoryData.reduce((prev, current) =>
      prev.value > current.value ? prev : current
    );

    const avgTransaction =
      transactions.length > 0
        ? Math.round(transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length)
        : 0;

    const expenseCount = transactions.filter((t) => t.type === 'expense').length;
    const incomeCount = transactions.filter((t) => t.type === 'income').length;

    return [
      {
        title: 'Highest Spending Category',
        value: `${topCategory.name}`,
        detail: `₹${topCategory.value.toLocaleString()}`,
      },
      {
        title: 'Average Transaction',
        value: `₹${avgTransaction.toLocaleString()}`,
        detail: `Across ${transactions.length} transactions`,
      },
      {
        title: 'Expense vs Income',
        value: `${expenseCount} expenses`,
        detail: `vs ${incomeCount} income`,
      },
    ];
  }, [transactions, categoryData]);

  // Handle adding new transaction
  const handleAddTransaction = () => {
    if (!newTransaction.date || !newTransaction.amount || !newTransaction.category) {
      alert('Please fill all fields');
      return;
    }

    const transaction = {
      id: Math.max(...transactions.map((t) => t.id), 0) + 1,
      ...newTransaction,
      amount: parseFloat(newTransaction.amount),
    };

    setTransactions([...transactions, transaction]);
    setNewTransaction({
      date: '',
      amount: '',
      category: 'Other',
      type: 'expense',
      description: '',
    });
    setShowAddForm(false);
  };

  // Handle deleting transaction (Admin only)
  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Financial Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="px-4 py-2 bg-slate-100 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-200 transition"
              >
                <option value="viewer">Viewer Mode</option>
                <option value="admin">Admin Mode</option>
              </select>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                userRole === 'admin'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Balance</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  ₹{summary.balance.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
                💰
              </div>
            </div>
            <p className={`text-sm mt-4 ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {summary.balance >= 0 ? '✓ Positive' : '✗ Negative'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Income</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  ₹{summary.totalIncome.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-xl">
                📈
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-4">Incoming funds</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Expenses</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  ₹{summary.totalExpenses.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-xl">
                📉
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-4">Outgoing funds</p>
          </div>
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Line Chart - Balance Trend */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Balance Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart - Spending by Category */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Spending Breakdown</h2>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ₹${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => `₹${value}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-slate-500">No expense data available</p>
              </div>
            )}
          </div>
        </section>

        {/* Insights Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Key Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {insights.map((insight, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition"
              >
                <p className="text-slate-600 text-sm font-medium">{insight.title}</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">{insight.value}</p>
                <p className="text-slate-500 text-sm mt-2">{insight.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Transactions Section */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Transactions</h2>
            {userRole === 'admin' && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                {showAddForm ? '✕ Cancel' : '+ Add Transaction'}
              </button>
            )}
          </div>

          {/* Add Transaction Form (Admin Only) */}
          {showAddForm && userRole === 'admin' && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, date: e.target.value })
                  }
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={newTransaction.amount}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, amount: e.target.value })
                  }
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={newTransaction.category}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, category: e.target.value })
                  }
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Salary</option>
                  <option>Freelance Work</option>
                  <option>Groceries</option>
                  <option>Rent</option>
                  <option>Entertainment</option>
                  <option>Utilities</option>
                  <option>Transportation</option>
                  <option>Shopping</option>
                  <option>Healthcare</option>
                  <option>Dining</option>
                  <option>Other</option>
                </select>
                <select
                  value={newTransaction.type}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, type: e.target.value })
                  }
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <input
                  type="text"
                  placeholder="Description"
                  value={newTransaction.description}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, description: e.target.value })
                  }
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-1"
                />
                <button
                  onClick={handleAddTransaction}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Filter and Search Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by category or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="income">Income Only</option>
              <option value="expense">Expense Only</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Sort by Date (Newest)</option>
              <option value="amount-high">Amount (High to Low)</option>
              <option value="amount-low">Amount (Low to High)</option>
            </select>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Description</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Type</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-700">Amount</th>
                  {userRole === 'admin' && (
                    <th className="text-center px-4 py-3 font-semibold text-slate-700">Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition"
                    >
                      <td className="px-4 py-3 text-slate-700">
                        {new Date(transaction.date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{transaction.description}</td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            transaction.type === 'income'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {transaction.type === 'income' ? '+ Income' : '- Expense'}
                        </span>
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-semibold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                      </td>
                      {userRole === 'admin' && (
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            className="text-red-600 hover:text-red-700 font-medium transition"
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={userRole === 'admin' ? 6 : 5} className="px-4 py-8 text-center text-slate-500">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        
      </main>
    </div>
  );
};

export default App;