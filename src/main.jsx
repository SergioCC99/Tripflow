import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { TripsProvider } from './features/trips/TripsProvider.jsx'
import { ExpensesProvider } from './features/expenses/ExpensesProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <TripsProvider>
        <ExpensesProvider>
          <App />
        </ExpensesProvider>
      </TripsProvider>
    </BrowserRouter>
  </StrictMode>,
)
