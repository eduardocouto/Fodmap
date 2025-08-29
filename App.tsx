import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { MealItem, FoodItem, MealTemplate, WeeklyPlan, DayPlan, MealSlot, ShuffleOption, FoodFodmapInfo } from './types';
import { ALL_FOODS } from './constants/foods';
import { MEAL_TEMPLATES } from './constants/mealTemplates';
import Header from './components/Header';
import MealBuilder from './components/MealBuilder';
import MealSummary from './components/MealSummary';
import ForbiddenFoods from './components/ForbiddenFoods';
import QuickMealSelector from './components/QuickMealSelector';
import MealShuffler from './components/MealShuffler';
import WeeklyPlanner from './components/WeeklyPlanner';
import SaveToPlanModal from './components/SaveToPlanModal';
import ShoppingList from './components/ShoppingList';
import ToastNotification from './components/ToastNotification';
import { MealSlot as MealSlotEnum, FodmapType, FructanGroup } from './types';

type Tab = 'planner' | 'weekly' | 'shopping' | 'customFood' | 'forbidden';

interface ToastInfo {
  id: number;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

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


const App: React.FC = () => {
  const [meal, setMeal] = useState<MealItem[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('planner');
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>({});
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [customFoods, setCustomFoods] = useState<FoodItem[]>([]);
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState<number>(2000);
  const [toast, setToast] = useState<ToastInfo | null>(null);

  // Load data from localStorage on initial render
  useEffect(() => {
    // Plan
    try {
      const savedPlan = localStorage.getItem('fodmapWeeklyPlan');
      if (savedPlan) setWeeklyPlan(JSON.parse(savedPlan));
    } catch (error) { console.error("Failed to load weekly plan", error); }
    // Custom Foods
     try {
      const savedFoods = localStorage.getItem('fodmapCustomFoods');
      if (savedFoods) setCustomFoods(JSON.parse(savedFoods));
    } catch (error) { console.error("Failed to load custom foods", error); }
    // Calorie Goal
    try {
      const savedGoal = localStorage.getItem('fodmapCalorieGoal');
      if (savedGoal) setDailyCalorieGoal(JSON.parse(savedGoal));
    } catch (error) { console.error("Failed to load calorie goal", error); }

  }, []);

  // Save other states to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('fodmapWeeklyPlan', JSON.stringify(weeklyPlan));
      localStorage.setItem('fodmapCustomFoods', JSON.stringify(customFoods));
      localStorage.setItem('fodmapCalorieGoal', JSON.stringify(dailyCalorieGoal));
    } catch (error) {
      console.error("Failed to save data to localStorage", error);
    }
  }, [weeklyPlan, customFoods, dailyCalorieGoal]);
  
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const combinedFoods = useMemo(() => [...ALL_FOODS, ...customFoods].sort((a,b) => a.name.localeCompare(b.name)), [customFoods]);

  const addCustomFood = (food: FoodItem) => setCustomFoods(prev => [...prev, food]);
  const deleteCustomFood = (foodId: string) => {
    if(window.confirm("Tem a certeza que quer remover este alimento?")) {
      setCustomFoods(prev => prev.filter(f => f.id !== foodId));
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
  
  const shuffleMeal = (slot: ShuffleOption) => {
    const getSoups = () => MEAL_TEMPLATES.filter(t => t.type === 'soup');
    if (slot === 'Sopa') {
      const soups = getSoups();
      if (soups.length > 0) {
        addQuickMeal(soups[Math.floor(Math.random() * soups.length)]);
        return;
      }
    }
    
    if (slot === MealSlotEnum.LUNCH || slot === MealSlotEnum.DINNER) {
      if (Math.random() < 0.4) {
        const soups = getSoups();
        if (soups.length > 0) {
          addQuickMeal(soups[Math.floor(Math.random() * soups.length)]);
          return;
        }
      }
    }

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
    setWeeklyPlan(prevPlan => {
      const newPlan = { ...prevPlan };
      days.forEach(day => {
        newPlan[day] = { ...newPlan[day], [slot]: meal };
      });
      return newPlan;
    });
    setIsSaveModalOpen(false);
    setToast({
      id: Date.now(),
      message: 'Refeição guardada com sucesso!',
      actionLabel: 'Ver Plano',
      onAction: () => setActiveTab('weekly'),
    });
  };

  const loadMealFromPlan = (mealToLoad: MealItem[]) => {
    setMeal(mealToLoad);
    setActiveTab('planner');
  };

  const clearMealFromPlan = (day: string, slot: MealSlot) => {
    setWeeklyPlan(prevPlan => {
      // Return original plan if the day or slot doesn't exist to clear
      if (!prevPlan[day]?.[slot]) {
        return prevPlan;
      }
      
      // Create a new day plan object without the specified slot
      const { [slot]: _, ...updatedDayPlan } = prevPlan[day];
  
      // If the day becomes empty after removing the slot
      if (Object.keys(updatedDayPlan).length === 0) {
        // Create a new weekly plan object without the empty day
        const { [day]: __, ...updatedWeeklyPlan } = prevPlan;
        return updatedWeeklyPlan;
      } else {
        // Otherwise, return a new weekly plan with the updated day
        return {
          ...prevPlan,
          [day]: updatedDayPlan,
        };
      }
    });
  };

  const clearWeeklyPlan = () => {
    if (window.confirm('Tem a certeza que quer limpar todo o plano semanal? Esta ação não pode ser desfeita.')) {
      setWeeklyPlan({});
    }
  };

  const updateMealInPlan = (day: string, slot: MealSlot, updatedMeal: MealItem[]) => {
    setWeeklyPlan(prevPlan => {
      const newPlan = { ...prevPlan };
      const dayPlan = { ...newPlan[day] };
      dayPlan[slot] = updatedMeal;
      newPlan[day] = dayPlan;
      return newPlan;
    });
     setToast({
      id: Date.now(),
      message: 'Refeição atualizada no plano!',
    });
  };


  const getTabClassName = (tabName: Tab) => {
    const base = 'flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500';
    if (activeTab === tabName) {
      return `${base} bg-white text-emerald-600 shadow-sm`;
    }
    return `${base} bg-transparent text-gray-500 hover:bg-white/60 hover:text-emerald-600`;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 md:p-8">
        <nav className="mb-8 bg-gray-100 p-2 rounded-xl shadow-inner max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-1">
            <button onClick={() => setActiveTab('planner')} className={getTabClassName('planner')} aria-pressed={activeTab === 'planner'} aria-label="Construtor de Refeições">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              <span className="hidden sm:inline">Construtor</span>
            </button>
            <button onClick={() => setActiveTab('weekly')} className={getTabClassName('weekly')} aria-pressed={activeTab === 'weekly'} aria-label="Plano Semanal">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
              <span className="hidden sm:inline">Plano Semanal</span>
            </button>
            <button onClick={() => setActiveTab('shopping')} className={getTabClassName('shopping')} aria-pressed={activeTab === 'shopping'} aria-label="Lista de Compras">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>
              <span className="hidden sm:inline">Lista de Compras</span>
            </button>
            <button onClick={() => setActiveTab('customFood')} className={getTabClassName('customFood')} aria-pressed={activeTab === 'customFood'} aria-label="Meus Alimentos">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
              <span className="hidden sm:inline">Meus Alimentos</span>
            </button>
            <button onClick={() => setActiveTab('forbidden')} className={getTabClassName('forbidden')} aria-pressed={activeTab === 'forbidden'} aria-label="Alimentos a Evitar">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              <span className="hidden sm:inline">Alimentos a Evitar</span>
            </button>
          </div>
        </nav>

        {activeTab === 'planner' && (
          <div className="space-y-8">
            <QuickMealSelector onSelectMeal={addQuickMeal} />
            <MealShuffler onShuffle={shuffleMeal} />
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3">
                <MealBuilder
                  foods={combinedFoods}
                  meal={meal}
                  onAddFood={addFoodToMeal}
                  onRemoveFood={removeFoodFromMeal}
                  onUpdateAmount={updateFoodAmount}
                />
              </div>
              <div className="lg:col-span-2">
                <MealSummary meal={meal} onClearMeal={clearMeal} onOpenSaveModal={() => setIsSaveModalOpen(true)} />
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'weekly' && (
          <WeeklyPlanner
            plan={weeklyPlan}
            onLoadMeal={loadMealFromPlan}
            onClearMealFromSlot={clearMealFromPlan}
            onClearAll={clearWeeklyPlan}
            calorieGoal={dailyCalorieGoal}
            onSetCalorieGoal={setDailyCalorieGoal}
            allFoods={combinedFoods}
            onUpdateMealInPlan={updateMealInPlan}
          />
        )}

        {activeTab === 'shopping' && <ShoppingList plan={weeklyPlan} />}
        {activeTab === 'forbidden' && <ForbiddenFoods />}
        {activeTab === 'customFood' && <CustomFoodManager customFoods={customFoods} onAddFood={addCustomFood} onDeleteFood={deleteCustomFood} />}

      </main>

      <SaveToPlanModal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} onSave={saveMealToPlan} currentMeal={meal} />
      
      <ToastNotification info={toast} onClose={() => setToast(null)} />

      <footer className="text-center p-4 text-sm text-gray-500 mt-8">
        <p>FODMAP Meal Planner. O seu assistente de nutrição digital.</p>
      </footer>
    </div>
  );
};

export default App;