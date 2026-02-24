import { useState, useEffect } from 'react'
import './App.css'
import Tips from './Tips'

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

  const addWater = () => setWater(water + 250);
  const removeWater = () => setWater(water > 0 ? water - 250 : 0);
  const resetWater = () => setWater(0);

  const progressPercentage = Math.min((water / goal) * 100, 100);

  return (
    <div className="app-container">
      <h1>🌊 Water Balance </h1>
      <div className="status-board">
        <p className="amount">{water} / {goal} мл</p>
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