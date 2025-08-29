
import React, { useState } from 'react';
import type { MealSlot, ShuffleOption } from '../types';
import { MealSlot as MealSlotEnum } from '../types';


interface MealShufflerProps {
  onShuffle: (slot: ShuffleOption) => void;
}

const SHUFFLE_OPTIONS: ShuffleOption[] = [
  MealSlotEnum.BREAKFAST,
  MealSlotEnum.LUNCH,
  MealSlotEnum.DINNER,
  'Sopa',
  MealSlotEnum.AFTERNOON_SNACK,
  MealSlotEnum.SNACKS,
];

const MealShuffler: React.FC<MealShufflerProps> = ({ onShuffle }) => {
  const [selectedSlot, setSelectedSlot] = useState<ShuffleOption>(MealSlotEnum.LUNCH);

  const getSlotButtonClassName = (slot: ShuffleOption) => {
    const baseClasses = 'px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500';
    if (selectedSlot === slot) {
      return `${baseClasses} bg-emerald-600 text-white shadow`;
    }
    return `${baseClasses} bg-white text-gray-600 hover:bg-gray-100`;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-700">Sente-se Aventureiro?</h2>
          <p className="text-sm text-gray-600 mt-1">
            Selecione um tipo de refeição e deixe-nos criar uma refeição aleatória, compatível com a dieta baixa em FODMAPs, para si.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="flex-shrink-0 flex flex-wrap justify-center gap-2 bg-gray-200 p-1 rounded-lg w-full sm:w-auto">
              {SHUFFLE_OPTIONS.map(slot => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={getSlotButtonClassName(slot)}
                  aria-pressed={selectedSlot === slot}
                >
                  {slot}
                </button>
              ))}
            </div>
          <button
            onClick={() => onShuffle(selectedSlot)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-600 transition-all duration-200 shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 3a1 1 0 011 1v1.333a1 1 0 01-2 0V4a1 1 0 011-1zm6.707 3.293a1 1 0 010 1.414l-2.828 2.829a1 1 0 01-1.414-1.414l2.828-2.829a1 1 0 011.414 0zm-10.113 0a1 1 0 011.414 0l2.828 2.829a1 1 0 11-1.414 1.414L6.592 7.707a1 1 0 010-1.414zM4 10a1 1 0 011-1h1.333a1 1 0 110 2H5a1 1 0 01-1-1zm10.333 1.333a1 1 0 100-2H15a1 1 0 100 2h-0.667zM7.707 13.408a1 1 0 010-1.414l2.828-2.829a1 1 0 111.414 1.414l-2.828 2.829a1 1 0 01-1.414 0zm2.885 2.885a1 1 0 01-1.414 0l-2.828-2.829a1 1 0 011.414-1.414l2.828 2.829a1 1 0 010 1.414zM10 16a1 1 0 01-1-1v-1.333a1 1 0 112 0V15a1 1 0 01-1 1z" />
            </svg>
            Gerar Refeição Aleatória
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealShuffler;