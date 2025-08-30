import React, { useMemo } from 'react';
import type { FoodItem, FoodPreferences, MealSlot, FoodCategory } from '../types';
import { MealSlot as MealSlotEnum } from '../types';

interface PlanGeneratorProps {
    allFoods: FoodItem[];
    preferences: FoodPreferences;
    onPreferencesChange: (prefs: FoodPreferences) => void;
    onGeneratePlan: () => void;
    isGenerating: boolean;
}

const FOOD_CATEGORIES: FoodCategory[] = [
    'Proteína', 'Fruta', 'Legumes', 'Cereais', 'Laticínios', 
    'Sementes', 'Pastas', 'Frutos Oleaginosos', 'Leguminosas', 
    'Substitutos vegetarianos', 'Doces', 'Outros'
];

const MEAL_SLOTS_ORDER: MealSlot[] = [
    MealSlotEnum.BREAKFAST,
    MealSlotEnum.LUNCH,
    MealSlotEnum.DINNER,
    MealSlotEnum.SNACKS,
    MealSlotEnum.AFTERNOON_SNACK,
];

const PlanGenerator: React.FC<PlanGeneratorProps> = ({ allFoods, preferences, onPreferencesChange, onGeneratePlan, isGenerating }) => {
    
    const foodsByCategory = useMemo(() => {
        const grouped: { [key in FoodCategory]?: FoodItem[] } = {};
        allFoods.forEach(food => {
            const category = food.category as FoodCategory;
            if (FOOD_CATEGORIES.includes(category)) {
                if (!grouped[category]) {
                    grouped[category] = [];
                }
                grouped[category]?.push(food);
            }
        });
        return grouped;
    }, [allFoods]);

    const handlePreferenceChange = (slot: MealSlot, foodId: string, isChecked: boolean) => {
        const currentPrefs = preferences[slot] || [];
        const newPrefs = isChecked
            ? [...currentPrefs, foodId]
            : currentPrefs.filter(id => id !== foodId);
        
        onPreferencesChange({ ...preferences, [slot]: newPrefs });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow space-y-8">
            <div>
                <h2 className="text-2xl font-semibold text-gray-800">Gerador de Plano Semanal</h2>
                <p className="mt-2 text-gray-600">
                    Selecione os alimentos que mais gosta para cada refeição. Com base nas suas escolhas, criaremos um plano semanal variado e com as quantidades de FODMAPs ajustadas automaticamente. As suas preferências são guardadas.
                </p>
            </div>

            <div className="space-y-8">
                {MEAL_SLOTS_ORDER.map(slot => (
                    <div key={slot} className="p-4 bg-gray-50 rounded-lg border">
                        <h3 className="text-xl font-bold text-emerald-700 mb-4">{slot}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {FOOD_CATEGORIES.map(category => {
                                const foods = foodsByCategory[category];
                                if (!foods || foods.length === 0) return null;

                                return (
                                    <div key={`${slot}-${category}`}>
                                        <h4 className="font-semibold text-gray-600 mb-2">{category}</h4>
                                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2">
                                            {foods.map(food => (
                                                <label key={food.id} className="flex items-center space-x-2 text-sm text-gray-700 hover:bg-emerald-50 p-1 rounded-md cursor-pointer">
                                                    <input 
                                                        type="checkbox"
                                                        checked={preferences[slot]?.includes(food.id) || false}
                                                        onChange={(e) => handlePreferenceChange(slot, food.id, e.target.checked)}
                                                        className="form-checkbox h-4 w-4 text-emerald-600 rounded border-gray-300 bg-gray-100 focus:ring-emerald-500"
                                                    />
                                                    <span>{food.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-6 border-t">
                <button
                    onClick={onGeneratePlan}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-3 bg-emerald-600 text-white font-bold py-4 px-4 rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-wait"
                >
                    {isGenerating ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            A gerar o seu plano...
                        </>
                    ) : (
                        <>
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v1.946l.06.06A8.5 8.5 0 0119.5 10.5a1 1 0 11-2 0 6.5 6.5 0 00-5.443-6.443l-.06-.06V2a1 1 0 01-.954-.954l-.046-.046zM2 10.5a8.5 8.5 0 016.443-8.443l.06-.06V2a1 1 0 012 0v1.946l.06.06A8.5 8.5 0 0118 10.5a1 1 0 01-2 0 6.5 6.5 0 00-13 0 1 1 0 01-2 0zm5.121 4.879A2.5 2.5 0 0110.5 12a2.5 2.5 0 012.379 3.379l.06.121a3.5 3.5 0 01-4.878 0l.06-.121z" clipRule="evenodd" /></svg>
                             Gerar o Meu Plano Semanal
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default PlanGenerator;