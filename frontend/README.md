 Finance Dashboard


##  Project Overview

This is a single-file finance dashboard application that allows users to track their financial activity, understand spending patterns, and manage transactions with role-based access control. The project focuses on clean UI/UX design, responsive layout, and effective state management.


##  Key Features

### 1. **Dashboard Overview**
- **Summary Cards** displaying Total Balance, Total Income, and Total Expenses
- **Balance Trend Chart** - Line chart showing monthly balance progression
- **Spending Breakdown** - Pie chart visualizing expenses by category
- **Real-time calculations** with formatted currency display (₹)

### 2. **Transactions Section**
- **Comprehensive transaction list** with Date, Description, Category, Type, and Amount
- **Advanced filtering:**
  - Filter by transaction type (All, Income, Expense)
  - Search by description or category
  - Sort by date, amount (high to low), or amount (low to high)
- **Responsive table** with proper formatting and visual indicators
- **Empty state handling** with user-friendly messages

### 3. **Role-Based UI (RBAC)**
- **Viewer Mode:**
  - View-only access to all financial data
  - Can search, filter, and sort transactions
  - Cannot modify or add data
  
- **Admin Mode:**
  - Full access to all features
  - Ability to add new transactions with a form
  - Can delete existing transactions
  - Same viewing capabilities as Viewer

- **Role switcher** in the header for easy demo switching

### 4. **Insights Section**
- **Highest Spending Category** - Shows which category you spend the most on
- **Average Transaction** - Calculates and displays average transaction amount
- **Expense vs Income Ratio** - Shows count of expenses versus income transactions
- Dynamic calculations based on current data

### 5. **State Management**
- Pure React hooks (useState, useMemo) for state management
- No external state management library needed
- Optimal performance through useMemo for expensive calculations
- Real-time updates across components

### 6. **UI/UX Design**
- **Modern Design** - Gradient background, rounded cards, smooth transitions
- **Responsive Layout** - Works seamlessly on mobile, tablet, and desktop
  - Grid layout adapts from 1 to 3 columns based on screen size
  - Mobile-friendly forms and tables
- **Visual Feedback** - Hover effects, color-coded transactions, status badges
- **Accessibility** - Clear labels, proper spacing, readable fonts
- **Consistent Styling** - Tailwind CSS utility-first approach

### 7. **Edge Case Handling**
- Empty transaction list displays appropriate message
- Division by zero prevention for average calculations
- Form validation before adding transactions
- Proper date formatting based on locale (en-IN)
- Graceful handling of empty pie chart

##  Architecture & Code Structure

### Single-File Design
The entire application is built in one `App.jsx` file for simplicity and ease of submission:

```
src/
  └── App.jsx (Complete dashboard component - ~800 lines)
```

### Component Organization
The App component is organized into the following sections:
- Header with role selector
- Summary cards (Balance, Income, Expenses)
- Charts (Balance trend and spending breakdown)
- Insights section (Key financial insights)
- Transactions section (List, add, filter, sort)
- Footer

### State Management
```javascript
- userRole: 'viewer' | 'admin'
- transactions: Array<Transaction>
- sortBy: 'date' | 'amount-high' | 'amount-low'
- filterType: 'all' | 'income' | 'expense'
- searchTerm: string
- showAddForm: boolean
- newTransaction: Transaction object
```

##  Mock Data

The dashboard comes with 10 sample transactions:
- 2 Income transactions (Salary, Freelance Work)
- 8 Expense transactions across various categories
- Monthly trend data for visualization
- Automatic date formatting

**Categories included:**
Salary, Freelance Work, Groceries, Rent, Entertainment, Utilities, Transportation, Shopping, Healthcare, Dining

##  Technology Stack

- **Framework:** React 19.2.4
- **Build Tool:** Vite 8.0.1
- **Styling:** Tailwind CSS 4.2.2
- **Charting:** Recharts 3.8.1
- **Language:** JavaScript/JSX

##  Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation & Running

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dashboard will be available at `http://localhost:5173`

##  How to Use

### As a Viewer:
1. View all financial data (balance, income, expenses)
2. Explore visualizations (charts and insights)
3. Search and filter transactions
4. Cannot add or modify transactions

### As an Admin:
1. All viewer capabilities plus:
2. Click "Add Transaction" to open the form
3. Fill in date, amount, category, type, and description
4. Click "Save" to add the transaction
5. Click "Delete" next to any transaction to remove it
6. All changes update charts and insights in real-time

### Filtering & Sorting:
- **Search Box:** Type to filter transactions by category or description
- **Type Filter:** Choose between All, Income, or Expense
- **Sort Dropdown:** Sort by newest date, highest amount, or lowest amount

##  Responsive Design Features

- **Desktop (1024px+):** 3-column grid for cards, 2-column grid for charts
- **Tablet (768px-1023px):** 2 columns for some sections
- **Mobile (<768px):** Single column layout, stacked elements
- **Forms:** Responsive input grid adapts to screen size

##  Features Demonstrating Best Practices

1. **Code Quality:**
   - Clear, descriptive variable names
   - Organized code with comments
   - DRY principles applied
   - Efficient rendering with useMemo

2. **User Experience:**
   - Smooth transitions and hover effects
   - Clear visual hierarchy
   - Proper form validation
   - Intuitive role switching

3. **Performance:**
   - Optimized calculations with useMemo
   - Efficient re-renders
   - Lightweight dependencies

4. **Maintainability:**
   - Single file structure makes it easy to review
   - Clear separation of logic and UI
   - Easy to extend with additional features

##  Future Enhancement Possibilities

- Dark mode toggle
- Local storage persistence
- CSV/JSON export functionality
- Edit transaction feature
- Budget planning and tracking
- Advanced filtering options
- Monthly/yearly comparisons
- Transaction categorization improvements
- Mobile app version
- Backend API integration

##  Assignment Fulfillment

✅ **Dashboard Overview** - Summary cards and visualizations included  
✅ **Transactions Section** - Full list with filtering, sorting, and search  
✅ **Role-Based UI** - Viewer/Admin modes with different capabilities  
✅ **Insights Section** - Key insights calculated from data  
✅ **State Management** - Proper React hooks implementation  
✅ **UI/UX** - Clean design with Tailwind CSS  
✅ **Responsiveness** - Mobile-friendly layout  
✅ **Edge Cases** - Empty states and validation handled  
✅ **Documentation** - Clear README with usage instructions  


**Last Updated:** April 3, 2026  
**Status:** Ready for Submission
