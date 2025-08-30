import React, { useState, useMemo } from 'react';
import { SOUP_RECIPES } from '../constants/soupTemplates';
import type { MealTemplate } from '../types';

interface SoupSelectorProps {
  onSelectMeal: (template: MealTemplate) => void;
}

const SoupSelector: React.FC<SoupSelectorProps> = ({ onSelectMeal }) => {
  const [selectedMealId, setSelectedMealId] = useState<string>('');

  const handleAddMeal = () => {
    const selectedTemplate = SOUP_RECIPES.find(t => t.id === selectedMealId);
    if (selectedTemplate) {
      onSelectMeal(selectedTemplate);
      setSelectedMealId('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Sopas Anti-inflamatórias</h2>
      <p className="text-sm text-gray-600 mb-6">Escolha uma receita de sopa para carregar no construtor. Isto irá substituir os itens da sua refeição atual.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div className="sm:col-span-1">
          <label htmlFor="soup-select" className="block text-sm font-medium text-gray-700">
            1. Escolha a Sopa
          </label>
          <select
            id="soup-select"
            value={selectedMealId}
            onChange={(e) => setSelectedMealId(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
          >
            <option value="" disabled>Selecione...</option>
            {SOUP_RECIPES.map(template => (
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
              Adicionar Sopa
            </button>
        </div>
      </div>
      <div className="mt-4 p-3 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg text-sm text-amber-800">
        <strong>Atenção:</strong> Algumas destas receitas contêm ingredientes com alto teor de FODMAPs (ex: cebola, alho-francês, maçã). Ajuste as porções ou substitua ingredientes conforme a sua tolerância pessoal.
      </div>
    </div>
  );
};

export default SoupSelector;
