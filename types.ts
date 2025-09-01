

export enum FodmapType {
  FRUCTANS = 'Frutanos',
  FRUCTOSE = 'Frutose',
  SORBITOL = 'Sorbitol',
  MANNITOL = 'Manitol',
  GOS = 'GOS',
  LACTOSE = 'Lactose',
}

export type Tab = 'report' | 'planner' | 'health';
export type PlannerSubTab = 'builder' | 'guidedPlans' | 'generator' | 'weekly' | 'shopping' | 'customFood' | 'forbidden';
export type HealthSubTab = 'overview' | 'activity' | 'symptoms' | 'medication' | 'documents';
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

// Types for Health Dashboard
export interface Activity {
  type: string;
  date: string;
  distance: number;
  calories: number;
  duration: string;
  avgHeartRate: number;
  maxHeartRate: number;
  avgSpeed: number;
  maxSpeed: number;
}

export interface BodyComposition {
  date: string;
  weightKg: number;
  heightCm: number;
  age: number;
  bodyFatMassKg: number;
  skeletalMuscleMassKg: number;
  bmi: number;
  bodyFatPercentage: number;
  fitnessScore: number;
  weightControlKg: number;
  fatMassControlKg: number;
  muscleControlKg: number;
  metabolicAge: number;
  normalRanges: {
    weightKg: string;
    skeletalMuscleMassKg: string;
    bodyFatMassKg: string;
    bmi: string;
    bodyFatPercentage: string;
  };
}

export interface SymptomLog {
  id: string;
  date: string;
  notes: string;
  bloating: number; // 0-5 scale
  pain: number; // 0-5 scale
  energy: number; // 0-5 scale
  bristolStools: number[]; // 1-7, multiple per day
  urinationFrequency: number; // 0-5 scale
  urinationUrgency: number; // 0-5 scale
}

export interface MedicalDocument {
    id: string;
    fileName: string;
    extractedText: string;
}

export interface MedicationLog {
    id: string;
    date: string;
    name: string;
    dosage: string;
    frequency: string;
}

export interface HistoricalMeal {
  id: string;
  name: string;
  createdAt: string; // ISO string date
  meal: MealItem[];
}

// Type for the entire application state
export interface AppData {
  weeklyPlan: WeeklyPlan;
  customFoods: FoodItem[];
  dailyCalorieGoal: number;
  basalMetabolicRate: number;
  foodPreferences: FoodPreferences;
  activityData: Activity[];
  bodyCompositionData: BodyComposition | null;
  symptomLogs: SymptomLog[];
  medicalDocuments: MedicalDocument[];
  medicationLogs: MedicationLog[];
  mealHistory: HistoricalMeal[];
}