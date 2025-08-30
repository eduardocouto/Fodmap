import React, { useState, useMemo } from 'react';
import { ANTI_INFLAMMATORY_PLAN } from '../constants/mealTemplates';
import type { MealTemplate } from '../types';

interface AntiInflammatoryPlanSelectorProps {
  onSelectMeal: (template: MealTemplate) => void;
}

const AntiInflammatoryPlanSelector: React.FC<AntiInflammatoryPlanSelectorProps> = ({ onSelectMeal }) => {
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedMealId, setSelectedMealId] = useState<string>('');

  const days = useMemo(() => {
    const daySet = new Set<string>();
    ANTI_INFLAMMATORY_PLAN.forEach(meal => {
      const dayMatch = meal.category.match(/Dia (\d+)/);
      if (dayMatch && dayMatch[1]) {
        daySet.add(dayMatch[1]);
      }
    });
    return Array.from(daySet).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  }, []);

  const availableMeals = useMemo(() => {
    if (!selectedDay) return [];
    const categoryName = `Plano AI - Dia ${selectedDay}`;
    return ANTI_INFLAMMATORY_PLAN.filter(meal => meal.category === categoryName);
  }, [selectedDay]);

  const handleAddMeal = () => {
    const selectedTemplate = ANTI_INFLAMMATORY_PLAN.find(t => t.id === selectedMealId);
    if (selectedTemplate) {
      onSelectMeal(selectedTemplate);
      setSelectedDay('');
      setSelectedMealId('');
    }
  };
  
  const mealDisplayName = (meal: MealTemplate) => {
    let mealType = '';
    if (meal.id.includes('pequeno-almoco')) mealType = 'Pequeno-almoço';
    else if (meal.id.includes('almoco')) mealType = 'Almoço';
    else if (meal.id.includes('jantar')) mealType = 'Jantar';
    else if (meal.id.includes('lanche')) mealType = 'Lanche';
    
    // Fallback for names that don't follow the pattern
    if(!mealType) {
        const mealNameLower = meal.name.toLowerCase();
        if(mealNameLower.includes('sopa')) mealType = "Sopa";
        else mealType = "Refeição";
    }

    return `${mealType}: ${meal.name}`;
  }


  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Plano Anti-Inflamatório (15 Dias)</h2>
      <p className="text-sm text-gray-600 mb-6">Selecione um dia e uma refeição do plano para carregar no construtor. Isto irá substituir os itens da sua refeição atual.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div className="sm:col-span-1">
          <label htmlFor="day-select" className="block text-sm font-medium text-gray-700">
            1. Escolha o Dia
          </label>
          <select
            id="day-select"
            value={selectedDay}
            onChange={(e) => {
              setSelectedDay(e.target.value);
              setSelectedMealId('');
            }}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
          >
            <option value="" disabled>Selecione...</option>
            {days.map(day => (
              <option key={day} value={day}>Dia {day}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-1">
           <label htmlFor="ai-meal-select" className="block text-sm font-medium text-gray-700">
            2. Escolha a Refeição
          </label>
          <select
            id="ai-meal-select"
            value={selectedMealId}
            onChange={(e) => setSelectedMealId(e.target.value)}
            disabled={!selectedDay}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md disabled:bg-gray-200"
          >
            <option value="" disabled>Selecione...</option>
            {availableMeals.map(template => (
              <option key={template.id} value={template.id}>{mealDisplayName(template)}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-1">
           <button
              onClick={handleAddMeal}
              disabled={!selectedMealId}
              className="w-full bg-emerald-500 text-white px-3 py-2 rounded-md hover:bg-emerald-600 transition text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Adicionar Refeição
            </button>
        </div>
      </div>
      <div className="mt-4 p-3 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg text-sm text-amber-800">
        <strong>Atenção:</strong> Este plano pode conter ingredientes com alto teor de FODMAPs (ex: trigo, cevada, cebola). Ajuste as porções ou substitua ingredientes conforme a sua tolerância pessoal.
      </div>
    </div>
  );
};

export default AntiInflammatoryPlanSelector;
