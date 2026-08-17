import { Route, Routes, useLocation } from 'react-router-dom';
import { TripHubPage } from './pages/TripHubPage';
import { NewTripWizard } from './pages/NewTripWizard';
import { TripDashboardPage } from './pages/TripDashboardPage';

export default function App() {
  const location = useLocation();
  const isCreatingTrip = location.pathname === '/viajes/nuevo';

  return (
    <>
      <Routes location={isCreatingTrip ? { ...location, pathname: '/' } : location}>
        <Route path="/" element={<TripHubPage />} />
        <Route path="/viajes/:tripId" element={<TripDashboardPage />} />
      </Routes>
      {isCreatingTrip && <NewTripWizard />}
    </>
  );
}
