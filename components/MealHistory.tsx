import React from 'react';
import type { HistoricalMeal } from '../types';

interface MealHistoryProps {
  history: HistoricalMeal[];
  onLoad: (meal: HistoricalMeal) => void;
  onDelete: (mealId: string) => void;
}

const MealHistory: React.FC<MealHistoryProps> = ({ history, onLoad, onDelete }) => {
  if (history.length === 0) {
    return null; // Don't render anything if there's no history
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Histórico de Refeições</h2>
      <p className="text-sm text-gray-600 mb-6">Carregue rapidamente uma refeição que guardou anteriormente.</p>
      
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {history.map(item => (
          <div key={item.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-grow">
                <p className="font-bold text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-500">Guardado em: {new Date(item.createdAt).toLocaleString('pt-PT')}</p>
                <details className="mt-2 text-xs text-gray-600">
                  <summary className="cursor-pointer font-medium">Ver ingredientes ({item.meal.length})</summary>
                  <ul className="list-disc list-inside pl-2 mt-1 space-y-1">
                    {item.meal.map(mealItem => (
                      <li key={mealItem.instanceId}>{mealItem.food.name} ({mealItem.currentAmount}{mealItem.food.unit})</li>
                    ))}
                  </ul>
                </details>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                 <button 
                   onClick={() => onLoad(item)}
                   className="px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-md hover:bg-emerald-200 transition"
                 >
                   Carregar
                 </button>
                 <button 
                   onClick={() => onDelete(item.id)}
                   className="px-3 py-1.5 bg-red-100 text-red-800 text-xs font-semibold rounded-md hover:bg-red-200 transition"
                 >
                   Remover
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealHistory;
