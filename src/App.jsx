import { useState, useEffect } from 'react'
import './App.css'
import Tips from './Tips'
import posthog from 'posthog-js'

function App() {
  //  При завантаженні намагаємось взяти дані з пам'яті, якщо їх немає — ставимо 0
  const [water, setWater] = useState(() => {
    const saved = localStorage.getItem('waterVolume');
    return saved ? parseInt(saved) : 0;
  });

  const goal = 2000;

  // спрацьовує, коли змінюється змінна 'water'
  useEffect(() => {
    localStorage.setItem('waterVolume', water);
  }, [water]);

  const addWater = () => {
    const newAmount = water + 250;
    setWater(newAmount);

    posthog.capture('water_added', {
      amount: 250,
      total_now: newAmount,
      goal_reached: newAmount >= goal
    });
  };
  const removeWater = () => {
    if (water > 0) {
      const newAmount = water - 250;
      setWater(newAmount);

      posthog.capture('water_removed', {
        reason: 'correction',
        removed_amount: 250
      });
    }
  };
  const resetWater = () => {
    posthog.capture('day_reset', {
      final_volume: water,
      percentage_reached: Math.round((water / goal) * 100)
    });
    setWater(0);
  };

  const progressPercentage = Math.min((water / goal) * 100, 100);

  return (
    <div className="app-container">
      <div className="status-banner">
        <p>Статус: {import.meta.env.VITE_APP_STATUS}</p>
      </div>
      <h1>🌊 Water Balance </h1>
      <div className="status-board">
        <p className="amount">{water} / {goal} мл</p>
        <p>Випито склянок: {Math.floor(water / 250)}</p>
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="percentage">{Math.round(progressPercentage)}% виконано</p>
      </div>
      <div className="buttons-group">
        <button onClick={addWater} className="btn-add">+ 250 мл</button>
        <button onClick={removeWater} className="btn-remove">- 250 мл</button>
      </div>
      <Tips />
      <button onClick={resetWater} className="btn-reset">Скинути день</button>
    </div>
  )
}

export default App