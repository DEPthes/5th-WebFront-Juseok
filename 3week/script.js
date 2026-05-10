const display = document.querySelector("#display");
const history = document.querySelector("#history");
const keypad = document.querySelector(".calculator-keypad");

const operatorSymbols = {
  "+": "+",
  "-": "-",
  "*": "×",
  "/": "÷",
};

const initialDisplayText = "DEPth";
const maxInputValue = 999000099999999;

const state = {
  firstValue: null,
  operator: null,
  isIntroVisible: true,
  waitingForNextValue: false,
  shouldResetDisplay: false,
};

function updateDisplay(value) {
  display.textContent = value;
  display.classList.toggle("is-brand", value === initialDisplayText);
}

function updateHistory(value) {
  history.textContent = value;
}

function getDisplayValue() {
  return display.textContent;
}

function getIntegerPart(value) {
  return value.split(".")[0];
}

function isWithinMaxInputValue(value) {
  const numericValue = Number.parseFloat(value);

  return Number.isFinite(numericValue) && numericValue <= maxInputValue;
}

function canAddNumber(currentValue, number) {
  const nextValue = currentValue === "0" ? number : currentValue + number;

  return isWithinMaxInputValue(nextValue);
}

function inputNumber(number) {
  const currentValue = getDisplayValue();

  if (state.isIntroVisible || state.waitingForNextValue || state.shouldResetDisplay) {
    if (state.operator) {
      updateHistory(`${formatOperand(state.firstValue)} ${operatorSymbols[state.operator]}`);
    } else if (state.shouldResetDisplay) {
      updateHistory("");
    }

    updateDisplay(number === "00" ? "0" : number);
    state.isIntroVisible = false;
    state.waitingForNextValue = false;
    state.shouldResetDisplay = false;
    return;
  }

  if (!canAddNumber(currentValue, number)) return;

  if (currentValue === "0") {
    updateDisplay(number === "00" ? "0" : number);
    return;
  }

  updateDisplay(currentValue + number);
}

function inputDecimal() {
  const currentValue = getDisplayValue();

  if (state.isIntroVisible || state.waitingForNextValue || state.shouldResetDisplay) {
    if (state.operator) {
      updateHistory(`${formatOperand(state.firstValue)} ${operatorSymbols[state.operator]}`);
    } else if (state.shouldResetDisplay) {
      updateHistory("");
    }

    updateDisplay("0.");
    state.isIntroVisible = false;
    state.waitingForNextValue = false;
    state.shouldResetDisplay = false;
    return;
  }

  if (!currentValue.includes(".")) {
    updateDisplay(currentValue + ".");
  }
}

function calculate(firstValue, operator, secondValue) {
  if (operator === "+") return firstValue + secondValue;
  if (operator === "-") return firstValue - secondValue;
  if (operator === "*") return firstValue * secondValue;
  if (operator === "/") return secondValue === 0 ? "Error" : firstValue / secondValue;

  return secondValue;
}

function formatResult(result) {
  if (result === "Error") return result;

  return Number.parseFloat(result.toFixed(10)).toString();
}

function formatOperand(value) {
  if (value === null) return "";

  return Number.isInteger(value) ? value.toString() : value.toString();
}

function handleOperator(nextOperator) {
  const currentValue = Number.parseFloat(getDisplayValue());

  if (Number.isNaN(currentValue)) {
    clearCalculator();
    return;
  }

  if (state.operator && state.waitingForNextValue) {
    state.operator = nextOperator;
    updateHistory(`${formatOperand(state.firstValue)} ${operatorSymbols[nextOperator]}`);
    return;
  }

  if (state.firstValue === null) {
    state.firstValue = currentValue;
    updateHistory(`${formatOperand(state.firstValue)} ${operatorSymbols[nextOperator]}`);
  } else if (state.operator) {
    const previousValue = state.firstValue;
    const previousOperator = state.operator;
    const result = calculate(state.firstValue, state.operator, currentValue);
    const formattedResult = formatResult(result);

    updateDisplay(formattedResult);
    updateHistory(`${formatOperand(previousValue)} ${operatorSymbols[previousOperator]} ${formatOperand(currentValue)} =`);
    state.firstValue = result === "Error" ? null : Number.parseFloat(formattedResult);
  }

  state.operator = nextOperator;
  state.waitingForNextValue = true;
}

function handleEquals() {
  if (!state.operator || state.waitingForNextValue) return;

  const currentValue = Number.parseFloat(getDisplayValue());
  const result = calculate(state.firstValue, state.operator, currentValue);
  const formattedResult = formatResult(result);

  updateDisplay(formattedResult);
  updateHistory(`${formatOperand(state.firstValue)} ${operatorSymbols[state.operator]} ${formatOperand(currentValue)} =`);
  state.firstValue = null;
  state.operator = null;
  state.waitingForNextValue = false;
  state.shouldResetDisplay = true;
}

function deleteLastInput() {
  const currentValue = getDisplayValue();

  if (state.isIntroVisible) return;

  if (state.waitingForNextValue || state.shouldResetDisplay || currentValue.length === 1) {
    updateDisplay("0");
    state.isIntroVisible = false;
    state.waitingForNextValue = false;
    state.shouldResetDisplay = false;
    return;
  }

  updateDisplay(currentValue.slice(0, -1));
}

function clearCalculator() {
  state.firstValue = null;
  state.operator = null;
  state.isIntroVisible = true;
  state.waitingForNextValue = false;
  state.shouldResetDisplay = false;
  updateHistory("");
  updateDisplay(initialDisplayText);
}

function handleKeypadClick(event) {
  const button = event.target.closest("button");

  if (!button) return;

  if (button.dataset.number) {
    inputNumber(button.dataset.number);
    return;
  }

  if (button.dataset.operator) {
    handleOperator(button.dataset.operator);
    return;
  }

  if (button.dataset.action === "decimal") inputDecimal();
  if (button.dataset.action === "calculate") handleEquals();
  if (button.dataset.action === "delete") deleteLastInput();
  if (button.dataset.action === "clear") clearCalculator();
}

function handleKeyboardInput(event) {
  const handledKeys = ["+", "-", "*", "/", ".", "Enter", "=", "Backspace", "Escape"];
  const isNumberKey = /^[0-9]$/.test(event.key);

  if (!isNumberKey && !handledKeys.includes(event.key)) return;

  event.preventDefault();

  if (isNumberKey) inputNumber(event.key);
  if (["+", "-", "*", "/"].includes(event.key)) handleOperator(event.key);
  if (event.key === ".") inputDecimal();
  if (event.key === "Enter" || event.key === "=") handleEquals();
  if (event.key === "Backspace") deleteLastInput();
  if (event.key === "Escape") clearCalculator();
}

keypad.addEventListener("click", handleKeypadClick);
window.addEventListener("keydown", handleKeyboardInput);
