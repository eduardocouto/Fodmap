
import React, { useState, useEffect, useMemo } from 'react';
import type { Activity, BodyComposition, SymptomLog, MedicalDocument, MedicationLog, HealthSubTab } from '../types';
import { GoogleGenAI, Type } from "@google/genai";


const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const BRISTOL_SCALE_DESCRIPTIONS: Record<number, { title: string, description: string }> = {
    1: { title: 'Prisão de ventre severa', description: 'Pedras duras, separadas, como nozes' },
    2: { title: 'Prisão de ventre ligeira', description: 'Fezes em forma de salsicha, mas com caroços' },
    3: { title: 'Normal', description: 'Fezes em forma de salsicha, com fissuras na superfície' },
    4: { title: 'Ideal / saudável', description: 'Fezes em forma de salsicha ou cobra, lisas e macias' },
    5: { title: 'Tendência a fezes soltas', description: 'Pedaços macios com contornos definidos' },
    6: { title: 'Diarreia leve', description: 'Fragmentos moles, irregulares, com bordos esfiapados' },
    7: { title: 'Diarreia grave', description: 'Totalmente líquidas, sem pedaços sólidos' },
};

const parseActivityCSV = (csvText: string): { activities: Activity[], errorLog: string[] } => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return { activities: [], errorLog: ["Ficheiro vazio ou sem dados."] };
    
    const headerLine = lines[0].toLowerCase();
    const headers = headerLine.split(',').map(h => h.replace(/"/g, '').trim());
    const activities: Activity[] = [];
    const errorLog: string[] = [];

    const requiredCols = ['tipo de atividade', 'data'];
    const missingCols = requiredCols.filter(col => !headers.includes(col));
    if (missingCols.length > 0) {
        return { activities: [], errorLog: [`Ficheiro inválido. Faltam as colunas obrigatórias: ${missingCols.join(', ')}`] };
    }

    const colMap = {
        type: headers.indexOf('tipo de atividade'),
        date: headers.indexOf('data'),
        distance: headers.indexOf('distância'),
        calories: headers.indexOf('calorias'),
        duration: headers.indexOf('tempo'),
        avgHeartRate: headers.indexOf('rc médio'),
        maxHeartRate: headers.indexOf('rc máximo'),
        avgSpeed: headers.indexOf('velocidade média'),
        maxSpeed: headers.indexOf('velocidade máxima'),
    };

    for (let i = 1; i < lines.length; i++) {
        const data = lines[i].split(',');
        if (data.length < headers.length) {
            errorLog.push(`Linha ${i + 1}: Número de colunas incorreto. Ignorando.`);
            continue;
        }

        const cleanAndParseFloat = (val: string) => (val === undefined || val.trim() === '--' || val.trim() === '') ? 0 : parseFloat(val.replace(/"/g, '').replace(',', '.'));
        const cleanAndParseInt = (val: string) => (val === undefined || val.trim() === '--' || val.trim() === '') ? 0 : parseInt(val.replace(/"/g, '').replace(/,/g, ''), 10);
        
        try {
            const activity: Activity = {
                type: data[colMap.type]?.replace(/"/g, '').trim() || 'Desconhecido',
                date: data[colMap.date]?.replace(/"/g, '').trim(),
                distance: cleanAndParseFloat(data[colMap.distance]),
                calories: cleanAndParseInt(data[colMap.calories]),
                duration: data[colMap.duration]?.replace(/"/g, '').trim() || '00:00:00',
                avgHeartRate: cleanAndParseInt(data[colMap.avgHeartRate]),
                maxHeartRate: cleanAndParseInt(data[colMap.maxHeartRate]),
                avgSpeed: cleanAndParseFloat(data[colMap.avgSpeed]),
                maxSpeed: cleanAndParseFloat(data[colMap.maxSpeed]),
            };
            if(activity.date) {
               activities.push(activity);
            } else {
                errorLog.push(`Linha ${i + 1}: Data inválida. Ignorando.`);
            }
        } catch (error) {
            errorLog.push(`Linha ${i + 1}: Erro ao processar. Ignorando. Detalhes: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
    }
    return { activities, errorLog };
};


// --- SUB-COMPONENTS ---

const BodyCompositionDisplay: React.FC<{ data: BodyComposition | null }> = ({ data }) => {
    if (!data) return <p className="text-gray-500 mt-4">Nenhum relatório de composição corporal carregado.</p>;

    const MetricCard: React.FC<{ title: string; value: string; normalRange?: string; status: 'good' | 'average' | 'bad' }> = ({ title, value, normalRange, status }) => {
        const colors = { good: 'border-emerald-500', average: 'border-yellow-500', bad: 'border-red-500' };
        return (
            <div className={`bg-gray-50 p-4 rounded-lg border-l-4 ${colors[status]}`}>
                <h4 className="text-sm font-medium text-gray-500">{title}</h4>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                {normalRange && <p className="text-xs text-gray-500">Normal: {normalRange}</p>}
            </div>
        )
    };
    
    const GoalCard: React.FC<{ title: string; value: string; isPositive: boolean }> = ({ title, value, isPositive }) => (
        <div className="bg-gray-50 p-4 rounded-lg text-center">
            <h4 className="text-sm font-medium text-gray-500">{title}</h4>
            <p className={`text-2xl font-bold ${isPositive ? 'text-emerald-600' : 'text-blue-600'}`}>{value}</p>
        </div>
    );
    
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-700">Análise da Composição Corporal (de {data.date})</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <MetricCard title="Peso" value={`${data.weightKg} kg`} normalRange={data.normalRanges.weightKg} status="bad" />
                <MetricCard title="IMC" value={data.bmi.toString()} normalRange={data.normalRanges.bmi} status="bad" />
                <MetricCard title="% Gordura Corporal" value={`${data.bodyFatPercentage}%`} normalRange={data.normalRanges.bodyFatPercentage} status="bad" />
                <MetricCard title="Massa Muscular" value={`${data.skeletalMuscleMassKg} kg`} normalRange={data.normalRanges.skeletalMuscleMassKg} status="good" />
                <MetricCard title="Idade Metabólica" value={`${data.metabolicAge} anos`} status="bad" />
            </div>
             <h4 className="text-lg font-semibold text-gray-700">Controlo de Peso</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GoalCard title="Controlo de Peso" value={`${data.weightControlKg > 0 ? '+' : ''}${data.weightControlKg} kg`} isPositive={false}/>
                <GoalCard title="Controlo de Gordura" value={`${data.fatMassControlKg > 0 ? '+' : ''}${data.fatMassControlKg} kg`} isPositive={false}/>
                <GoalCard title="Controlo Muscular" value={`${data.muscleControlKg > 0 ? '+' : ''}${data.muscleControlKg} kg`} isPositive={true}/>
            </div>
        </div>
    );
};

const ActivityLog: React.FC<{ activities: Activity[], onActivitiesChange: (activities: Activity[]) => void }> = ({ activities, onActivitiesChange }) => {
    const today = new Date().toISOString().split('T')[0];
    const [newActivity, setNewActivity] = useState({
        type: '', date: today, distance: '', calories: '', duration: '00:00:00'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewActivity(prev => ({ ...prev, [name]: value }));
    };

    const handleAddActivity = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newActivity.type || !newActivity.date) return alert('Por favor, preencha pelo menos o tipo e a data da atividade.');
        
        const activityToAdd: Activity = {
            type: newActivity.type,
            date: new Date(newActivity.date).toISOString(),
            distance: parseFloat(newActivity.distance) || 0,
            calories: parseInt(newActivity.calories, 10) || 0,
            duration: newActivity.duration,
            avgHeartRate: 0, maxHeartRate: 0, avgSpeed: 0, maxSpeed: 0,
        };
        
        onActivitiesChange([activityToAdd, ...activities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setNewActivity({ type: '', date: today, distance: '', calories: '', duration: '00:00:00' });
    };
    
    return (
        <div className="space-y-6">
            <div className="max-h-96 overflow-y-auto pr-2">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                        <tr>
                            <th scope="col" className="px-4 py-3">Data</th> <th scope="col" className="px-4 py-3">Tipo</th> <th scope="col" className="px-4 py-3">Distância (km)</th>
                            <th scope="col" className="px-4 py-3">Duração</th> <th scope="col" className="px-4 py-3">Calorias</th> <th scope="col" className="px-4 py-3">RC Médio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activities.map((act, index) => (
                            <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-900">{new Date(act.date).toLocaleDateString()}</td>
                                <td className="px-4 py-3">{act.type}</td>
                                <td className="px-4 py-3">{act.distance > 0 ? act.distance.toFixed(2) : '-'}</td>
                                <td className="px-4 py-3">{act.duration}</td>
                                <td className="px-4 py-3">{act.calories > 0 ? act.calories : '-'}</td>
                                <td className="px-4 py-3">{act.avgHeartRate > 0 ? act.avgHeartRate : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <form onSubmit={handleAddActivity} className="p-4 bg-gray-50 border-t mt-4 space-y-4 rounded-b-lg">
                 <h3 className="text-lg font-semibold text-gray-700">Adicionar Atividade Manualmente</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <input name="type" value={newActivity.type} onChange={handleInputChange} placeholder="Tipo (ex: Corrida)" className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                     <input type="date" name="date" value={newActivity.date} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                     <input name="duration" value={newActivity.duration} onChange={handleInputChange} placeholder="Duração (HH:MM:SS)" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    <input type="number" step="0.01" name="distance" value={newActivity.distance} onChange={handleInputChange} placeholder="Distância (km)" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    <input type="number" name="calories" value={newActivity.calories} onChange={handleInputChange} placeholder="Calorias" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors">Adicionar Atividade</button>
            </form>
        </div>
    );
};

const SymptomTracker: React.FC<{symptoms: SymptomLog[], onSymptomsChange: (symptoms: SymptomLog[]) => void}> = ({symptoms, onSymptomsChange}) => {
    const today = new Date().toISOString().split('T')[0];
    const [log, setLog] = useState({ date: today, notes: '', bloating: 0, pain: 0, energy: 3, urinationFrequency: 0, urinationUrgency: 0 });
    const [currentBristolStools, setCurrentBristolStools] = useState<number[]>([]);
    const [bristolSelection, setBristolSelection] = useState<number>(4);

    const handleAddStool = () => {
        setCurrentBristolStools([...currentBristolStools, bristolSelection]);
    };
    
    const handleRemoveStool = (index: number) => {
        setCurrentBristolStools(currentBristolStools.filter((_, i) => i !== index));
    }

    const handleAddLog = (e: React.FormEvent) => {
        e.preventDefault();
        const newLog: SymptomLog = { ...log, id: crypto.randomUUID(), bristolStools: currentBristolStools };
        onSymptomsChange([...symptoms, newLog].sort((a, b) => b.date.localeCompare(a.date)));
        setLog({ date: today, notes: '', bloating: 0, pain: 0, energy: 3, urinationFrequency: 0, urinationUrgency: 0 });
        setCurrentBristolStools([]);
    };
    
    const sortedSymptoms = useMemo(() => [...symptoms].sort((a,b) => b.date.localeCompare(a.date)), [symptoms]);
    const getEmoji = (level: number) => ['😐', '🙂', '😊', '😁', '😄', '🤩'][level] || '😐';
    const getPainEmoji = (level: number) => ['🙂', '😕', '😟', '😣', '😫', '😭'][level] || '🙂';

    return (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <form onSubmit={handleAddLog} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Data</label>
                        <input type="date" value={log.date} onChange={e => setLog({...log, date: e.target.value})} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"/>
                    </div>
                     <div className="space-y-2">
                        <h4 className="font-medium text-gray-700">Sintomas Gerais</h4>
                        <label className="block text-sm">Inchaço: {log.bloating}/5 {getPainEmoji(log.bloating)}</label>
                        <input type="range" min="0" max="5" value={log.bloating} onChange={e => setLog({...log, bloating: +e.target.value})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
                        <label className="block text-sm">Dor: {log.pain}/5 {getPainEmoji(log.pain)}</label>
                        <input type="range" min="0" max="5" value={log.pain} onChange={e => setLog({...log, pain: +e.target.value})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
                        <label className="block text-sm">Nível de Energia: {log.energy}/5 {getEmoji(log.energy)}</label>
                        <input type="range" min="0" max="5" value={log.energy} onChange={e => setLog({...log, energy: +e.target.value})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-medium text-gray-700">Diário Miccional</h4>
                        <label className="block text-sm">Frequência: {log.urinationFrequency}/5</label>
                        <input type="range" min="0" max="5" value={log.urinationFrequency} onChange={e => setLog({...log, urinationFrequency: +e.target.value})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
                        <label className="block text-sm">Urgência: {log.urinationUrgency}/5</label>
                        <input type="range" min="0" max="5" value={log.urinationUrgency} onChange={e => setLog({...log, urinationUrgency: +e.target.value})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Dejecções (Escala de Bristol)</label>
                        <div className="flex items-center gap-2 mt-1">
                            <select value={bristolSelection} onChange={e => setBristolSelection(parseInt(e.target.value, 10))} className="flex-grow px-3 py-2 border border-gray-300 rounded-md bg-white">
                                {Object.entries(BRISTOL_SCALE_DESCRIPTIONS).map(([type]) => (<option key={type} value={type}>Tipo {type} - {BRISTOL_SCALE_DESCRIPTIONS[parseInt(type, 10)].title}</option>))}
                            </select>
                            <button type="button" onClick={handleAddStool} className="bg-emerald-100 text-emerald-800 px-3 py-2 rounded-md hover:bg-emerald-200 text-sm font-semibold">Adicionar</button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {currentBristolStools.map((stool, index) => (
                                <div key={index} className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded-full">
                                    <span className="text-xs font-semibold">Tipo {stool}</span>
                                    <button type="button" onClick={() => handleRemoveStool(index)} className="text-gray-500 hover:text-red-500">&times;</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700">Notas / Observações</label>
                         <textarea value={log.notes} onChange={e => setLog({...log, notes: e.target.value})} rows={2} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-700">Adicionar Registo do Dia</button>
                </form>
            </div>
             <div className="max-h-[60vh] overflow-y-auto pr-2">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Histórico de Sintomas</h3>
                <div className="space-y-3">
                    {sortedSymptoms.map(s => (
                        <div key={s.id} className="bg-gray-50 p-3 rounded-lg">
                            <p className="font-semibold text-gray-800">{new Date(s.date + 'T00:00:00').toLocaleDateString('pt-PT', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                            <p className="text-sm">Inchaço: {s.bloating}/5, Dor: {s.pain}/5, Energia: {s.energy}/5</p>
                            <p className="text-sm">Micção: Freq. {s.urinationFrequency}/5, Urg. {s.urinationUrgency}/5</p>
                            {s.bristolStools && s.bristolStools.length > 0 && (
                                <p className="text-sm">Bristol: {s.bristolStools.map(b => `Tipo ${b}`).join(', ')}</p>
                            )}
                            {s.notes && <p className="text-sm text-gray-600 mt-1 italic">"{s.notes}"</p>}
                        </div>
                    ))}
                     {sortedSymptoms.length === 0 && <p className="text-gray-500 text-sm">Ainda não há registos de sintomas.</p>}
                </div>
            </div>
        </div>
    );
};

const MedicationTracker: React.FC<{ logs: MedicationLog[], onLogsChange: (logs: MedicationLog[]) => void }> = ({ logs, onLogsChange }) => {
    const today = new Date().toISOString().split('T')[0];
    const [newLog, setNewLog] = useState({ date: today, name: '', dosage: '', frequency: '' });

    const handleAddLog = (e: React.FormEvent) => {
        e.preventDefault();
        if(!newLog.name) return alert("Por favor, introduza o nome do medicamento ou suplemento.");

        const logToAdd: MedicationLog = { ...newLog, id: crypto.randomUUID() };
        onLogsChange([...logs, logToAdd].sort((a, b) => b.date.localeCompare(a.date)));
        setNewLog({ date: today, name: '', dosage: '', frequency: '' });
    };
    
    const groupedLogs = useMemo(() => {
        return logs.reduce((acc, log) => {
            const date = new Date(log.date + 'T00:00:00').toLocaleDateString('pt-PT', { weekday: 'long', month: 'long', day: 'numeric' });
            if (!acc[date]) acc[date] = [];
            acc[date].push(log);
            return acc;
        }, {} as Record<string, MedicationLog[]>);
    }, [logs]);


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <form onSubmit={handleAddLog} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Data</label>
                        <input type="date" value={newLog.date} onChange={e => setNewLog({ ...newLog, date: e.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nome do Medicamento/Suplemento</label>
                        <input type="text" placeholder="Ex: Omeprazol, Vitamina D" value={newLog.name} onChange={e => setNewLog({ ...newLog, name: e.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" required/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Dosagem</label>
                        <input type="text" placeholder="Ex: 20mg, 1000UI" value={newLog.dosage} onChange={e => setNewLog({ ...newLog, dosage: e.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Frequência</label>
                        <input type="text" placeholder="Ex: 1x ao dia, ao deitar" value={newLog.frequency} onChange={e => setNewLog({ ...newLog, frequency: e.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"/>
                    </div>
                    <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-700">Adicionar Registo</button>
                </form>
            </div>
            <div className="max-h-96 overflow-y-auto pr-2">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Histórico de Medicação</h3>
                <div className="space-y-4">
                    {Object.entries(groupedLogs).map(([date, dateLogs]) => (
                        <div key={date}>
                             <p className="font-semibold text-gray-800 mb-2">{date}</p>
                             <div className="space-y-2">
                                {dateLogs.map(log => (
                                    <div key={log.id} className="bg-gray-50 p-2 rounded-lg text-sm">
                                        <strong>{log.name}</strong> - {log.dosage} ({log.frequency})
                                    </div>
                                ))}
                             </div>
                        </div>
                    ))}
                    {logs.length === 0 && <p className="text-gray-500 text-sm">Ainda não há registos de medicação.</p>}
                </div>
            </div>
        </div>
    );
};

const MedicalDocumentsManager: React.FC<{
    medicalDocuments: MedicalDocument[];
    onMedicalDocumentsChange: (documents: MedicalDocument[]) => void;
}> = ({ medicalDocuments, onMedicalDocumentsChange }) => {
    const [isParsing, setIsParsing] = useState(false);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsParsing(true);
        try {
            const base64Data = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve((reader.result as string).split(',')[1]);
                reader.onerror = error => reject(error);
                reader.readAsDataURL(file);
            });
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [{ inlineData: { mimeType: file.type, data: base64Data } }, { text: "Extract all text content from this document." }] },
            });
            
            const newDocument: MedicalDocument = { id: crypto.randomUUID(), fileName: file.name, extractedText: response.text };
            onMedicalDocumentsChange([...medicalDocuments, newDocument]);
        } catch (error) {
            console.error("Error processing medical document:", error);
            alert("Ocorreu um erro ao processar o seu documento.");
        } finally {
            setIsParsing(false);
            event.target.value = '';
        }
    };

    const removeDocument = (id: string) => {
        if (window.confirm("Tem a certeza que quer remover este documento?")) {
            onMedicalDocumentsChange(medicalDocuments.filter(doc => doc.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg border">
                <label htmlFor="medical-doc-upload" className="block text-sm font-medium text-gray-700 mb-2">Carregar novo documento (Imagem ou PDF):</label>
                <input id="medical-doc-upload" type="file" accept="image/png, image/jpeg, application/pdf" onChange={handleUpload} disabled={isParsing}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 disabled:opacity-50" />
                {isParsing && <p className="text-sm text-emerald-600 mt-2 animate-pulse">A analisar o documento com IA...</p>}
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                <h3 className="text-lg font-semibold text-gray-700">Documentos Carregados</h3>
                {medicalDocuments.length > 0 ? medicalDocuments.map(doc => (
                    <div key={doc.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-start">
                        <div className="flex-1 mr-4">
                            <p className="font-semibold text-gray-800 break-words">{doc.fileName}</p>
                            <details className="mt-2 text-xs text-gray-600">
                                <summary className="cursor-pointer font-medium">Ver texto extraído</summary>
                                <pre className="mt-1 whitespace-pre-wrap font-sans bg-white p-2 border rounded">{doc.extractedText}</pre>
                            </details>
                        </div>
                        <button onClick={() => removeDocument(doc.id)} className="text-red-500 hover:text-red-700 transition flex-shrink-0" aria-label={`Remover ${doc.fileName}`}>
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                )) : <p className="text-gray-500">Ainda não carregou nenhum exame.</p>}
            </div>
        </div>
    );
}

// --- MAIN COMPONENT ---
interface HealthDashboardProps {
    activities: Activity[]; onActivitiesChange: (activities: Activity[]) => void;
    bodyComposition: BodyComposition | null; onBodyCompositionChange: (data: BodyComposition | null) => void;
    symptoms: SymptomLog[]; onSymptomsChange: (symptoms: SymptomLog[]) => void;
    medicalDocuments: MedicalDocument[]; onMedicalDocumentsChange: (documents: MedicalDocument[]) => void;
    medicationLogs: MedicationLog[]; onMedicationLogsChange: (logs: MedicationLog[]) => void;
}

const HealthDashboard: React.FC<HealthDashboardProps> = (props) => {
    const [activeSubTab, setActiveSubTab] = useState<HealthSubTab>('overview');

    const getSubTabClassName = (tabName: HealthSubTab) => {
        const base = 'px-4 py-2 text-sm font-semibold rounded-md transition-colors';
        if (activeSubTab === tabName) return `${base} bg-emerald-600 text-white`;
        return `${base} bg-gray-100 text-gray-700 hover:bg-gray-200`;
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Painel de Saúde</h2>
            <nav className="flex flex-wrap gap-2">
                <button onClick={() => setActiveSubTab('overview')} className={getSubTabClassName('overview')}>Visão Geral</button>
                <button onClick={() => setActiveSubTab('activity')} className={getSubTabClassName('activity')}>Atividade Física</button>
                <button onClick={() => setActiveSubTab('symptoms')} className={getSubTabClassName('symptoms')}>Sintomas</button>
                <button onClick={() => setActiveSubTab('medication')} className={getSubTabClassName('medication')}>Medicação</button>
                <button onClick={() => setActiveSubTab('documents')} className={getSubTabClassName('documents')}>Documentos</button>
            </nav>

            <div className="pt-4 border-t">
                {activeSubTab === 'overview' && <OverviewTab {...props} />}
                {activeSubTab === 'activity' && <ActivityLog activities={props.activities} onActivitiesChange={props.onActivitiesChange} />}
                {activeSubTab === 'symptoms' && <SymptomTracker symptoms={props.symptoms} onSymptomsChange={props.onSymptomsChange} />}
                {activeSubTab === 'medication' && <MedicationTracker logs={props.medicationLogs} onLogsChange={props.onMedicationLogsChange} />}
                {activeSubTab === 'documents' && <MedicalDocumentsManager medicalDocuments={props.medicalDocuments} onMedicalDocumentsChange={props.onMedicalDocumentsChange} />}
            </div>
        </div>
    );
};

const OverviewTab: React.FC<HealthDashboardProps> = ({ activities, onActivitiesChange, bodyComposition, onBodyCompositionChange }) => {
    const [isParsingReport, setIsParsingReport] = useState(false);
    const [csvStatus, setCsvStatus] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const handleActivityFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setCsvStatus(null);
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const { activities: newActivities, errorLog } = parseActivityCSV(text);
            if (newActivities.length === 0 && errorLog.length > 0) return setCsvStatus({ message: `Erro: ${errorLog[0]}`, type: 'error' });

            const existingDates = new Set(activities.map(a => a.date));
            const uniqueNewActivities = newActivities.filter(a => !existingDates.has(a.date));
            const duplicates = newActivities.length - uniqueNewActivities.length;

            onActivitiesChange([...uniqueNewActivities, ...activities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            setCsvStatus({ message: `Importado! ${uniqueNewActivities.length} novas atividades adicionadas. ${duplicates} duplicados ignorados.`, type: 'success'});
        };
        reader.readAsText(file);
    };

    const handleBodyCompositionUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsParsingReport(true);
        try {
            const base64Image = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve((reader.result as string).split(',')[1]);
                reader.onerror = error => reject(error);
                reader.readAsDataURL(file);
            });
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [{ inlineData: { mimeType: file.type, data: base64Image } }, { text: `Analise a imagem do relatório Arboleaf e extraia os dados no formato JSON. A data é "31/08/2025 10:25", formate como YYYY-MM-DD.` }] },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            date: { type: Type.STRING }, weightKg: { type: Type.NUMBER }, heightCm: { type: Type.NUMBER }, age: { type: Type.NUMBER },
                            bodyFatMassKg: { type: Type.NUMBER }, skeletalMuscleMassKg: { type: Type.NUMBER }, bmi: { type: Type.NUMBER }, bodyFatPercentage: { type: Type.NUMBER },
                            fitnessScore: { type: Type.NUMBER }, weightControlKg: { type: Type.NUMBER }, fatMassControlKg: { type: Type.NUMBER }, muscleControlKg: { type: Type.NUMBER },
                            metabolicAge: { type: Type.NUMBER }, normalRanges: { type: Type.OBJECT, properties: { weightKg: { type: Type.STRING }, skeletalMuscleMassKg: { type: Type.STRING }, bodyFatMassKg: { type: Type.STRING }, bmi: { type: Type.STRING }, bodyFatPercentage: { type: Type.STRING } } },
                        },
                    },
                },
            });
            
            onBodyCompositionChange(JSON.parse(response.text) as BodyComposition);

        } catch (error) {
            console.error("Error processing body composition report:", error);
            alert("Ocorreu um erro ao processar o seu relatório.");
        } finally {
            setIsParsingReport(false);
            event.target.value = '';
        }
    };
    
    return (
        <div className="space-y-8">
             <div className="p-4 bg-gray-50 rounded-lg border">
                 <h3 className="text-xl font-semibold text-gray-700 mb-4">Importar Dados</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">Atividade (Garmin)</h4>
                        <p className="text-sm text-gray-600 mb-4">Carregue o seu ficheiro .csv do Garmin Connect.</p>
                        <input type="file" accept=".csv" onChange={handleActivityFileUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"/>
                        {csvStatus && <p className={`text-sm mt-2 ${csvStatus.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>{csvStatus.message}</p>}
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">Composição Corporal (Arboleaf)</h4>
                        <p className="text-sm text-gray-600 mb-4">Carregue uma imagem (.png, .jpg) do seu relatório Arboleaf.</p>
                        <input type="file" accept="image/png, image/jpeg" onChange={handleBodyCompositionUpload} disabled={isParsingReport} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 disabled:opacity-50"/>
                        {isParsingReport && <p className="text-sm text-emerald-600 mt-2 animate-pulse">A analisar a imagem com IA...</p>}
                    </div>
                </div>
            </div>
            
            <BodyCompositionDisplay data={bodyComposition} />
        </div>
    );
};


export default HealthDashboard;
