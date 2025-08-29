import React, { useState, useEffect, useMemo } from 'react';
import type { MealItem, MealSlot, FoodItem } from '../types';

interface EditMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealData: { day: string; slot: MealSlot; meal: MealItem[] } | null;
  allFoods: FoodItem[];
  onUpdateAndLoad: (day: string, slot: MealSlot, updatedMeal: MealItem[]) => void;
  onLoadOnly: (meal: MealItem[]) => void;
}


// Levenshtein distance function for fuzzy matching
const levenshtein = (a: string, b: string): number => {
  const an = a.length;
  const bn = b.length;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = Array.from({ length: an + 1 }, () => Array(bn + 1).fill(0));

  for (let i = 0; i <= an; i++) matrix[i][0] = i;
  for (let j = 0; j <= bn; j++) matrix[0][j] = j;

  for (let i = 1; i <= an; i++) {
    for (let j = 1; j <= bn; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return matrix[an][bn];
};


const EditMealModal: React.FC<EditMealModalProps> = ({ isOpen, onClose, mealData, allFoods, onUpdateAndLoad, onLoadOnly }) => {
    const [editedMeal, setEditedMeal] = useState<MealItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [fodmapFilter, setFodmapFilter] = useState<'all' | 'low' | 'high'>('all');

    useEffect(() => {
        if (mealData) {
            // Create a deep copy to avoid mutating the original plan
            setEditedMeal(JSON.parse(JSON.stringify(mealData.meal)));
        }
    }, [mealData]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    const filteredFoods = useMemo(() => {
        const fodmapFiltered = allFoods.filter(food => {
            if (fodmapFilter === 'low') return food.fodmaps.length === 0;
            if (fodmapFilter === 'high') return food.fodmaps.length > 0;
            return true;
        });

        const trimmedSearch = searchTerm.trim().toLowerCase();
        if (!trimmedSearch) return [];

        return fodmapFiltered.map(food => {
                const foodNameLower = food.name.toLowerCase();
                const distance = levenshtein(trimmedSearch, foodNameLower);
                const similarity = 1 - (distance / Math.max(trimmedSearch.length, foodNameLower.length));
                const startsWithBonus = foodNameLower.startsWith(trimmedSearch) ? 1.0 : 0;
                const includesBonus = !startsWithBonus && foodNameLower.includes(trimmedSearch) ? 0.5 : 0;
                return { food, score: similarity + startsWithBonus + includesBonus };
            })
            .filter(item => item.score > 0.4)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5) // Limit to 5 results for a smaller modal view
            .map(item => item.food);
    }, [searchTerm, fodmapFilter, allFoods]);

    const addFoodToMeal = (food: FoodItem) => {
        const newMealItem: MealItem = {
            instanceId: crypto.randomUUID(),
            food: food,
            currentAmount: food.safeAmount > 0 ? food.safeAmount : (food.unit.includes('unidade') ? 1 : 100),
        };
        setEditedMeal(prev => [...prev, newMealItem]);
        setSearchTerm('');
    };

    const removeFoodFromMeal = (instanceId: string) => {
        setEditedMeal(prev => prev.filter(item => item.instanceId !== instanceId));
    };

    const updateFoodAmount = (instanceId: string, amount: number) => {
        setEditedMeal(prev => prev.map(item => item.instanceId === instanceId ? { ...item, currentAmount: amount } : item));
    };

    if (!isOpen || !mealData) return null;

    const { day, slot } = mealData;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
            aria-modal="true"
            role="dialog"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 className="text-xl font-semibold text-gray-800">Editar Refeição: <span className="text-emerald-600">{slot} - {day}</span></h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Fechar modal">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="space-y-6 overflow-y-auto pr-2 flex-grow">
                    {/* Meal Items */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-700">Itens Atuais</h3>
                         {editedMeal.length > 0 ? editedMeal.map(item => (
                            <div key={item.instanceId} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between gap-3">
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-800">{item.food.name}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="number" value={item.currentAmount} onChange={e => updateFoodAmount(item.instanceId, parseInt(e.target.value, 10) || 0)} className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-emerald-500 bg-white text-gray-800"/>
                                    <span className="text-gray-600 text-sm">{item.food.unit}</span>
                                </div>
                                <button onClick={() => removeFoodFromMeal(item.instanceId)} className="text-red-500 hover:text-red-700 transition" aria-label={`Remover ${item.food.name}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        )) : <p className="text-gray-500 text-sm italic">Esta refeição está vazia.</p>}
                    </div>

                    {/* Add Food Section */}
                    <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Adicionar Alimento</h3>
                         <div className="relative">
                            <input type="text" placeholder="Pesquisar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-emerald-500"/>
                        </div>
                        {searchTerm && (
                            <div className="mt-2 max-h-48 overflow-y-auto bg-gray-50 rounded-md border">
                                {filteredFoods.length > 0 ? filteredFoods.map(food => (
                                    <div key={food.id} className="flex items-center justify-between p-2 border-b last:border-b-0">
                                        <p className="font-medium text-gray-800 text-sm">{food.name}</p>
                                        <button onClick={() => addFoodToMeal(food)} className="bg-emerald-500 text-white px-3 py-1 rounded-md hover:bg-emerald-600 transition text-xs font-semibold">Adicionar</button>
                                    </div>
                                )) : <p className="p-3 text-center text-gray-500 text-sm">Nenhum alimento encontrado.</p>}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 flex-shrink-0">
                    <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">Cancelar</button>
                        <button type="button" onClick={() => onLoadOnly(editedMeal)} className="px-4 py-2 bg-blue-100 text-blue-800 font-semibold rounded-md hover:bg-blue-200 transition-colors" title="Carrega a refeição para o construtor sem alterar o plano semanal.">Carregar (sem guardar)</button>
                        <button type="button" onClick={() => onUpdateAndLoad(day, slot, editedMeal)} className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-700 disabled:bg-gray-400 transition-colors" title="Atualiza o plano semanal E carrega a refeição para o construtor.">Guardar Alterações e Carregar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditMealModal;