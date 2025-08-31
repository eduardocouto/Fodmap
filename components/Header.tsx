import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center min-w-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight truncate">
            IntelliGesto
          </h1>
        </div>
        <p className="text-sm text-emerald-700 font-medium text-center sm:text-right">O seu assistente inteligente para o bem-estar digestivo.</p>
      </div>
    </header>
  );
};

export default Header;