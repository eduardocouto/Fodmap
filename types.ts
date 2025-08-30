export enum FodmapType {
  FRUCTANS = 'Frutanos',
  FRUCTOSE = 'Frutose',
  SORBITOL = 'Sorbitol',
  MANNITOL = 'Manitol',
  GOS = 'GOS',
  LACTOSE = 'Lactose',
}

export type PlanTab = 'anti-inflammatory' | 'detox' | 'soups';

export enum FructanGroup {
  FRUIT_VEG = 'Frutas e Legumes',
  CEREAL = 'Cereais',
}

export interface FoodFodmapInfo {
  type: FodmapType;
  group?: FructanGroup;
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  fodmaps: FoodFodmapInfo[];
  safeAmount: number;
  unit: string;
  calories: number; // Calories per 100g/100ml or per unit
  notes?: string;
}

export interface MealItem {
  instanceId: string;
  food: FoodItem;
  currentAmount: number;
}

export interface ForbiddenFoodItem {
  id: string;
  name: string;
  category: string;
  reason: string;
}

export interface MealTemplateItem {
  foodId: string;
  amount: number;
}

export interface MealTemplate {
  id:string;
  name: string;
  description: string;
  items: MealTemplateItem[];
  type?: 'recipe' | 'soup';
  // FIX: Changed category type to string to allow for custom categories from AI plans.
  category: string;
}

// Types for Weekly Planner
export enum MealSlot {
  BREAKFAST = 'Pequeno-almoço',
  LUNCH = 'Almoço',
  AFTERNOON_SNACK = 'Lanche da Tarde',
  DINNER = 'Jantar',
  SNACKS = 'Lanches',
}

export type DayPlan = {
  [key in MealSlot]?: MealItem[];
};

export type WeeklyPlan = {
  [day: string]: DayPlan;
};

export type ShuffleOption = MealSlot | 'Sopa';

// Types for Plan Generator
export type FoodCategory = 'Proteína' | 'Fruta' | 'Legumes' | 'Cereais' | 'Laticínios' | 'Sementes' | 'Pastas' | 'Frutos Oleaginosos' | 'Leguminosas' | 'Substitutos vegetarianos' | 'Doces' | 'Outros';

export type FoodPreferences = {
  [key in MealSlot]?: string[]; // Array of food IDs
};