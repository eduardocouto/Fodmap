
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { AppData, MealItem, FoodItem, WeeklyPlan, DayPlan, MealSlot, ShuffleOption, FoodFodmapInfo, FoodPreferences, Tab } from './types';
import { ALL_FOODS } from './constants/foods';
import Header from './components/Header';
import HealthDashboard from './components/HealthDashboard';
import ToastNotification from './components/ToastNotification';
import WeeklyReport from './components/WeeklyReport';
import FoodPlanner from './components/FoodPlanner';


interface ToastInfo {
  id: number;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const initialAppData: AppData = {
    weeklyPlan: {},
    customFoods: [],
    dailyCalorieGoal: 2000,
    foodPreferences: {},
    activityData: [],
    bodyCompositionData: null,
    symptomLogs: [],
    medicalDocuments: [],
    medicationLogs: [],
};

const App: React.FC = () => {
  const [meal, setMeal] = useState<MealItem[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('health');
  const [toast, setToast] = useState<ToastInfo | null>(null);
  const [appData, setAppData] = useState<AppData>(initialAppData);

  const updateAppData = (updates: Partial<AppData>) => {
    setAppData(prev => ({ ...prev, ...updates }));
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/data');
      if (response.ok) {
        const data = await response.json();
        setAppData(prev => ({ ...prev, ...data }));
        return;
      }
      throw new Error("API fetch failed, falling back to localStorage.");
    } catch (error) {
      console.warn(error);
      try {
        const savedData = localStorage.getItem('fodmapAppData');
        if (savedData) {
          setAppData(JSON.parse(savedData));
        }
      } catch (localError) {
        console.error("Failed to load data from localStorage", localError);
      }
    }
  }, []);

  const saveData = useCallback(async (data: AppData) => {
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
         throw new Error("API save failed, falling back to localStorage.");
      }
    } catch (error) {
        console.warn(error);
        try {
            localStorage.setItem('fodmapAppData', JSON.stringify(data));
        } catch (localError) {
            console.error("Failed to save data to localStorage", localError);
        }
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    saveData(appData);
  }, [appData, saveData]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  
  const showToast = useCallback((message: string, actionLabel?: string, onAction?: () => void) => {
      setToast({ id: Date.now(), message, actionLabel, onAction });
  }, []);

  const combinedFoods = useMemo(() => [...ALL_FOODS, ...appData.customFoods].sort((a,b) => a.name.localeCompare(b.name)), [appData.customFoods]);

  const getTabClassName = (tabName: Tab) => {
    const base = 'flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500';
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
          <div className="flex flex-wrap justify-center gap-1">
            <button onClick={() => setActiveTab('health')} className={getTabClassName('health')} aria-pressed={activeTab === 'health'} aria-label="1. Painel de Saúde">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
              <span className="hidden md:inline">1. Painel de Saúde</span>
            </button>
            <button onClick={() => setActiveTab('planner')} className={getTabClassName('planner')} aria-pressed={activeTab === 'planner'} aria-label="2. Plano Alimentar">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
              <span className="hidden md:inline">2. Plano Alimentar</span>
            </button>
            <button onClick={() => setActiveTab('report')} className={getTabClassName('report')} aria-pressed={activeTab === 'report'} aria-label="3. Relatório Semanal">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm6 1a1 1 0 10-2 0v2a1 1 0 102 0V6zm-3 2a1 1 0 10-2 0v2a1 1 0 102 0V8zm6 0a1 1 0 10-2 0v2a1 1 0 102 0V8zm-3 2a1 1 0 10-2 0v2a1 1 0 102 0v-2z" clipRule="evenodd" /></svg>
              <span className="hidden md:inline">3. Relatório Semanal</span>
            </button>
          </div>
        </nav>
        
        {activeTab === 'health' && (
          <HealthDashboard
            activities={appData.activityData}
            onActivitiesChange={(data) => updateAppData({ activityData: data })}
            bodyComposition={appData.bodyCompositionData}
            onBodyCompositionChange={(data) => updateAppData({ bodyCompositionData: data })}
            symptoms={appData.symptomLogs}
            onSymptomsChange={(data) => updateAppData({ symptomLogs: data })}
            medicalDocuments={appData.medicalDocuments}
            onMedicalDocumentsChange={(data) => updateAppData({ medicalDocuments: data })}
            medicationLogs={appData.medicationLogs}
            onMedicationLogsChange={(data) => updateAppData({ medicationLogs: data })}
          />
        )}
        
        {activeTab === 'planner' && 
          <FoodPlanner 
            appData={appData}
            updateAppData={updateAppData}
            meal={meal}
            setMeal={setMeal}
            showToast={showToast}
            combinedFoods={combinedFoods}
          />
        }

        {activeTab === 'report' && <WeeklyReport appData={appData} />}

      </main>

      <ToastNotification info={toast} onClose={() => setToast(null)} />

      <footer className="text-center p-4 text-sm text-gray-500 mt-8">
        <p>IntelliGesto. O seu assistente inteligente para o bem-estar digestivo.</p>
      </footer>
    </div>
  );
};

export default App;
