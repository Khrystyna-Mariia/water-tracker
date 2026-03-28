import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import App from './App';

// 1. Мокаємо Sentry (щоб тести не падали через виклики Sentry.setUser)
vi.mock('@sentry/react', () => ({
  setUser: vi.fn(),
  init: vi.fn(),
  browserTracingIntegration: vi.fn(),
  replayIntegration: vi.fn(),
}));

// Мокаємо posthog
vi.mock('posthog-js', () => ({
  default: {
    capture: vi.fn(),
  },
}));

describe('Water Tracker Logic (Custom Input Version)', () => {
  
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    // Створюємо фейкового користувача в localStorage
    // Це дозволить тестам "проскочити" екран логіну
    const mockUser = { id: '123', name: 'Test User', email: 'test@example.com' };
    localStorage.setItem('app_user', JSON.stringify(mockUser));
  });

  it('відображає початкову кількість води (0 мл) та дефолтне значення в інпуті', () => {
    render(<App />);
    // Використовуємо функцію або окремі пошуки, щоб уникнути проблем з <strong>
    expect(screen.getByText(/0/i, { selector: 'strong' })).toBeInTheDocument();
    expect(screen.getByText(/2000 мл/i)).toBeInTheDocument();
    expect(screen.getByRole('spinbutton')).toHaveValue(250);
  });

  it('збільшує кількість води на значення з інпуту при натисканні + Додати', () => {
    render(<App />);
    const input = screen.getByRole('spinbutton');
    const addButton = screen.getByText(/\+ Додати/i);

    fireEvent.change(input, { target: { value: '500' } });
    fireEvent.click(addButton);

    expect(screen.getByText(/500/i, { selector: 'strong' })).toBeInTheDocument();
    expect(screen.getByText(/Випито склянок: 2/i)).toBeInTheDocument();
  });

  it('зменшує кількість води на вказане значення', () => {
    render(<App />);
    const input = screen.getByRole('spinbutton');
    const addButton = screen.getByText(/\+ Додати/i);
    const removeButton = screen.getByText(/- Видалити/i);

    fireEvent.change(input, { target: { value: '1000' } });
    fireEvent.click(addButton);
    
    fireEvent.change(input, { target: { value: '250' } });
    fireEvent.click(removeButton);

    expect(screen.getByText(/750/i, { selector: 'strong' })).toBeInTheDocument();
  });

  it('не дозволяє кількості води бути меншою за 0', () => {
    render(<App />);
    const removeButton = screen.getByText(/- Видалити/i);
    fireEvent.click(removeButton);
    expect(screen.getByText(/0/i, { selector: 'strong' })).toBeInTheDocument();
  });

  it('зберігає значення інпуту в localStorage', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    render(<App />);
    
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '400' } });

    expect(setItemSpy).toHaveBeenCalledWith('lastInputValue', '400');
  });

  it('валідує некоректні значення (наприклад, завеликі)', () => {
    window.alert = vi.fn(); 
    render(<App />);
    const input = screen.getByRole('spinbutton');
    const addButton = screen.getByText(/\+ Додати/i);

    fireEvent.change(input, { target: { value: '5000' } });
    fireEvent.click(addButton);

    expect(window.alert).toHaveBeenCalled();
    expect(screen.getByText(/0/i, { selector: 'strong' })).toBeInTheDocument();
  });
});