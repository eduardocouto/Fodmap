
import React, { useMemo } from 'react';
import { FORBIDDEN_FOODS } from '../constants/foods';
import type { ForbiddenFoodItem } from '../types';

interface GroupedForbiddenFoods {
  [category: string]: ForbiddenFoodItem[];
}

const ForbiddenFoods: React.FC = () => {
  const groupedFoods = useMemo(() => {
    return FORBIDDEN_FOODS.reduce((acc, food) => {
      const { category } = food;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(food);
      return acc;
    }, {} as GroupedForbiddenFoods);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">Guia de Alimentos a Evitar</h2>
        <p className="mt-2 text-gray-600">
          Esta é uma lista de referência de alimentos ricos em FODMAPs. Recomenda-se que os evite durante a fase de eliminação da dieta.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(groupedFoods).sort(([a], [b]) => a.localeCompare(b)).map(([category, foods]) => (
          <div key={category} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col">
            <h3 className="text-lg font-bold text-gray-700 mb-3 border-b pb-2">{category}</h3>
            <ul className="space-y-2 flex-grow">
              {foods.map(food => (
                <li key={food.id} className="text-sm">
                  <p className="font-semibold text-gray-800">{food.name}</p>
                  <p className="text-red-600 text-xs italic">{food.reason}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForbiddenFoods;