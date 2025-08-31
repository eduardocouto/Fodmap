
import React from 'react';
import type { DayPlan, MealSlot, MealItem } from '../types';
import { MealSlot as MealSlotEnum } from '../types';
import { calculateMealCalories } from '../utils/mealUtils';

const MEAL_SLOTS = [MealSlotEnum.BREAKFAST, MealSlotEnum.LUNCH, MealSlotEnum.AFTERNOON_SNACK, MealSlotEnum.DINNER, MealSlotEnum.SNACKS];

interface DayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: string | null;
  dayPlan: DayPlan | undefined;
  onEditMeal: (day: string, slot: MealSlot, meal: MealItem[]) => void;
  onClearMeal: (day: string, slot: MealSlot) => void;
}

const DayDetailModal: React.FC<DayDetailModalProps> = ({ isOpen, onClose, day, dayPlan, onEditMeal, onClearMeal }) => {
  if (!isOpen || !day) return null;

  const totalCalories = MEAL_SLOTS.reduce((total, slot) => {
    const meal = dayPlan?.[slot];
    return total + (meal ? calculateMealCalories(meal) : 0);
  }, 0);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 transition-opacity duration-300"
      aria-modal="true" role="dialog" onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{day}</h2>
            <p className="text-lg font-semibold text-emerald-600">{Math.round(totalCalories)} kcal</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Fechar modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto pr-2 flex-grow">
          {MEAL_SLOTS.map(slot => {
            const meal = dayPlan?.[slot];
            return (
              <div key={slot} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-emerald-700 text-lg mb-2">{slot}</h3>
                {meal && meal.length > 0 ? (
                  <div className="space-y-2">
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {meal.map(item => (
                        <li key={item.instanceId}>{item.food.name} ({item.currentAmount}{item.food.unit})</li>
                      ))}
                    </ul>
                    <div className="flex space-x-2 pt-2">
                      <button onClick={() => onEditMeal(day, slot, meal)} className="text-sm font-semibold bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-md hover:bg-emerald-200 transition">Editar</button>
                      <button onClick={() => onClearMeal(day, slot)} className="text-sm font-semibold bg-red-100 text-red-800 px-3 py-1.5 rounded-md hover:bg-red-200 transition">Limpar</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">Nenhuma refeição planeada.</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DayDetailModal;
