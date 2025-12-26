here// ui.js
// 🎛️ UI Controller for Smart Calculator

document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("display");
  const buttons = document.querySelectorAll("button");

  const calculator = new SmartCalculator();

  function updateDisplay(value) {
    display.textContent = value;
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const val = btn.textContent;

      switch (val) {
        case "C":
          updateDisplay(calculator.clear());
          break;

        case "=":
          updateDisplay(calculator.calculate());
          break;

        default:
          updateDisplay(calculator.append(val));
      }
    });
  });
});
