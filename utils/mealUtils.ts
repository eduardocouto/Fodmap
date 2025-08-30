import type { MealItem, FoodItem } from '../types';
import { FodmapType } from '../types';

/**
 * Calculates the total calorie count for a given meal.
 * @param meal An array of MealItem objects.
 * @returns The total number of calories, rounded to the nearest integer.
 */
export const calculateMealCalories = (meal: MealItem[]): number => {
    if (!meal) return 0;
    const total = meal.reduce((total, item) => {
        const { food, currentAmount } = item;
        if (typeof food.calories !== 'number') return total;

        let itemCalories = 0;
        if (food.unit.includes('g') || food.unit.includes('ml')) {
            itemCalories = (currentAmount / 100) * food.calories;
        } else {
            itemCalories = currentAmount * food.calories;
        }
        return total + (itemCalories || 0);
    }, 0);
    return Math.round(total);
};


/**
 * Calculates the aggregated FODMAP load for each FODMAP type present in the meal,
 * as well as the individual load percentage for each item instance.
 * @param meal An array of MealItem objects.
 * @returns An object containing `fodmapLoads` (a record of total load per FODMAP type)
 * and `individualLoads` (a record of load percentage per meal item instance).
 */
export const calculateFodmapLoads = (meal: MealItem[]) => {
    const fodmapLoads: Partial<Record<FodmapType, number>> = {};
    const individualLoads: Record<string, number> = {};

    meal.forEach(item => {
        const { food, currentAmount, instanceId } = item;

        // Individual load calculation
        const itemLoad = food.safeAmount > 0 ? currentAmount / food.safeAmount : 0;
        individualLoads[instanceId] = itemLoad * 100; // Store as percentage

        // Aggregate FODMAP loads
        if (food.fodmaps.length > 0 && itemLoad > 0) {
            food.fodmaps.forEach(fodmapInfo => {
                const { type } = fodmapInfo;
                fodmapLoads[type] = (fodmapLoads[type] || 0) + itemLoad;
            });
        }
    });

    return { fodmapLoads, individualLoads };
};