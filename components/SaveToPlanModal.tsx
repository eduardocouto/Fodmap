
import React, { useState, useEffect } from 'react';
import type { MealItem, MealSlot } from '../types';
import { MealSlot as MealSlotEnum } from '../types';

interface SaveToPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (days: string[], slot: MealSlot) => void;
  currentMeal: MealItem[];
}

const DAYS_OF_WEEK = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
const MEAL_SLOTS = [MealSlotEnum.BREAKFAST, MealSlotEnum.LUNCH, MealSlotEnum.AFTERNOON_SNACK, MealSlotEnum.DINNER, MealSlotEnum.SNACKS];

const SaveToPlanModal: React.FC<SaveToPlanModalProps> = ({ isOpen, onClose, onSave, currentMeal }) => {
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set());
  const [selectedSlot, setSelectedSlot] = useState<MealSlot>(MEAL_SLOTS[0]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDayToggle = (day: string) => {
    setSelectedDays(prevDays => {
      const newDays = new Set(prevDays);
      if (newDays.has(day)) {
        newDays.delete(day);
      } else {
        newDays.add(day);
      }
      return newDays;
    });
  };

  const handleSelectAll = () => setSelectedDays(new Set(DAYS_OF_WEEK));
  const handleDeselectAll = () => setSelectedDays(new Set());

  const handleSave = () => {
    onSave(Array.from(selectedDays), selectedSlot);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div 
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md m-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Guardar Refeição no Plano</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dia(s) da Semana
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {DAYS_OF_WEEK.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors font-medium ${
                    selectedDays.has(day)
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
             <div className="flex space-x-4 mt-2">
                <button onClick={handleSelectAll} className="text-sm font-medium text-emerald-600 hover:text-emerald-800 transition">Selecionar Todos</button>
                <button onClick={handleDeselectAll} className="text-sm font-medium text-gray-500 hover:text-gray-700 transition">Desselecionar Todos</button>
            </div>
          </div>

          <div>
            <label htmlFor="slot-select" className="block text-sm font-medium text-gray-700">
              Refeição
            </label>
            <select
              id="slot-select"
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value as MealSlot)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
            >
              {MEAL_SLOTS.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 p-3 rounded-md border">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Refeição a Guardar:</h3>
            {currentMeal.length > 0 ? (
              <ul className="text-sm text-gray-800 list-disc list-inside space-y-1 max-h-32 overflow-y-auto">
                {currentMeal.map(item => (
                  <li key={item.instanceId}>{item.food.name} ({item.currentAmount}{item.food.unit})</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">A sua refeição está vazia.</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={currentMeal.length === 0 || selectedDays.size === 0}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Guardar Refeição
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveToPlanModal;