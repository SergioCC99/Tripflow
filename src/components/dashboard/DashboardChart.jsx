import { useState } from 'react';
import { TabGroup } from '../ui/TabGroup';
import { CategoryChart } from './CategoryChart';
import { DayChart } from './DayChart';
import { MethodChart } from './MethodChart';

const TAB_OPTIONS = [
  { label: 'Por categoría', value: 'category' },
  { label: 'Por día', value: 'day' },
  { label: 'Por método', value: 'method' },
];

export function DashboardChart({ trip, expenses }) {
  const [activeTab, setActiveTab] = useState('category');

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full flex-col gap-2">
        <h2 className="text-xl font-bold text-ink">Dashboard</h2>
        <TabGroup options={TAB_OPTIONS} value={activeTab} onChange={setActiveTab} size="sm" />
      </div>

      {activeTab === 'category' && <CategoryChart expenses={expenses} />}
      {activeTab === 'day' && <DayChart trip={trip} expenses={expenses} />}
      {activeTab === 'method' && <MethodChart expenses={expenses} />}
    </div>
  );
}
