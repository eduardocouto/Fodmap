
import React, { useState, useMemo } from 'react';
import type { WeeklyPlan, MealSlot, MealItem, FoodItem } from '../types';
import { MealSlot as MealSlotEnum } from '../types';
import EditMealModal from './EditMealModal';
import DayDetailModal from './DayDetailModal';
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

const MealSlotIcon: React.FC<{ slot: MealSlot; filled: boolean }> = ({ slot, filled }) => {
    const icons: Record<MealSlot, React.ReactNode> = {
      [MealSlotEnum.BREAKFAST]: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
      [MealSlotEnum.LUNCH]: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.464A1 1 0 106.465 13.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1-1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16a1 1 0 11-2 0v-1a1 1 0 112 0v1z" /></svg>,
      [MealSlotEnum.DINNER]: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>,
      [MealSlotEnum.AFTERNOON_SNACK]: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>,
      [MealSlotEnum.SNACKS]: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 5h10v10H5V5z" /></svg>
    };
  
    return (
      <div className={`flex items-center gap-2 transition-colors ${filled ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
        <div className={`flex-shrink-0 w-4 h-4 ${filled ? 'text-emerald-600' : 'text-gray-400'}`}>
         {icons[slot]}
        </div>
        <span className="text-xs">{slot}</span>
      </div>
    );
  };

const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({ plan, onLoadMeal, onClearMealFromSlot, onClearAll, calorieGoal, onSetCalorieGoal, allFoods, onUpdateMealInPlan }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copiar para a Área de Transferência');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [mealToEdit, setMealToEdit] = useState<{day: string, slot: MealSlot, meal: MealItem[]} | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

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
            Organize as suas refeições para a semana. Clique num dia para ver e editar os detalhes.
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
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200 flex flex-col text-left hover:border-emerald-500 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
            aria-label={`Ver detalhes de ${day}`}
          >
            <h3 className="text-lg font-bold text-center text-gray-700 mb-2 border-b pb-2">{day}</h3>
            <div className="text-center mb-3">
              <span className={`inline-block text-xs font-bold px-2 py-1 rounded-full ${statusClasses[dailyTotals[day].status]}`}>
                {dailyTotals[day].calories} / {calorieGoal} kcal
              </span>
            </div>
            <div className="space-y-2 flex-grow mt-2">
              {MEAL_SLOTS.map(slot => (
                <MealSlotIcon key={slot} slot={slot} filled={!!plan[day]?.[slot] && plan[day]![slot]!.length > 0} />
              ))}
            </div>
          </button>
        ))}
      </div>

      <DayDetailModal
        isOpen={selectedDay !== null}
        onClose={() => setSelectedDay(null)}
        day={selectedDay}
        dayPlan={selectedDay ? plan[selectedDay] : undefined}
        onEditMeal={handleOpenEditModal}
        onClearMeal={onClearMealFromSlot}
      />
      
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
