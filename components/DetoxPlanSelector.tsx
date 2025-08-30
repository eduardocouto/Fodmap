import React, { useState, useMemo } from 'react';
import { DETOX_RECIPES } from '../constants/detoxTemplates';
import type { MealTemplate } from '../types';

interface DetoxPlanSelectorProps {
  onSelectMeal: (template: MealTemplate) => void;
}

const DetoxPlanSelector: React.FC<DetoxPlanSelectorProps> = ({ onSelectMeal }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedMealId, setSelectedMealId] = useState<string>('');

  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    DETOX_RECIPES.forEach(meal => categorySet.add(meal.category));
    return Array.from(categorySet);
  }, []);

  const availableMeals = useMemo(() => {
    if (!selectedCategory) return [];
    return DETOX_RECIPES.filter(meal => meal.category === selectedCategory);
  }, [selectedCategory]);

  const handleAddMeal = () => {
    const selectedTemplate = DETOX_RECIPES.find(t => t.id === selectedMealId);
    if (selectedTemplate) {
      onSelectMeal(selectedTemplate);
      setSelectedCategory('');
      setSelectedMealId('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Sumos e Batidos Detox</h2>
      <p className="text-sm text-gray-600 mb-6">Escolha uma categoria e uma receita para carregar no construtor. Isto irá substituir os itens da sua refeição atual.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div className="sm:col-span-1">
          <label htmlFor="detox-category-select" className="block text-sm font-medium text-gray-700">
            1. Escolha a Categoria
          </label>
          <select
            id="detox-category-select"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedMealId('');
            }}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
          >
            <option value="" disabled>Selecione...</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-1">
           <label htmlFor="detox-meal-select" className="block text-sm font-medium text-gray-700">
            2. Escolha a Receita
          </label>
          <select
            id="detox-meal-select"
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
              Adicionar Receita
            </button>
        </div>
      </div>
      <div className="mt-4 p-3 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg text-sm text-amber-800">
        <strong>Atenção:</strong> Muitas destas receitas contêm ingredientes com alto teor de FODMAPs (ex: maçã, manga, pera). Ajuste as porções ou substitua ingredientes conforme a sua tolerância pessoal.
      </div>
    </div>
  );
};

export default DetoxPlanSelector;
