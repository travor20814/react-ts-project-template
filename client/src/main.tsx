import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

function render(): void {
  const root = document.getElementById('root');

  if (root) {
    createRoot(root).render(<App />);
  }
}

export async function init(): Promise<void> {
  render();
}

init();
