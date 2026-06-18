export const operatorLabels = {
  '+': '+',
  '-': '-',
  '*': 'x',
  '/': '÷',
};

export const calculate = (firstValue, secondValue, operator) => {
  const first = Number(firstValue);
  const second = Number(secondValue);

  switch (operator) {
    case '+':
      return first + second;
    case '-':
      return first - second;
    case '*':
      return first * second;
    case '/':
      return second === 0 ? 'Error' : first / second;
    default:
      return second;
  }
};

export const formatDisplay = (value) => {
  if (value === 'Error') {
    return value;
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 'Error';
  }

  return Number.isInteger(numericValue)
    ? String(numericValue)
    : String(Number(numericValue.toFixed(8)));
};
