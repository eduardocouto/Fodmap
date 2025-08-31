
import React, { useState } from 'react';
import type { AppData, WeeklyPlan, Activity, BodyComposition, SymptomLog, MedicalDocument, MedicationLog } from '../types';
import { GoogleGenAI } from "@google/genai";
import { calculateMealCalories } from '../utils/mealUtils';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

interface WeeklyReportProps {
  appData: AppData;
}

const WeeklyReport: React.FC<WeeklyReportProps> = ({ appData }) => {
    const { weeklyPlan, activityData, bodyCompositionData, symptomLogs, medicalDocuments, medicationLogs } = appData;
    const [report, setReport] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const generateReport = async () => {
        setIsLoading(true);
        setReport('');

        const dailyCalories = Object.entries(weeklyPlan).reduce((acc, [day, dayPlan]) => {
          const total = Object.values(dayPlan).reduce((dayTotal, meal) => dayTotal + calculateMealCalories(meal), 0);
          acc[day] = Math.round(total);
          return acc;
        }, {} as Record<string, number>);

        const medicalDocsText = medicalDocuments.length > 0
            ? medicalDocuments.map(doc => 
                `--- Início do Relatório: ${doc.fileName} ---\n${doc.extractedText}\n--- Fim do Relatório ---`
              ).join('\n\n')
            : 'Nenhum documento médico foi carregado.';


        const prompt = `
            You are a health and nutrition assistant. Analyze the following data for a user on a low-FODMAP diet and provide a concise report in Portuguese with actionable insights.
            Format the response with markdown for clarity.
            
            **Body Composition (as of ${bodyCompositionData?.date}):**
            ${bodyCompositionData ? `- Weight: ${bodyCompositionData.weightKg} kg
            - Body Fat: ${bodyCompositionData.bodyFatPercentage}%
            - BMI: ${bodyCompositionData.bmi}
            - Skeletal Muscle: ${bodyCompositionData.skeletalMuscleMassKg} kg
            - Goals: Lose ${-bodyCompositionData.weightControlKg}kg weight, Lose ${-bodyCompositionData.fatMassControlKg}kg fat, Gain ${bodyCompositionData.muscleControlKg}kg muscle.` : 'No body composition data.'}

            **Daily Caloric Intake Summary (from meal plan):**
            ${Object.keys(dailyCalories).length > 0 ? JSON.stringify(dailyCalories, null, 2) : 'No meal plan data.'}

            **Recent Activities:**
            ${activityData.length > 0 ? activityData.slice(0, 10).map(a => `- ${a.date.split(' ')[0]}: ${a.type}, ${a.duration}, ${a.calories} kcal`).join('\n') : 'No activity data.'}

            **Symptom Logs:**
            ${symptomLogs.length > 0 ? symptomLogs.slice(0,10).map(s => `- ${s.date}: Bloating(${s.bloating}/5), Pain(${s.pain}/5), Energy(${s.energy}/5), Bristol([${s.bristolStools.join(', ')}]), Urination(Freq: ${s.urinationFrequency}/5, Urg: ${s.urinationUrgency}/5). Notes: ${s.notes || 'N/A'}`).join('\n') : 'No symptom data.'}
            
            **Medication & Supplement Logs:**
            ${medicationLogs.length > 0 ? medicationLogs.slice(0,10).map(m => `- ${m.date}: ${m.name} ${m.dosage} (${m.frequency})`).join('\n') : 'No medication data.'}

            **Text Extracted from Medical Reports:**
            ${medicalDocsText}

            **Analysis Request:**
            1. Provide a brief overview of the user's current situation based on their body composition.
            2. Analyze the relationship between daily caloric intake, physical activity, and reported symptoms (including multiple daily Bristol Scale readings and urination data).
            3. Critically analyze the data from the medical reports. Point out any values that are outside the normal reference ranges or any other significant findings.
            4. Correlate findings from the medical reports with other data (symptoms, diet, medication). For example, does vitamin D level (25-Hidroxivitamina D) relate to energy levels? Does Calprotectina fecal relate to digestive symptoms?
            5. Are the activities aligned with the body composition goals (fat loss, muscle gain)?
            6. Provide 3-5 clear, actionable recommendations for the upcoming week based on an integrated analysis of ALL the data provided (composition, diet, activity, symptoms, medication, AND medical reports). Be specific. If some data is missing, state it and explain how providing it would improve the analysis.
        `;

        try {
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setReport(response.text);
        } catch (error) {
            console.error("Error generating report:", error);
            setReport("Ocorreu um erro ao gerar o relatório. Por favor, tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };
    
    // Basic markdown to HTML
    const formattedReport = report
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');

    return (
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-gray-800">Relatório Semanal</h2>
                <p className="mt-2 text-gray-600">
                    Clique no botão abaixo para gerar uma análise completa com IA. O relatório irá correlacionar os seus dados do Plano Alimentar e do Painel de Saúde para lhe fornecer insights e recomendações personalizadas.
                </p>
                <p className="mt-1 text-sm text-gray-500">
                    Quanto mais dados fornecer (sintomas, atividades, exames), mais preciso será o relatório.
                </p>
            </div>
            <button 
                onClick={generateReport} 
                disabled={isLoading} 
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-wait transition-colors"
            >
                 {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        A analisar os seus dados...
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm6 1a1 1 0 10-2 0v2a1 1 0 102 0V6zm-3 2a1 1 0 10-2 0v2a1 1 0 102 0V8zm6 0a1 1 0 10-2 0v2a1 1 0 102 0V8zm-3 2a1 1 0 10-2 0v2a1 1 0 102 0v-2z" clipRule="evenodd" /></svg>
                        Gerar/Atualizar Relatório Semanal
                    </>
                )}
            </button>
            {report && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border prose max-w-none" dangerouslySetInnerHTML={{ __html: formattedReport }}></div>
            )}
        </div>
    );
};

export default WeeklyReport;
