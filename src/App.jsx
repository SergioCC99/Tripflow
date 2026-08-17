import { Route, Routes } from 'react-router-dom';
import { TripHubPage } from './pages/TripHubPage';
import { ComingSoonPage } from './pages/ComingSoonPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TripHubPage />} />
      <Route path="/viajes/nuevo" element={<ComingSoonPage title="Crear nuevo viaje" />} />
      <Route path="/viajes/:tripId" element={<ComingSoonPage title="Dashboard del viaje" />} />
    </Routes>
  );
}
