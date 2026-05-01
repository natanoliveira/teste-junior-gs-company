const colorMap: Record<string, string> = {
  red: 'bg-red-100 text-red-600',
  green: 'bg-green-100 text-green-600',
  blue: 'bg-blue-100 text-blue-600',
  yellow: 'bg-yellow-100 text-yellow-700',
  purple: 'bg-purple-100 text-purple-600',
  pink: 'bg-pink-100 text-pink-600',
};

const fallbackColors = Object.values(colorMap);

export function getTagClass(tagName: string, colorByName?: Record<string, string>): string {
  const color = colorByName?.[tagName];
  if (color && colorMap[color]) return colorMap[color];

  // fallback determinístico pela soma dos char codes do nome
  const index = tagName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return fallbackColors[index % fallbackColors.length];
}
