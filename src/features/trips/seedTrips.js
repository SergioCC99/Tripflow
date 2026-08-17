import japan from '../../assets/images/JAPAN-MAIN.jpg.webp';
import cartagena from '../../assets/images/Cartagena.jpg';
import lisboa from '../../assets/images/Lisboa.jpg';
import bogota from '../../assets/images/Bogota.jpeg';
import medellin from '../../assets/images/Medellin.jpg';
import rio from '../../assets/images/Rio.jpg';

export const seedTrips = [
  {
    id: 'japon',
    destination: 'Japón',
    imageUrl: japan,
    startDate: '2026-08-12',
    endDate: '2026-08-21',
    totalBudget: 10_000_000,
    spentAmount: 5_750_000,
    currency: 'COP',
    status: 'ongoing',
  },
  {
    id: 'cartagena',
    destination: 'Cartagena',
    imageUrl: cartagena,
    startDate: '2026-09-05',
    endDate: '2026-09-10',
    totalBudget: 3_000_000,
    spentAmount: 450_000,
    currency: 'COP',
    status: 'upcoming',
  },
  {
    id: 'lisboa',
    destination: 'Lisboa',
    imageUrl: lisboa,
    startDate: '2026-10-02',
    endDate: '2026-10-14',
    totalBudget: 8_500_000,
    spentAmount: 1_200_000,
    currency: 'COP',
    status: 'upcoming',
  },
  {
    id: 'bogota',
    destination: 'Bogotá',
    imageUrl: bogota,
    startDate: '2026-11-20',
    endDate: '2026-11-23',
    totalBudget: 1_500_000,
    spentAmount: 0,
    currency: 'COP',
    status: 'upcoming',
  },
  {
    id: 'medellin',
    destination: 'Medellín',
    imageUrl: medellin,
    startDate: '2026-06-01',
    endDate: '2026-06-05',
    totalBudget: 1_200_000,
    spentAmount: 1_150_000,
    currency: 'COP',
    status: 'completed',
  },
  {
    id: 'rio',
    destination: 'Río de Janeiro',
    imageUrl: rio,
    startDate: '2026-04-10',
    endDate: '2026-04-20',
    totalBudget: 6_000_000,
    spentAmount: 5_980_000,
    currency: 'COP',
    status: 'completed',
  },
];
