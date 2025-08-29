import React, { useMemo, useState } from 'react';
import type { WeeklyPlan, FoodItem } from '../types';

interface ShoppingListProps {
  plan: WeeklyPlan;
}

interface AggregatedItem {
  food: FoodItem;
  totalAmount: number;
}

interface GroupedShoppingList {
  [category: string]: AggregatedItem[];
}

const ShoppingList: React.FC<ShoppingListProps> = ({ plan }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copiar Itens Pendentes');
  const [purchasedItems, setPurchasedItems] = useState<Set<string>>(new Set());

  const groupedList = useMemo(() => {
    const aggregatedItems = new Map<string, AggregatedItem>();

    Object.values(plan).forEach(dayPlan => {
      Object.values(dayPlan).forEach(meal => {
        meal.forEach(mealItem => {
          const { food, currentAmount } = mealItem;
          const existing = aggregatedItems.get(food.id);
          if (existing) {
            existing.totalAmount += currentAmount;
          } else {
            aggregatedItems.set(food.id, {
              food: food,
              totalAmount: currentAmount,
            });
          }
        });
      });
    });

    const grouped = Array.from(aggregatedItems.values()).reduce((acc, item) => {
      const { category } = item.food;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as GroupedShoppingList);

    // Sort items within each category alphabetically
    for (const category in grouped) {
      grouped[category].sort((a, b) => a.food.name.localeCompare(b.food.name));
    }

    return grouped;
  }, [plan]);

  const isListEmpty = Object.keys(groupedList).length === 0;

  const handleTogglePurchased = (foodId: string) => {
    setPurchasedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(foodId)) {
        newSet.delete(foodId);
      } else {
        newSet.add(foodId);
      }
      return newSet;
    });
  };

  const handleClearPurchased = () => {
    if (window.confirm('Tem a certeza que quer limpar todos os itens comprados?')) {
      setPurchasedItems(new Set());
    }
  };


  const generatePlainTextList = () => {
    let text = "A Minha Lista de Compras Semanal (Itens Pendentes)\n====================================================\n\n";
    let hasItemsToBuy = false;
    Object.entries(groupedList).sort(([a], [b]) => a.localeCompare(b)).forEach(([category, items]) => {
      const itemsToBuy = items.filter(item => !purchasedItems.has(item.food.id));
      if (itemsToBuy.length > 0) {
        hasItemsToBuy = true;
        text += `${category.toUpperCase()}\n`;
        itemsToBuy.forEach(item => {
          text += `- ${item.food.name}: ${item.totalAmount} ${item.food.unit}\n`;
        });
        text += "\n";
      }
    });
    return hasItemsToBuy ? text.trim() : "Todos os itens foram comprados!";
  };

  const handleCopyToClipboard = () => {
    const textToCopy = generatePlainTextList();
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopyButtonText('Copiado!');
      setTimeout(() => setCopyButtonText('Copiar Itens Pendentes'), 2000);
    }).catch(err => {
      console.error('Failed to copy list: ', err);
      setCopyButtonText('Erro!');
    });
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Lista de Compras Semanal</h2>
          <p className="mt-2 text-gray-600">
            Marque os itens à medida que os compra. A lista de cópia incluirá apenas os itens pendentes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
           <button
            onClick={handleClearPurchased}
            disabled={purchasedItems.size === 0}
            className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 disabled:bg-gray-300 transition-colors"
          >
            Limpar Comprados
          </button>
          <button
            onClick={handleCopyToClipboard}
            disabled={isListEmpty}
            className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 transition-colors"
          >
            {copyButtonText}
          </button>
        </div>
      </div>
      
      {isListEmpty ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-gray-500">A sua lista de compras está vazia.</p>
          <p className="text-sm text-gray-400 mt-2">Adicione refeições ao seu plano semanal para começar.</p>
        </div>
      ) : (
        <div id="shopping-list-content" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Object.entries(groupedList).sort(([a], [b]) => a.localeCompare(b)).map(([category, items]) => {
            const toBuyItems = items.filter(item => !purchasedItems.has(item.food.id));
            const purchasedListItems = items.filter(item => purchasedItems.has(item.food.id));

            if (items.length === 0) return null;

            return (
              <div key={category} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-700 mb-3 border-b pb-2">{category}</h3>
                <ul className="space-y-2">
                  {toBuyItems.map(item => (
                    <li key={item.food.id} className="flex items-center">
                      <input 
                        type="checkbox" 
                        id={`item-${item.food.id}`} 
                        checked={false} 
                        onChange={() => handleTogglePurchased(item.food.id)}
                        className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <label htmlFor={`item-${item.food.id}`} className="ml-3 flex justify-between w-full text-sm cursor-pointer">
                        <span className="font-medium text-gray-800">{item.food.name}</span>
                        <span className="text-gray-600 font-mono">{item.totalAmount} {item.food.unit}</span>
                      </label>
                    </li>
                  ))}
                  {purchasedListItems.length > 0 && (
                     <>
                      {toBuyItems.length > 0 && <hr className="my-3 border-gray-300" />}
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-2 mb-1">Comprados</h4>
                       {purchasedListItems.map(item => (
                         <li key={item.food.id} className="flex items-center opacity-60">
                            <input 
                              type="checkbox" 
                              id={`item-${item.food.id}`} 
                              checked={true} 
                              onChange={() => handleTogglePurchased(item.food.id)}
                              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                            />
                            <label htmlFor={`item-${item.food.id}`} className="ml-3 flex justify-between w-full text-sm cursor-pointer">
                              <span className="font-medium text-gray-800 line-through">{item.food.name}</span>
                              <span className="text-gray-600 font-mono line-through">{item.totalAmount} {item.food.unit}</span>
                            </label>
                         </li>
                       ))}
                     </>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShoppingList;
