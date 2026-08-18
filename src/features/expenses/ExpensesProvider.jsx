import { createContext, useContext, useMemo, useState } from 'react';
import { loadExpenses, saveExpenses } from './expensesStorage';
import { seedExpenses } from './seedExpenses';

const ExpensesContext = createContext(null);

function readInitialExpenses() {
  const stored = loadExpenses();
  if (stored.length > 0) return stored;

  saveExpenses(seedExpenses);
  return seedExpenses;
}

export function ExpensesProvider({ children }) {
  const [expenses, setExpenses] = useState(readInitialExpenses);

  const addExpense = (expense) => {
    setExpenses((prev) => {
      const next = [...prev, expense];
      saveExpenses(next);
      return next;
    });
  };

  const updateExpense = (id, patch) => {
    setExpenses((prev) => {
      const next = prev.map((expense) => (expense.id === id ? { ...expense, ...patch } : expense));
      saveExpenses(next);
      return next;
    });
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => {
      const next = prev.filter((expense) => expense.id !== id);
      saveExpenses(next);
      return next;
    });
  };

  const deleteExpensesByTrip = (tripId) => {
    setExpenses((prev) => {
      const next = prev.filter((expense) => expense.tripId !== tripId);
      saveExpenses(next);
      return next;
    });
  };

  const convertTripExpensesCurrency = (tripId, rate, newCurrency) => {
    setExpenses((prev) => {
      const next = prev.map((expense) =>
        expense.tripId === tripId
          ? { ...expense, amount: Math.round(expense.amount * rate), currency: newCurrency }
          : expense,
      );
      saveExpenses(next);
      return next;
    });
  };

  const expensesByTrip = useMemo(() => {
    return (tripId) => expenses.filter((expense) => expense.tripId === tripId);
  }, [expenses]);

  const getTripSpent = useMemo(() => {
    return (tripId) => expensesByTrip(tripId).reduce((total, expense) => total + expense.amount, 0);
  }, [expensesByTrip]);

  const value = useMemo(
    () => ({
      expenses,
      addExpense,
      updateExpense,
      deleteExpense,
      deleteExpensesByTrip,
      convertTripExpensesCurrency,
      expensesByTrip,
      getTripSpent,
    }),
    [expenses, expensesByTrip, getTripSpent],
  );

  return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>;
}

export function useExpenses() {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpensesProvider');
  }
  return context;
}
