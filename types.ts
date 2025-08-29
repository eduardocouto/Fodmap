export enum FodmapType {
  FRUCTANS = 'Frutanos',
  FRUCTOSE = 'Frutose',
  SORBITOL = 'Sorbitol',
  MANNITOL = 'Manitol',
  GOS = 'GOS',
  LACTOSE = 'Lactose',
}

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
  category: MealSlot | 'Sopa';
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