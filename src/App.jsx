import { Route, Routes, useLocation } from 'react-router-dom';
import { TripHubPage } from './pages/TripHubPage';
import { NewTripWizard } from './pages/NewTripWizard';
import { ComingSoonPage } from './pages/ComingSoonPage';

export default function App() {
  const location = useLocation();
  const isCreatingTrip = location.pathname === '/viajes/nuevo';

  return (
    <>
      <Routes location={isCreatingTrip ? { ...location, pathname: '/' } : location}>
        <Route path="/" element={<TripHubPage />} />
        <Route path="/viajes/:tripId" element={<ComingSoonPage title="Dashboard del viaje" />} />
      </Routes>
      {isCreatingTrip && <NewTripWizard />}
    </>
  );
}
