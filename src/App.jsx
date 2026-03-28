import { useState, useEffect } from 'react'
import './App.css'
import Tips from './Tips'
import posthog from 'posthog-js'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import confetti from 'canvas-confetti'
import * as Sentry from '@sentry/react'; 

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('app_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Синхронізація з Sentry при зміні користувача
  useEffect(() => {
    if (user) {
      Sentry.setUser({
        id: user.id,
        email: user.email,
        username: user.name
      });
      localStorage.setItem('app_user', JSON.stringify(user));
    } else {
      Sentry.setUser(null);
      localStorage.removeItem('app_user');
    }
  }, [user]);

  const handleMockLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get('username'),
      email: formData.get('email'),
    };
    setUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const [water, setWater] = useState(() => {
    const saved = localStorage.getItem('waterVolume');
    return saved ? parseInt(saved) : 0;
  });

  const [inputValue, setInputValue] = useState(() => {
    const savedInput = localStorage.getItem('lastInputValue');
    return savedInput ? savedInput : '250';
  });

  // Отримуємо стан прапорця з PostHog
  const isCelebrationEnabled = useFeatureFlagEnabled('celebration-mode');

  const goal = 2000;

  useEffect(() => {
    localStorage.setItem('waterVolume', water);
    localStorage.setItem('lastInputValue', inputValue);

    // Логіка celebration-mode
    if (isCelebrationEnabled && water >= goal) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#ea1c1c', '#6deb74', '#FFD700']
      });
    }
  }, [water, inputValue, isCelebrationEnabled]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (e.target.value.length === 1) {
      posthog.capture('started_typing_amount');
    }
  };

  const updateWater = (type) => {
    const amount = parseInt(inputValue);
    
    if (isNaN(amount) || amount <= 0 || amount > 3000) {
      alert("Введіть коректну кількість (1-3000 мл)");
      posthog.capture('action_failed', { reason: 'invalid_amount', type });
      return;
    }

    if (type === 'add') {
      const newAmount = water + amount;
      setWater(newAmount);
      posthog.capture('water_added', { 
        amount: amount, 
        total: newAmount,
        goal_reached: newAmount >= goal 
      });
    } else {
      const newAmount = water > amount ? water - amount : 0;
      setWater(newAmount);
      posthog.capture('water_removed', { amount: amount });
    }
  };

  const resetWater = () => {
    posthog.capture('day_reset', { final_volume: water });
    setWater(0);
  };

  const progressPercentage = Math.min((water / goal) * 100, 100);

  // Динамічний стиль для прогрес-бару (золотий, якщо прапорець увімкнено і мета досягнута)
  const barColor = (isCelebrationEnabled && water >= goal) ? '#FFD700' : '#3b82f6';

  return (
    <div className="app-container">
      {!user ? (
        <div className="login-overlay">
          <div className="login-card">
            <h1>🌊 Вхід у систему</h1>
            <form onSubmit={handleMockLogin}>
              <input name="username" placeholder="Ваше ім'я" required className="water-input" />
              <input name="email" type="email" placeholder="Ваш Email" required className="water-input" />
              <button type="submit" className="btn-add" style={{width: '100%', marginTop: '10px'}}>Увійти</button>
            </form>
          </div>
        </div>
      ) : (
        <div className="main-content">
          <div className="user-header">
            <span>{user.name} ({user.email})</span>
            <button onClick={() => setUser(null)} className="btn-logout-small">Вийти</button>
          </div>

      <div className="status-banner">
        <p>Статус: {import.meta.env.VITE_APP_STATUS}</p>
      </div>
      
      <h1>🌊 Water Balance</h1>

      <button
      onClick={() => {
        throw new Error('This is your first error!');
      }}>
      Break the world
      </button>

      {/* Показуємо вітання, якщо прапорець увімкнено */}
      {isCelebrationEnabled && water >= goal && (
        <div className="celebration-text">
          <h2>🌟 Ціль досягнута! 🌟</h2>
        </div>
      )}
      
      <div className="status-board">
        <p className="amount"><strong>{water}</strong> / {goal} мл</p>
        <p className="glasses-count">🥛 Випито склянок: {Math.floor(water / 250)}</p>
        
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ 
                width: `${progressPercentage}%`,
                backgroundColor: barColor, // Міняємо колір
                boxShadow: (isCelebrationEnabled && water >= goal) ? '0 0 15px #ffc800' : 'none'
            }}
          ></div>
        </div>
        <p className="percentage">{Math.round(progressPercentage)}% виконано</p>
      </div>

      <div className="control-section">
        <input 
          type="number" 
          value={inputValue} 
          onChange={handleInputChange} 
          className="water-input"
        />
        <div className="buttons-group">
          <button onClick={() => updateWater('add')} className="btn-add">+ Додати</button>
          <button onClick={() => updateWater('remove')} className="btn-remove">- Видалити</button>
        </div>
      </div>

      <Tips />
      <button onClick={resetWater} className="btn-reset">Скинути день</button>
    </div>
    )}
    </div>
  )
}

export default App