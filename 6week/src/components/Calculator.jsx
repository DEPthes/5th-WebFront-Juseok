import { useState } from 'react';
import CalculatorButton from './CalculatorButton.jsx';
import { buttons } from '../data/calculatorButtons.js';
import { calculate, formatDisplay, operatorLabels } from '../utils/calculator.js';

function Calculator() {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState('');
  const [storedValue, setStoredValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  const inputNumber = (number) => {
    if (display === 'Error' || shouldResetDisplay) {
      setDisplay(number === '00' ? '0' : number);
      setShouldResetDisplay(false);
      return;
    }

    if (display === '0') {
      setDisplay(number === '00' ? '0' : number);
      return;
    }

    setDisplay(`${display}${number}`);
  };

  const inputDecimal = () => {
    if (display === 'Error' || shouldResetDisplay) {
      setDisplay('0.');
      setShouldResetDisplay(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(`${display}.`);
    }
  };

  const chooseOperator = (nextOperator) => {
    if (display === 'Error') {
      return;
    }

    if (operator && !shouldResetDisplay) {
      const result = formatDisplay(calculate(storedValue, display, operator));
      setDisplay(result);
      setStoredValue(result);
      setHistory(`${result} ${operatorLabels[nextOperator]}`);
    } else {
      setStoredValue(display);
      setHistory(`${display} ${operatorLabels[nextOperator]}`);
    }

    setOperator(nextOperator);
    setShouldResetDisplay(true);
  };

  const resetCalculator = () => {
    setDisplay('0');
    setHistory('');
    setStoredValue(null);
    setOperator(null);
    setShouldResetDisplay(false);
  };

  const applyPercent = () => {
    if (display !== 'Error') {
      setDisplay(formatDisplay(Number(display) / 100));
    }
  };

  const runCalculation = () => {
    if (!operator || storedValue === null || shouldResetDisplay) {
      return;
    }

    const result = formatDisplay(calculate(storedValue, display, operator));
    setHistory(`${storedValue} ${operatorLabels[operator]} ${display} =`);
    setDisplay(result);
    setStoredValue(null);
    setOperator(null);
    setShouldResetDisplay(true);
  };

  const handleButtonClick = (button) => {
    if (button.type === 'number') {
      inputNumber(button.label);
    }

    if (button.type === 'decimal') {
      inputDecimal();
    }

    if (button.type === 'operator') {
      chooseOperator(button.value);
    }

    if (button.type === 'clear') {
      resetCalculator();
    }

    if (button.type === 'percent') {
      applyPercent();
    }

    if (button.type === 'equals') {
      runCalculation();
    }
  };

  return (
    <section className="calculator" aria-label="iOS 스타일 계산기">
      <h1>iOS Calculator</h1>

      <div className="display">
        <p className="history">{history}</p>
        <output className="result" aria-live="polite">
          {display}
        </output>
      </div>

      <div className="keypad">
        {buttons.map((button) => (
          <CalculatorButton
            button={button}
            key={button.label}
            onClick={handleButtonClick}
          />
        ))}
      </div>
    </section>
  );
}

export default Calculator;
