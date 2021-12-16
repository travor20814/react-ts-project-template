import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

function render(): void {
  const root = document.getElementById('root');

  if (root) {
    ReactDOM.render(
      <App />,
      root,
    );
  }
}

export async function init(): Promise<void> {
  render();
}

init();
