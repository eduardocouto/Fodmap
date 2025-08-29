
import React, { useState, useMemo } from 'react';
import { MEAL_TEMPLATES } from '../constants/mealTemplates';
import type { MealTemplate } from '../types';

interface QuickMealSelectorProps {
  onSelectMeal: (template: MealTemplate) => void;
}

interface GroupedMeals {
  [category: string]: MealTemplate[];
}

const QuickMealSelector: React.FC<QuickMealSelectorProps> = ({ onSelectMeal }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedMealId, setSelectedMealId] = useState<string>('');

  const groupedMeals = useMemo(() => {
    return MEAL_TEMPLATES.reduce((acc, template) => {
      const category = template.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(template);
      return acc;
    }, {} as GroupedMeals);
  }, []);

  const availableCategories = Object.keys(groupedMeals).sort();
  const availableMeals = selectedCategory ? groupedMeals[selectedCategory] : [];

  const handleAddMeal = () => {
    const selectedTemplate = MEAL_TEMPLATES.find(t => t.id === selectedMealId);
    if (selectedTemplate) {
      onSelectMeal(selectedTemplate);
      setSelectedCategory('');
      setSelectedMealId('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Refeições Rápidas</h2>
      <p className="text-sm text-gray-600 mb-6">Escolha um modelo a partir das categorias para começar. Isto irá substituir os itens da sua refeição atual.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div className="sm:col-span-1">
          <label htmlFor="category-select" className="block text-sm font-medium text-gray-700">
            1. Escolha a Categoria
          </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedMealId('');
            }}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
          >
            <option value="" disabled>Selecione...</option>
            {availableCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-1">
           <label htmlFor="meal-select" className="block text-sm font-medium text-gray-700">
            2. Escolha a Refeição
          </label>
          <select
            id="meal-select"
            value={selectedMealId}
            onChange={(e) => setSelectedMealId(e.target.value)}
            disabled={!selectedCategory}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md disabled:bg-gray-200"
          >
            <option value="" disabled>Selecione...</option>
            {availableMeals.map(template => (
              <option key={template.id} value={template.id}>{template.name}</option>
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
    </div>
  );
};

export default QuickMealSelector;