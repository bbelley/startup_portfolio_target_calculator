import React from 'react';
import ReactDOM from 'react-dom';
import LoadingPage from './components/LoadingPage';

const jsx = (
    <CalcLimitApp />
);
let hasRendered = false;
const renderApp = () => {
  if (!hasRendered) {
    ReactDOM.render(jsx, document.getElementById('app'));
    hasRendered = true;
  }
};

ReactDOM.render(<LoadingPage />, document.getElementById('app'));
