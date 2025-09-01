


import React, { useState, useMemo } from 'react';
import type { AppData, MealItem, FoodItem, MealTemplate, WeeklyPlan, DayPlan, MealSlot, ShuffleOption, FoodFodmapInfo, FoodPreferences, PlannerSubTab, PlanTab, HistoricalMeal } from '../types';
import { MealSlot as MealSlotEnum, FodmapType, FructanGroup } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

import MealBuilder from './MealBuilder';
import MealSummary from './MealSummary';
import QuickMealSelector from './QuickMealSelector';
import MealShuffler from './MealShuffler';
import SaveToPlanModal from './SaveToPlanModal';
import { calculateFodmapLoads, calculateMealCalories } from '../utils/mealUtils';

import AntiInflammatoryPlanSelector from './AntiInflammatoryPlanSelector';
import DetoxPlanSelector from './DetoxPlanSelector';
import SoupSelector from './SoupSelector';
import PlanGenerator from './PlanGenerator';
import WeeklyPlanner from './WeeklyPlanner';
import ShoppingList from './ShoppingList';
import ForbiddenFoods from './ForbiddenFoods';
import MealHistory from './MealHistory';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const CustomFoodManager: React.FC<{
  customFoods: FoodItem[];
  onAddFood: (food: FoodItem) => void;
  onDeleteFood: (foodId: string) => void;
}> = ({ customFoods, onAddFood, onDeleteFood }) => {
  const [newFood, setNewFood] = useState<Omit<FoodItem, 'id'>>({
    name: '', category: '', calories: 0, safeAmount: 0, unit: 'g', fodmaps: [], notes: ''
  });
  const [selectedFodmaps, setSelectedFodmaps] = useState<Set<FodmapType>>(new Set());
  const [fructanGroup, setFructanGroup] = useState<FructanGroup | ''>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumeric = ['calories', 'safeAmount'].includes(name);
    setNewFood({ ...newFood, [name]: isNumeric ? parseInt(value, 10) || 0 : value });
  };
  
  const handleFodmapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const fodmapType = value as FodmapType;
    const newSelected = new Set(selectedFodmaps);
    if (checked) {
      newSelected.add(fodmapType);
    } else {
      newSelected.delete(fodmapType);
      if (fodmapType === FodmapType.FRUCTANS) {
        setFructanGroup('');
      }
    }
    setSelectedFodmaps(newSelected);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFood.name || !newFood.category || !newFood.unit) {
      alert("Por favor, preencha o nome, categoria e unidade.");
      return;
    }
    const fodmaps: FoodFodmapInfo[] = Array.from(selectedFodmaps).map(type => {
      const info: FoodFodmapInfo = { type };
      if (type === FodmapType.FRUCTANS && fructanGroup) {
        info.group = fructanGroup;
      }
      return info;
    });

    onAddFood({ ...newFood, id: `custom-${crypto.randomUUID()}`, fodmaps });
    
    // Reset form
    setNewFood({ name: '', category: '', calories: 0, safeAmount: 0, unit: 'g', fodmaps: [], notes: '' });
    setSelectedFodmaps(new Set());
    setFructanGroup('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Adicionar Novo Alimento</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" value={newFood.name} onChange={handleInputChange} placeholder="Nome do Alimento" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-emerald-500" required />
            <input name="category" value={newFood.category} onChange={handleInputChange} placeholder="Categoria (ex: Fruta)" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-emerald-500" required />
            <div className="grid grid-cols-2 gap-4">
              <input name="calories" type="number" value={newFood.calories} onChange={handleInputChange} placeholder="Calorias (por 100g/unid)" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-emerald-500" />
              <input name="safeAmount" type="number" value={newFood.safeAmount} onChange={handleInputChange} placeholder="Dose Segura" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-emerald-500" />
              <input name="unit" value={newFood.unit} onChange={handleInputChange} placeholder="Unidade (g, ml, unid)" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-emerald-500" required />
            </div>
            <fieldset>
              <legend className="text-sm font-medium text-gray-700 mb-2">FODMAPs (se aplicável):</legend>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {Object.values(FodmapType).map(type => (
                  <label key={type} className="flex items-center space-x-2 text-sm text-gray-700">
                    <input type="checkbox" value={type} checked={selectedFodmaps.has(type)} onChange={handleFodmapChange} className="form-checkbox h-4 w-4 text-emerald-600 rounded border-gray-300 bg-gray-100 focus:ring-emerald-500" />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
              {selectedFodmaps.has(FodmapType.FRUCTANS) && (
                 <select name="fructanGroup" value={fructanGroup} onChange={(e) => setFructanGroup(e.target.value as FructanGroup)} className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-emerald-500">
                  <option value="">Selecione o Grupo de Frutanos</option>
                  {Object.values(FructanGroup).map(group => <option key={group} value={group}>{group}</option>)}
                </select>
              )}
            </fieldset>
             <textarea name="notes" value={newFood.notes} onChange={handleInputChange} placeholder="Notas Adicionais" rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-emerald-500"></textarea>
            <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors">Adicionar Alimento</button>
          </form>
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Meus Alimentos</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {customFoods.length > 0 ? customFoods.map(food => (
              <div key={food.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{food.name}</p>
                  <p className="text-sm text-gray-500">{food.category}</p>
                </div>
                <button onClick={() => onDeleteFood(food.id)} className="text-red-500 hover:text-red-700 transition" aria-label={`Remover ${food.name}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            )) : <p className="text-gray-500">Ainda não adicionou alimentos.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};


interface FoodPlannerProps {
    appData: AppData;
    updateAppData: (updates: Partial<AppData>) => void;
    meal: MealItem[];
    setMeal: React.Dispatch<React.SetStateAction<MealItem[]>>;
    showToast: (message: string, actionLabel?: string, onAction?: () => void) => void;
    combinedFoods: FoodItem[];
}

const FoodPlanner: React.FC<FoodPlannerProps> = ({ appData, updateAppData, meal, setMeal, showToast, combinedFoods }) => {
    const [activeSubTab, setActiveSubTab] = useState<PlannerSubTab>('builder');
    const [activePlanTab, setActivePlanTab] = useState<PlanTab>('anti-inflammatory');
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    
    const { weeklyPlan, customFoods, dailyCalorieGoal, foodPreferences, mealHistory, basalMetabolicRate } = appData;

    const mealAnalysis = useMemo(() => {
        const { fodmapLoads, individualLoads } = calculateFodmapLoads(meal);
        const totalCalories = calculateMealCalories(meal);
        return { fodmapLoads, individualLoads, totalCalories };
    }, [meal]);
      
    const addCustomFood = (food: FoodItem) => updateAppData({ customFoods: [...customFoods, food] });

    const deleteCustomFood = (foodId: string) => {
        if(window.confirm("Tem a certeza que quer remover este alimento?")) {
        updateAppData({ customFoods: customFoods.filter(f => f.id !== foodId) });
        }
    };

    const addFoodToMeal = (food: FoodItem) => {
        const newMealItem: MealItem = {
        instanceId: crypto.randomUUID(),
        food: food,
        currentAmount: food.safeAmount > 0 ? food.safeAmount : (food.unit.includes('unidade') ? 1 : 100),
        };
        setMeal(prevMeal => [...prevMeal, newMealItem]);
    };

    const removeFoodFromMeal = (instanceId: string) => {
        setMeal(prevMeal => prevMeal.filter(item => item.instanceId !== instanceId));
    };

    const updateFoodAmount = (instanceId: string, amount: number) => {
        setMeal(prevMeal =>
        prevMeal.map(item =>
            item.instanceId === instanceId ? { ...item, currentAmount: amount } : item
        )
        );
    };

    const clearMeal = () => setMeal([]);

    const addQuickMeal = (template: MealTemplate) => {
        const newMealItems: MealItem[] = template.items.map((templateItem): MealItem | null => {
        const food = combinedFoods.find(f => f.id === templateItem.foodId);
        if (!food) {
            console.error(`Food with id ${templateItem.foodId} not found.`);
            return null;
        }
        return {
            instanceId: crypto.randomUUID(),
            food: food,
            currentAmount: templateItem.amount,
        };
        }).filter((item): item is MealItem => item !== null);
        setMeal(newMealItems);
    };
    
    const handleSelectGuidedMeal = (template: MealTemplate) => {
        addQuickMeal(template);
        setActiveSubTab('builder');
        showToast('Refeição carregada! Analise os FODMAPs.');
    };

    const shuffleMeal = (slot: ShuffleOption) => {
        let mealWorthyCategories: Set<string>;
        let itemCount: { min: number, max: number };

        switch (slot) {
        case MealSlotEnum.BREAKFAST: mealWorthyCategories = new Set(['Proteína', 'Fruta', 'Cereais', 'Laticínios', 'Sementes', 'Pastas']); itemCount = { min: 2, max: 4 }; break;
        case MealSlotEnum.LUNCH:
        case MealSlotEnum.DINNER: mealWorthyCategories = new Set(['Proteína', 'Legumes', 'Cereais', 'Leguminosas', 'Substitutos vegetarianos']); itemCount = { min: 3, max: 4 }; break;
        case MealSlotEnum.SNACKS:
        case MealSlotEnum.AFTERNOON_SNACK: mealWorthyCategories = new Set(['Fruta', 'Frutos Oleaginosos', 'Sementes', 'Cereais', 'Laticínios', 'Doces']); itemCount = { min: 1, max: 2 }; break;
        default: mealWorthyCategories = new Set(['Proteína', 'Fruta', 'Legumes', 'Cereais']); itemCount = { min: 3, max: 4 };
        }

        const eligibleFoods = combinedFoods.filter(food => mealWorthyCategories.has(food.category));
        const shuffled = eligibleFoods.sort(() => 0.5 - Math.random());
        const numberOfItems = Math.floor(Math.random() * (itemCount.max - itemCount.min + 1)) + itemCount.min;
        const selectedFoods = shuffled.slice(0, numberOfItems);

        const newMealItems: MealItem[] = selectedFoods.map(food => ({
        instanceId: crypto.randomUUID(),
        food: food,
        currentAmount: food.safeAmount > 0 ? food.safeAmount : (food.unit.includes('unidade') ? 1 : 100),
        }));
        setMeal(newMealItems);
    };


    const saveMealToPlan = (days: string[], slot: MealSlot) => {
        const newPlan = { ...weeklyPlan };
        days.forEach(day => {
            newPlan[day] = { ...newPlan[day], [slot]: meal };
        });

        // Generate a name for the historical meal
        const generateMealName = (mealItems: MealItem[]): string => {
            if (mealItems.length === 0) return "Refeição Vazia";
            const names = mealItems.slice(0, 3).map(item => item.food.name).join(', ');
            return mealItems.length > 3 ? `${names}...` : names;
        };

        // Create new historical meal entry if meal is not empty
        if (meal.length > 0) {
            const newHistoricalMeal: HistoricalMeal = {
                id: crypto.randomUUID(),
                name: generateMealName(meal),
                createdAt: new Date().toISOString(),
                meal: meal,
            };
    
            // Add to history, keeping only the last 15 entries
            const updatedHistory = [newHistoricalMeal, ...(mealHistory || [])].slice(0, 15);
            updateAppData({ weeklyPlan: newPlan, mealHistory: updatedHistory });
        } else {
            updateAppData({ weeklyPlan: newPlan });
        }

        setIsSaveModalOpen(false);
        showToast('Refeição guardada com sucesso!', 'Ver Plano', () => setActiveSubTab('weekly'));
    };
    
    const handleLoadMealFromHistory = (historicalMeal: HistoricalMeal) => {
        // Important: Create new instanceIds to avoid key collisions and other state issues
        const newMealItems = historicalMeal.meal.map(item => ({
            ...item,
            instanceId: crypto.randomUUID(),
        }));
        setMeal(newMealItems);
        showToast(`Refeição "${historicalMeal.name}" carregada.`);
    };

    const handleDeleteMealFromHistory = (mealId: string) => {
        if (window.confirm("Tem a certeza que quer remover esta refeição do seu histórico?")) {
            const updatedHistory = (mealHistory || []).filter(item => item.id !== mealId);
            updateAppData({ mealHistory: updatedHistory });
            showToast("Refeição removida do histórico.");
        }
    };


    const loadMealFromPlan = (mealToLoad: MealItem[]) => {
        setMeal(mealToLoad);
        setActiveSubTab('builder');
    };

    const clearMealFromPlan = (day: string, slot: MealSlot) => {
        const newPlan = { ...weeklyPlan };
        if (!newPlan[day]?.[slot]) return;
        const { [slot]: _, ...updatedDayPlan } = newPlan[day];
        if (Object.keys(updatedDayPlan).length === 0) {
        delete newPlan[day];
        } else {
        newPlan[day] = updatedDayPlan;
        }
        updateAppData({ weeklyPlan: newPlan });
    };

    const clearWeeklyPlan = () => {
        if (window.confirm('Tem a certeza que quer limpar todo o plano semanal? Esta ação não pode ser desfeita.')) {
        updateAppData({ weeklyPlan: {} });
        }
    };

    const updateMealInPlan = (day: string, slot: MealSlot, updatedMeal: MealItem[]) => {
        const newPlan = { ...weeklyPlan };
        const dayPlan = { ...newPlan[day] };
        dayPlan[slot] = updatedMeal;
        newPlan[day] = dayPlan;
        updateAppData({ weeklyPlan: newPlan });
        showToast('Refeição atualizada no plano!');
    };
    
    const generateWeeklyPlan = async () => {
        setIsGenerating(true);
        try {
            const foodListForPrompt = combinedFoods.map(f => ({ 
                id: f.id, 
                name: f.name, 
                category: f.category,
                calories: f.calories, 
                unit: f.unit, 
                fodmaps: f.fodmaps.map(fm => fm.type),
                safeAmount: f.safeAmount 
            }));

            const preferencesForPrompt = Object.entries(foodPreferences)
                .map(([slot, foodIds]) => {
                    const foodNames = foodIds.map(id => combinedFoods.find(f => f.id === id)?.name).filter(Boolean);
                    if (foodNames.length > 0) {
                        return `${slot}: ${foodNames.join(', ')}`;
                    }
                    return null;
                })
                .filter(Boolean)
                .join('\n');

            const prompt = `
                Como um nutricionista especialista em dietas low-FODMAP, crie um plano de refeições variado para 7 dias para um utilizador.

                **A REGRA MAIS IMPORTANTE E OBRIGATÓRIA:**
                Cada Almoço e cada Jantar DEVE OBRIGATORIAMENTE conter pelo menos uma fonte de proteína, uma fonte de hidratos de carbono (da categoria 'Cereais') e uma fonte de vegetais (da categoria 'Legumes'). A falha em cumprir esta regra para CADA refeição principal resultará num plano inválido. Esta regra tem prioridade sobre todas as outras.

                OUTRAS REGRAS A SEGUIR:
                1.  **Objetivo Calórico:** O plano diário deve ter como alvo aproximadamente ${basalMetabolicRate || 1800} kcal.
                2.  **Preferências:** Use os alimentos preferidos do utilizador como base para as refeições. Preferências do utilizador:
                    ${preferencesForPrompt || 'Nenhuma preferência específica fornecida. Crie um plano equilibrado e variado.'}
                3.  **Lógica das Outras Refeições:** Crie refeições convencionais e lógicas (ex: sem sopa ao pequeno-almoço). Para Pequeno-almoço e Lanches, crie combinações equilibradas.
                4.  **Variedade:** Evite repetir as mesmas refeições todos os dias.
                5.  **Segurança FODMAP:** Para alimentos com FODMAPs, use apenas as quantidades seguras (safeAmount) da lista de alimentos.
                6.  **Formato de Saída:** Responda APENAS com o objeto JSON, seguindo estritamente o schema fornecido.

                Lista de Alimentos Disponíveis (com id, nome, categoria, calorias, unidade, fodmaps e dose segura):
                ${JSON.stringify(foodListForPrompt, null, 2)}
            `;

            const mealItemSchema = {
                type: Type.OBJECT,
                properties: {
                    foodId: { type: Type.STRING, description: "O ID do alimento da lista fornecida." },
                    amount: { type: Type.NUMBER, description: "A quantidade do alimento, na unidade especificada." },
                },
                required: ['foodId', 'amount']
            };

            const mealSchema = { type: Type.ARRAY, items: mealItemSchema };

            const dayPlanSchemaProperties: Record<string, object> = {};
            [MealSlotEnum.BREAKFAST, MealSlotEnum.LUNCH, MealSlotEnum.DINNER, MealSlotEnum.SNACKS, MealSlotEnum.AFTERNOON_SNACK].forEach(slot => {
                dayPlanSchemaProperties[slot] = mealSchema;
            });

            const dayPlanSchema = { type: Type.OBJECT, properties: dayPlanSchemaProperties };
            
            const weeklyPlanSchemaProperties: Record<string, object> = {};
            ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'].forEach(day => {
                weeklyPlanSchemaProperties[day] = dayPlanSchema;
            });
            
            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    plan: {
                        type: Type.OBJECT,
                        properties: weeklyPlanSchemaProperties
                    }
                },
                required: ['plan']
            };
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json", responseSchema },
            });

            const aiPlan = JSON.parse(response.text)?.plan;
            if (!aiPlan) {
                throw new Error("A IA não conseguiu gerar um plano com as opções selecionadas. Por favor, selecione mais alimentos, especialmente das categorias Proteína, Cereais e Legumes.");
            }
            
            const newWeeklyPlan: WeeklyPlan = {};

            for (const day in aiPlan) {
                newWeeklyPlan[day] = {};
                for (const slot in aiPlan[day]) {
                    const mealItemsFromAI = aiPlan[day][slot];
                    if (mealItemsFromAI && Array.isArray(mealItemsFromAI) && mealItemsFromAI.length > 0) {
                        const mealItems: MealItem[] = mealItemsFromAI.map((item: { foodId: string; amount: number; }): MealItem | null => {
                            const food = combinedFoods.find(f => f.id === item.foodId);
                            if (!food) {
                                console.warn(`AI generated a meal with an unknown foodId: ${item.foodId}`);
                                return null;
                            };
                            return {
                                instanceId: crypto.randomUUID(),
                                food: food,
                                currentAmount: item.amount,
                            };
                        }).filter((item): item is MealItem => item !== null);
                        
                        if (mealItems.length > 0) {
                            newWeeklyPlan[day][slot as MealSlot] = mealItems;
                        }
                    }
                }
            }

            updateAppData({ weeklyPlan: newWeeklyPlan });
            showToast("Plano semanal gerado com sucesso!", "Ver Plano", () => setActiveSubTab('weekly'));

        } catch (error) {
            console.error("Error generating weekly plan:", error);
            const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro ao gerar o plano. Tente novamente ou ajuste as suas preferências.";
            showToast(errorMessage, "Tentar de Novo", generateWeeklyPlan);
        } finally {
            setIsGenerating(false);
        }
    };
    
    const getSubTabClassName = (tabName: PlannerSubTab) => {
        const base = 'flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500';
        if (activeSubTab === tabName) {
            return `${base} bg-emerald-100 text-emerald-700 shadow-sm`;
        }
        return `${base} bg-transparent text-gray-500 hover:bg-emerald-50 hover:text-emerald-700`;
    };

    const getPlanTabClassName = (planTabName: PlanTab) => {
        const base = 'px-4 py-2 text-sm font-semibold rounded-md transition-colors';
        if (activePlanTab === planTabName) {
          return `${base} bg-emerald-600 text-white`;
        }
        return `${base} bg-gray-100 text-gray-700 hover:bg-gray-200`;
      };


    return (
        <div className="space-y-8">
            <nav className="bg-white p-2 rounded-lg shadow-md max-w-6xl mx-auto">
                <div className="flex flex-wrap justify-center gap-1">
                    <button onClick={() => setActiveSubTab('builder')} className={getSubTabClassName('builder')}>Construtor</button>
                    <button onClick={() => setActiveSubTab('guidedPlans')} className={getSubTabClassName('guidedPlans')}>Planos Guiados</button>
                    <button onClick={() => setActiveSubTab('generator')} className={getSubTabClassName('generator')}>Gerador</button>
                    <button onClick={() => setActiveSubTab('weekly')} className={getSubTabClassName('weekly')}>Plano Semanal</button>
                    <button onClick={() => setActiveSubTab('shopping')} className={getSubTabClassName('shopping')}>Lista de Compras</button>
                    <button onClick={() => setActiveSubTab('customFood')} className={getSubTabClassName('customFood')}>Meus Alimentos</button>
                    <button onClick={() => setActiveSubTab('forbidden')} className={getSubTabClassName('forbidden')}>Alimentos a Evitar</button>
                </div>
            </nav>

            {activeSubTab === 'builder' && (
                <div className="space-y-8">
                    <QuickMealSelector onSelectMeal={addQuickMeal} />
                    <MealShuffler onShuffle={shuffleMeal} />
                    <MealHistory 
                        history={mealHistory || []}
                        onLoad={handleLoadMealFromHistory}
                        onDelete={handleDeleteMealFromHistory}
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3">
                        <MealBuilder
                        foods={combinedFoods}
                        meal={meal}
                        onAddFood={addFoodToMeal}
                        onRemoveFood={removeFoodFromMeal}
                        onUpdateAmount={updateFoodAmount}
                        individualLoads={mealAnalysis.individualLoads}
                        />
                    </div>
                    <div className="lg:col-span-2">
                        <MealSummary
                        meal={meal}
                        onClearMeal={clearMeal}
                        onOpenSaveModal={() => setIsSaveModalOpen(true)}
                        fodmapLoads={mealAnalysis.fodmapLoads}
                        totalCalories={mealAnalysis.totalCalories}
                        />
                    </div>
                    </div>
                     <SaveToPlanModal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} onSave={saveMealToPlan} currentMeal={meal} />
                </div>
            )}

            {activeSubTab === 'guidedPlans' && (
                <div className="space-y-6">
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-semibold text-gray-800">Planos Guiados</h2>
                    <p className="mt-2 text-gray-600 mb-6">
                        Explore os nossos planos de refeições temáticos para inspiração. Selecione uma categoria abaixo para ver as receitas e carregá-las no construtor.
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => setActivePlanTab('anti-inflammatory')} className={getPlanTabClassName('anti-inflammatory')}>
                        Plano Anti-Inflamatório
                        </button>
                        <button onClick={() => setActivePlanTab('detox')} className={getPlanTabClassName('detox')}>
                        Sumos e Batidos Detox
                        </button>
                        <button onClick={() => setActivePlanTab('soups')} className={getPlanTabClassName('soups')}>
                        Sopas Anti-inflamatórias
                        </button>
                    </div>
                    </div>

                    {activePlanTab === 'anti-inflammatory' && <AntiInflammatoryPlanSelector onSelectMeal={handleSelectGuidedMeal} />}
                    {activePlanTab === 'detox' && <DetoxPlanSelector onSelectMeal={handleSelectGuidedMeal} />}
                    {activePlanTab === 'soups' && <SoupSelector onSelectMeal={handleSelectGuidedMeal} />}
                </div>
            )}
            
            {activeSubTab === 'generator' && (
                 <PlanGenerator 
                    allFoods={combinedFoods}
                    preferences={foodPreferences}
                    onPreferencesChange={(prefs) => updateAppData({ foodPreferences: prefs })}
                    onGeneratePlan={generateWeeklyPlan}
                    isGenerating={isGenerating}
                    basalMetabolicRate={basalMetabolicRate || 1800}
                    onBmrChange={(value) => updateAppData({ basalMetabolicRate: value })}
                />
            )}

            {activeSubTab === 'weekly' && (
                <WeeklyPlanner
                    plan={weeklyPlan}
                    onLoadMeal={loadMealFromPlan}
                    onClearMealFromSlot={clearMealFromPlan}
                    onClearAll={clearWeeklyPlan}
                    calorieGoal={dailyCalorieGoal}
                    onSetCalorieGoal={(goal) => updateAppData({ dailyCalorieGoal: goal })}
                    allFoods={combinedFoods}
                    onUpdateMealInPlan={updateMealInPlan}
                />
            )}

            {activeSubTab === 'shopping' && <ShoppingList plan={weeklyPlan} />}
            {activeSubTab === 'forbidden' && <ForbiddenFoods />}
            {activeSubTab === 'customFood' && <CustomFoodManager customFoods={customFoods} onAddFood={addCustomFood} onDeleteFood={deleteCustomFood} />}

        </div>
    );
};

export default FoodPlanner;