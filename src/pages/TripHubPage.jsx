import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/trips/AppHeader';
import { TripGrid } from '../components/trips/TripGrid';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { TabGroup } from '../components/ui/TabGroup';
import { useTrips } from '../features/trips/TripsProvider';
import plusIcon from '../assets/icons/plus.svg';

const TAB_OPTIONS = [
  { label: 'En curso', value: 'ongoing' },
  { label: 'Próximos', value: 'upcoming' },
  { label: 'Finalizados', value: 'completed' },
];

const EMPTY_MESSAGES = {
  ongoing: 'No tienes viajes en curso.',
  upcoming: 'No tienes próximos viajes.',
  completed: 'Aún no tienes viajes finalizados.',
};

export function TripHubPage() {
  const { tripsByStatus } = useTrips();
  const [activeTab, setActiveTab] = useState('ongoing');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const visibleTrips = useMemo(() => {
    const trips = tripsByStatus(activeTab);
    const query = search.trim().toLowerCase();
    if (!query) return trips;
    return trips.filter((trip) => trip.destination.toLowerCase().includes(query));
  }, [tripsByStatus, activeTab, search]);

  const goToNewTrip = () => navigate('/viajes/nuevo');

  return (
    <div className="min-h-screen bg-surface pb-24 lg:pb-16">
      <AppHeader
        userName="Paula"
        actions={
          <Button icon={<img src={plusIcon} alt="" className="size-[22px]" />} onClick={goToNewTrip}>
            Nuevo viaje
          </Button>
        }
      />

      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 pt-6 lg:px-6">
        <div className="flex w-full flex-col items-start gap-4">
          <h2 className="text-xl font-bold text-ink">Mis viajes</h2>
          <div className="w-full lg:max-w-[445px]">
            <SearchInput value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <TabGroup options={TAB_OPTIONS} value={activeTab} onChange={setActiveTab} />
        </div>

        <TripGrid trips={visibleTrips} emptyMessage={EMPTY_MESSAGES[activeTab]} />
      </main>

      <Button
        icon={<img src={plusIcon} alt="" className="size-[22px]" />}
        onClick={goToNewTrip}
        className="fixed right-4 bottom-8 lg:hidden"
      >
        Nuevo viaje
      </Button>
    </div>
  );
}
