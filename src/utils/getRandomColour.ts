export const getRandomColor = () => {
  const colors = [
    '#30bced',
    '#6eeb83',
    '#ffb347',
    '#a485e9',
    '#f47676',
    '#ff8855',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};