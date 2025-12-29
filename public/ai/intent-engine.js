export function detectIntent(input) {
  if (/m\/s|kg|N/.test(input)) return 'physics';
  if (/[+\-*/]/.test(input)) return 'math';
  return 'unknown';
}
