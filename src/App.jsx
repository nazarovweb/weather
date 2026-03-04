import React from 'react';
import Weather from './Weather';

function App() {
  return (
    <div className="min-h-screen py-12 px-4">
      <header className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-black bg-gradient-header text-transparent mb-4">
          Atmospheary
        </h1>
        <p className="text-slate-400 text-lg tracking-widest uppercase">
          Precision Weather Forecasting
        </p>
      </header>

      <main>
        <Weather />
      </main>

      <footer className="mt-20 text-center text-slate-500 text-sm">
        <p>© 2026 Atmospheary Design. Powered by OpenWeatherMap.</p>
      </footer>
    </div>
  );
}

export default App;