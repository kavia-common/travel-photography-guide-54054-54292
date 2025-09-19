import { render, screen } from '@testing-library/react';
import App from './App';

test('renders brand title', () => {
  render(<App />);
  const el = screen.getByText(/Travel Photo Search/i);
  expect(el).toBeInTheDocument();
});
