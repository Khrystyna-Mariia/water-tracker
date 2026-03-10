import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import App from './App';

describe('Water Tracker Logic', () => {
  
  // Перед кожним тестом очищуємо LocalStorage
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  // Тест 1: Початковий стан
  it('відображає початкову кількість води (0 мл)', () => {
    render(<App />);
    expect(screen.getByText(/0 \/ 2000 мл/i)).toBeInTheDocument();
  });

  // Тест 2: Додавання води
  it('збільшує кількість води на 250 мл при натисканні кнопки +', () => {
    render(<App />);
    const addButton = screen.getByText(/\+ 250 мл/i);
    fireEvent.click(addButton);
    expect(screen.getByText(/250 \/ 2000 мл/i)).toBeInTheDocument();
  });

  // Тест 3: Видалення води (Assertion)
  it('зменшує кількість води при натисканні кнопки -', () => {
    render(<App />);
    const addButton = screen.getByText(/\+ 250 мл/i);
    const removeButton = screen.getByText(/- 250 мл/i); // назва тут
    
    fireEvent.click(addButton); 
    fireEvent.click(removeButton); // і тут тепер однакова
    
    expect(screen.getByText(/0 \/ 2000 мл/i)).toBeInTheDocument();
  });

  // Тест 4: Запобігання від'ємним значенням (Логіка)
  it('не дозволяє кількості води бути меншою за 0', () => {
    render(<App />);
    const removeButton = screen.getByText(/- 250 мл/i);
    fireEvent.click(removeButton);
    expect(screen.getByText(/0 \/ 2000 мл/i)).toBeInTheDocument();
  });

  // Тест 5: Скидання (Reset)
  it('скидає прогрес до нуля при натисканні "Скинути день"', () => {
    render(<App />);
    const addButton = screen.getByText(/\+ 250 мл/i);
    const resetButton = screen.getByText(/Скинути день/i);
    
    fireEvent.click(addButton);
    fireEvent.click(resetButton);
    
    expect(screen.getByText(/0 \/ 2000 мл/i)).toBeInTheDocument();
  });

  // Тест 6: Робота з Mock (LocalStorage)
  it('зберігає дані в localStorage при зміні значення', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    render(<App />);
    
    const addButton = screen.getByText(/\+ 250 мл/i);
    fireEvent.click(addButton);

    // Перевіряємо останній виклик (lastCalledWith), бо перший при завантаженні - це 0
    expect(setItemSpy).toHaveBeenLastCalledWith('waterVolume', 250); 
  });

  // Тест 7: Відображення порад (Unit-тест окремого компонента)
  it('відображає список порад у компоненті Tips', () => {
    render(<App />);
    expect(screen.getByText(/Пийте склянку води відразу після пробудження/i)).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });
  it('відновлює значення води з localStorage при першому рендері', () => {
  // Імітуємо наявність даних у пам'яті до завантаження компонента
  localStorage.setItem('waterVolume', '1000');
  
  render(<App />);
  
  // Перевіряємо, чи компонент підхопив 1000 мл замість 0
  expect(screen.getByText(/1000 \/ 2000 мл/i)).toBeInTheDocument();
});

});
