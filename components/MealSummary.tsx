
import React, { useMemo } from 'react';
import type { MealItem } from '../types';
import { FodmapType } from '../types';
import FodmapIndicator from './FodmapIndicator';

interface MealSummaryProps {
  meal: MealItem[];
  onClearMeal: () => void;
  onOpenSaveModal: () => void;
}

const calculateMealCalories = (meal: MealItem[]): number => {
    if (!meal) return 0;
    return meal.reduce((total, item) => {
      const { food, currentAmount } = item;
      if (typeof food.calories !== 'number') return total;
      
      let itemCalories = 0;
      if (food.unit.includes('g') || food.unit.includes('ml')) {
        itemCalories = (currentAmount / 100) * food.calories;
      } else {
        itemCalories = currentAmount * food.calories;
      }
      return total + (itemCalories || 0);
    }, 0);
};


const MealSummary: React.FC<MealSummaryProps> = ({ meal, onClearMeal, onOpenSaveModal }) => {
  const { totalFodmapLoad, contributingFodmaps } = useMemo(() => {
    let totalLoad = 0;
    const contributing = new Set<FodmapType>();

    meal.forEach(item => {
      const { food, currentAmount } = item;
      if (food.fodmaps.length > 0 && food.safeAmount > 0 && currentAmount > 0) {
        totalLoad += currentAmount / food.safeAmount;
        food.fodmaps.forEach(f => contributing.add(f.type));
      }
    });

    return { totalFodmapLoad: totalLoad, contributingFodmaps: Array.from(contributing) };
  }, [meal]);


  const totalCalories = useMemo(() => calculateMealCalories(meal), [meal]);

  const isMealEmpty = meal.length === 0;

  return (
    <div className="sticky top-8 bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Resumo da Refeição</h2>
        <button
          onClick={onClearMeal}
          disabled={isMealEmpty}
          className="text-sm font-medium text-emerald-600 hover:text-emerald-800 disabled:text-gray-400 disabled:cursor-not-allowed transition"
        >
          Limpar Refeição
        </button>
      </div>

      {isMealEmpty ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">O seu resumo FODMAP aparecerá aqui.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Este resumo calcula a carga FODMAP total da sua refeição. Uma carga combinada superior a 100% de vários alimentos (mesmo de grupos FODMAP diferentes) pode causar sintomas devido à "acumulação".</p>
          <div className="space-y-3 pt-2">
            {totalFodmapLoad > 0 ? (
              <div>
                <FodmapIndicator
                  name="Carga FODMAP Total da Refeição"
                  load={totalFodmapLoad}
                  warningThreshold={100}
                  dangerThreshold={150}
                />
                {contributingFodmaps.length > 0 && (
                   <div className="text-xs text-gray-600 mt-2">
                    <span className="font-semibold">FODMAPs presentes:</span> {contributingFodmaps.join(', ')}
                  </div>
                )}
              </div>
            ) : (
                <div className="text-center py-4">
                    <p className="text-green-700 font-medium">✅ Refeição baixa em FODMAPs nas quantidades selecionadas.</p>
                </div>
            )}
          </div>
        </div>
      )}

      {!isMealEmpty && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-700">Total de Calorias</h3>
            <p className="text-2xl font-bold text-emerald-600">{Math.round(totalCalories)} kcal</p>
          </div>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={onOpenSaveModal}
          disabled={isMealEmpty}
          className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Guardar no Plano
        </button>
      </div>

       <div className="mt-6 p-4 bg-emerald-50 border-l-4 border-emerald-400 rounded-r-lg">
          <h4 className="font-bold text-emerald-800">Lembrete Importante</h4>
          <p className="text-sm text-emerald-700 mt-1">
            As contagens de FODMAPs são reiniciadas entre as refeições. Garanta um intervalo de 2.5 a 3 horas para evitar a acumulação ao longo do dia.
          </p>
        </div>
    </div>
  );
};

export default MealSummary;