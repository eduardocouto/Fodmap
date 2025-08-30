import React, { useState, useMemo } from 'react';
import type { WeeklyPlan, MealSlot, MealItem, FoodItem } from '../types';
import { MealSlot as MealSlotEnum } from '../types';
import EditMealModal from './EditMealModal';
import { calculateMealCalories } from '../utils/mealUtils';

interface WeeklyPlannerProps {
  plan: WeeklyPlan;
  onLoadMeal: (meal: MealItem[]) => void;
  onClearMealFromSlot: (day: string, slot: MealSlot) => void;
  onClearAll: () => void;
  calorieGoal: number;
  onSetCalorieGoal: (goal: number) => void;
  allFoods: FoodItem[];
  onUpdateMealInPlan: (day: string, slot: MealSlot, updatedMeal: MealItem[]) => void;
}

const DAYS_OF_WEEK = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
const MEAL_SLOTS = [MealSlotEnum.BREAKFAST, MealSlotEnum.LUNCH, MealSlotEnum.AFTERNOON_SNACK, MealSlotEnum.DINNER, MealSlotEnum.SNACKS];

type CalorieStatus = 'good' | 'warning' | 'high';

const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({ plan, onLoadMeal, onClearMealFromSlot, onClearAll, calorieGoal, onSetCalorieGoal, allFoods, onUpdateMealInPlan }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copiar para a Área de Transferência');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [mealToEdit, setMealToEdit] = useState<{day: string, slot: MealSlot, meal: MealItem[]} | null>(null);

  const isPlanEmpty = Object.keys(plan).length === 0;

  const handleOpenEditModal = (day: string, slot: MealSlot, meal: MealItem[]) => {
    setMealToEdit({ day, slot, meal });
    setIsEditModalOpen(true);
  };
  
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setMealToEdit(null);
  };

  const handleUpdateAndLoad = (day: string, slot: MealSlot, updatedMeal: MealItem[]) => {
    onUpdateMealInPlan(day, slot, updatedMeal);
    onLoadMeal(updatedMeal);
    handleCloseEditModal();
  };

  const handleLoadOnly = (meal: MealItem[]) => {
    onLoadMeal(meal);
    handleCloseEditModal();
  };


  const dailyTotals = useMemo(() => {
    const totals: { [day: string]: { calories: number; status: CalorieStatus } } = {};
    DAYS_OF_WEEK.forEach(day => {
      const dayPlan = plan[day];
      let totalCalories = 0;
      if (dayPlan) {
        MEAL_SLOTS.forEach(slot => {
          const meal = dayPlan[slot];
          if (meal) {
            totalCalories += calculateMealCalories(meal);
          }
        });
      }
      
      let status: CalorieStatus = 'good';
      if (calorieGoal > 0) {
        const percentage = (totalCalories / calorieGoal) * 100;
        if (percentage > 115) status = 'high';
        else if (percentage > 100) status = 'warning';
      }

      totals[day] = { calories: Math.round(totalCalories), status };
    });
    return totals;
  }, [plan, calorieGoal]);
  
  const generatePlainTextPlan = () => {
    let text = "O Meu Plano de Refeições Semanal\n================================\n\n";
    DAYS_OF_WEEK.forEach(day => {
      const dayPlan = plan[day];
      if (dayPlan && Object.keys(dayPlan).length > 0) {
        text += `${day.toUpperCase()} (${dailyTotals[day].calories} kcal no total)\n--------------------\n`;
        MEAL_SLOTS.forEach(slot => {
          const meal = dayPlan[slot];
          if (meal && meal.length > 0) {
            text += `  ${slot} (${Math.round(calculateMealCalories(meal))} kcal):\n`;
            meal.forEach(item => {
              text += `    - ${item.food.name} (${item.currentAmount}${item.food.unit})\n`;
            });
            text += '\n';
          }
        });
      }
    });
    return text.trim();
  };

  const handleCopyToClipboard = () => {
    const textToCopy = generatePlainTextPlan();
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopyButtonText('Copiado!');
      setTimeout(() => setCopyButtonText('Copiar para a Área de Transferência'), 2000);
    }).catch(err => {
      console.error('Failed to copy plan: ', err);
      setCopyButtonText('Erro!');
    });
  };

  const statusClasses: Record<CalorieStatus, string> = {
    good: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Planeador Semanal</h2>
          <p className="mt-2 text-gray-600">
            Organize as suas refeições para a semana. Guarde refeições do construtor e veja a sua semana de relance.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
           <button onClick={handleCopyToClipboard} disabled={isPlanEmpty} className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 transition-colors"> {copyButtonText} </button>
          <button onClick={onClearAll} disabled={isPlanEmpty} className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 disabled:bg-gray-300 transition-colors"> Limpar Semana </button>
        </div>
      </div>

       <div className="p-4 bg-gray-100 rounded-lg flex items-center gap-4">
        <label htmlFor="calorie-goal" className="font-semibold text-gray-700">Meta de Calorias Diária:</label>
        <input 
          id="calorie-goal"
          type="number"
          value={calorieGoal}
          onChange={(e) => onSetCalorieGoal(parseInt(e.target.value, 10) || 0)}
          className="w-32 px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col">
            <h3 className="text-lg font-bold text-center text-gray-700 mb-2 border-b pb-2">{day}</h3>
            <div className="text-center mb-3">
              <span className={`inline-block text-sm font-bold px-3 py-1 rounded-full ${statusClasses[dailyTotals[day].status]}`}>
                {dailyTotals[day].calories} / {calorieGoal} kcal
              </span>
            </div>
            <div className="space-y-1">
              {MEAL_SLOTS.map((slot, index) => {
                const meal = plan[day]?.[slot];
                return (
                  <React.Fragment key={slot}>
                    <div className="border-t pt-2 min-h-[60px]">
                      <h4 className="font-semibold text-emerald-700">{slot}</h4>
                      {meal && meal.length > 0 ? (
                        <div className="mt-2 text-sm space-y-2">
                          <ul className="list-disc list-inside text-gray-600 space-y-1">
                            {meal.map(item => (
                              <li key={item.instanceId}>{item.food.name} ({item.currentAmount}{item.food.unit})</li>
                            ))}
                          </ul>
                          <div className="flex space-x-2 mt-3">
                             <button onClick={() => handleOpenEditModal(day, slot, meal)} className="text-sm font-semibold bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-md hover:bg-emerald-200 transition"> Editar </button>
                            <button onClick={() => onClearMealFromSlot(day, slot)} className="text-sm font-semibold bg-red-100 text-red-800 px-3 py-1.5 rounded-md hover:bg-red-200 transition"> Limpar </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic mt-1">Vazio</p>
                      )}
                    </div>
                    {index < MEAL_SLOTS.length - 1 && (
                      <div className="flex items-center justify-center my-1 text-xs text-gray-400 py-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>Intervalo 2.5-3h</span>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <EditMealModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        mealData={mealToEdit}
        allFoods={allFoods}
        onUpdateAndLoad={handleUpdateAndLoad}
        onLoadOnly={handleLoadOnly}
      />
    </div>
  );
};

export default WeeklyPlanner;