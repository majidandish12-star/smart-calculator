const keys = [
  'C','÷','×','−',
  '7','8','9','+',
  '4','5','6','.',
  '1','2','3','=',
  '0'
];

function renderKeys(container) {
  keys.forEach(k => {
    const b = document.createElement('button');
    b.textContent = k;
    if (['÷','×','−','+'].includes(k)) b.classList.add('op');
    if (k === '=') b.classList.add('equal');
    if (k === 'C') b.classList.add('clear');
    container.appendChild(b);
  });
}

window.renderKeys = renderKeys;
