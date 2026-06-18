function CalculatorButton({ button, onClick }) {
  const className = [
    'key',
    button.type === 'operator' || button.type === 'equals' ? 'key-operator' : '',
    button.type === 'clear' ? 'key-clear' : '',
    button.wide ? 'key-wide' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={className} onClick={() => onClick(button)} type="button">
      {button.label}
    </button>
  );
}

export default CalculatorButton;
