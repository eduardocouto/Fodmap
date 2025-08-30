
import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { MealItem, FoodItem } from '../types';

interface MealBuilderProps {
  foods: FoodItem[];
  meal: MealItem[];
  onAddFood: (food: FoodItem) => void;
  onRemoveFood: (instanceId: string) => void;
  onUpdateAmount: (instanceId: string, amount: number) => void;
  individualLoads: Record<string, number>;
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


const MealBuilder: React.FC<MealBuilderProps> = ({ foods, meal, onAddFood, onRemoveFood, onUpdateAmount, individualLoads }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [fodmapFilter, setFodmapFilter] = useState<'all' | 'low' | 'high'>('all');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const prevMealRef = useRef<MealItem[]>([]);

  useEffect(() => {
    // Check if an item was added by comparing array lengths
    if (meal.length > prevMealRef.current.length) {
      // Find the new item that is in `meal` but not in `prevMealRef.current`
      const currentIds = new Set(prevMealRef.current.map(i => i.instanceId));
      const newItem = meal.find(item => !currentIds.has(item.instanceId));

      if (newItem) {
        setRecentlyAddedId(newItem.instanceId);
        // Remove the highlight after the animation is complete
        const timer = setTimeout(() => {
          setRecentlyAddedId(null);
        }, 1500); // Duration should match the CSS animation
        return () => clearTimeout(timer);
      }
    }
    // Update the ref for the next render
    prevMealRef.current = meal;
  }, [meal]);


  const filteredFoods = useMemo(() => {
    const fodmapFiltered = foods.filter(food => {
      if (fodmapFilter === 'low') {
        return food.fodmaps.length === 0;
      }
      if (fodmapFilter === 'high') {
        return food.fodmaps.length > 0;
      }
      return true; // 'all'
    });

    const trimmedSearch = searchTerm.trim().toLowerCase();
    if (!trimmedSearch) {
      return [];
    }

    const results = fodmapFiltered.map(food => {
      const foodNameLower = food.name.toLowerCase();
      const distance = levenshtein(trimmedSearch, foodNameLower);
      
      // Normalize distance to a similarity score (1 is a perfect match)
      const similarity = 1 - (distance / Math.max(trimmedSearch.length, foodNameLower.length));

      // Give a massive boost to items that start with the search term for type-ahead
      const startsWithBonus = foodNameLower.startsWith(trimmedSearch) ? 1.0 : 0;
      
      // A smaller boost for items that include the search term
      const includesBonus = !startsWithBonus && foodNameLower.includes(trimmedSearch) ? 0.5 : 0;

      // Final score - higher is better
      const score = similarity + startsWithBonus + includesBonus;

      return { food, score };
    })
    .filter(item => item.score > 0.4) // Filter out very poor matches
    .sort((a, b) => b.score - a.score); // Sort descending by score

    return results.slice(0, 5).map(item => item.food); // Return top 5 results
  }, [searchTerm, fodmapFilter, foods]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">1. Procurar Alimento</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Pesquisar por um alimento (ex: 'banana')"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
          />
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-3.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>

        <fieldset className="mt-4">
          <legend className="text-sm font-medium text-gray-700 mb-2">Filtrar por conteúdo FODMAP:</legend>
          <div className="flex flex-wrap gap-2">
            <div>
              <input type="radio" id="filter-all" name="fodmap-filter" value="all" checked={fodmapFilter === 'all'} onChange={() => setFodmapFilter('all')} className="sr-only peer" />
              <label htmlFor="filter-all" className="px-3 py-1.5 text-sm rounded-md transition-colors font-medium cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300 peer-checked:bg-emerald-600 peer-checked:text-white peer-checked:shadow">Todos os Alimentos</label>
            </div>
            <div>
              <input type="radio" id="filter-low" name="fodmap-filter" value="low" checked={fodmapFilter === 'low'} onChange={() => setFodmapFilter('low')} className="sr-only peer" />
              <label htmlFor="filter-low" className="px-3 py-1.5 text-sm rounded-md transition-colors font-medium cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300 peer-checked:bg-emerald-600 peer-checked:text-white peer-checked:shadow">Apenas Baixo FODMAP</label>
            </div>
            <div>
              <input type="radio" id="filter-high" name="fodmap-filter" value="high" checked={fodmapFilter === 'high'} onChange={() => setFodmapFilter('high')} className="sr-only peer" />
              <label htmlFor="filter-high" className="px-3 py-1.5 text-sm rounded-md transition-colors font-medium cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300 peer-checked:bg-emerald-600 peer-checked:text-white peer-checked:shadow">Contém FODMAPs</label>
            </div>
          </div>
        </fieldset>

        {searchTerm && (
          <div className="mt-4 max-h-60 overflow-y-auto bg-gray-50 rounded-md">
            {filteredFoods.length > 0 ? (
              filteredFoods.map(food => (
                <div key={food.id} className="flex items-center justify-between p-3 border-b border-gray-200 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-800">{food.name}</p>
                    <p className="text-sm text-gray-500">{food.category}</p>
                  </div>
                  <button
                    onClick={() => onAddFood(food)}
                    className="bg-emerald-500 text-white px-3 py-1 rounded-md hover:bg-emerald-600 transition text-sm font-semibold"
                  >
                    Adicionar
                  </button>
                </div>
              ))
            ) : (
              <p className="p-3 text-center text-gray-500">Nenhum alimento encontrado.</p>
            )}
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">2. Itens da Refeição Atual</h2>
        <div className="space-y-4">
          {meal.length > 0 ? (
            meal.map(item => {
              const individualLoad = individualLoads[item.instanceId] || 0;
              let loadColor = 'text-emerald-700';
              if (individualLoad > 100) {
                loadColor = 'text-red-700';
              } else if (individualLoad > 75) {
                loadColor = 'text-yellow-700';
              }

              return (
                <div
                  key={item.instanceId}
                  className={`bg-gray-50 p-4 rounded-lg flex flex-col gap-3 transition-all duration-300 ${
                    item.instanceId === recentlyAddedId ? 'animate-highlight' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-800">{item.food.name}</p>
                      <p className="text-sm text-gray-500">Dose segura: {item.food.safeAmount} {item.food.unit}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={item.currentAmount}
                        onChange={(e) => onUpdateAmount(item.instanceId, parseInt(e.target.value, 10) || 0)}
                        className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-emerald-500 bg-white text-gray-800"
                      />
                      <span className="text-gray-600">{item.food.unit}</span>
                    </div>
                    <button
                      onClick={() => onRemoveFood(item.instanceId)}
                      className="text-red-500 hover:text-red-700 transition"
                      aria-label="Remove item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  {item.food.fodmaps.length > 0 && (
                    <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-3">
                      <div>
                        <span className="font-semibold text-gray-600">FODMAPs: </span>
                        {item.food.fodmaps.map((fodmap, index) => (
                          <span key={index} className="inline-block bg-gray-200 text-gray-700 text-xs font-medium mr-2 px-2 py-1 rounded-full">
                            {fodmap.type}{fodmap.group ? ` (${fodmap.group.split(' ')[0]})` : ''}
                          </span>
                        ))}
                      </div>
                      <div className={`font-bold ${loadColor}`}>
                        Carga: {Math.round(individualLoad)}%
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Pesquise por um alimento para começar a construir a sua refeição.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealBuilder;