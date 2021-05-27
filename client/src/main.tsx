import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

function render() {
  const root = document.getElementById('root');

  if (root) {
    ReactDOM.render(
      <App />,
      root,
    );
  }
}

export async function init() {
  render();
}

init();
