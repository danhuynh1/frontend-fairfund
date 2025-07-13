import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

/**
 * Generates shades of a color within a specific hue range.
 * @param {number} count - The number of colors to generate.
 * @param {object} options - Configuration for the color generation.
 * @param {number} options.startHue - The starting hue (e.g., 80 for yellow-green).
 * @param {number} options.endHue - The ending hue (e.g., 160 for blue-green).
 * @param {number} options.saturation - The color saturation (0-100).
 * @param {number} options.lightness - The color lightness (0-100).
 * @returns {string[]} An array of HSL color strings.
 */
const generateHslShades = (
  count,
  { startHue = 80, endHue = 160, saturation = 70, lightness = 50 } = {}
) => {
  const colors = [];
  // If only one color, just use the start hue
  if (count === 1) {
    return [`hsl(${startHue}, ${saturation}%, ${lightness}%)`];
  }

  const hueRange = endHue - startHue;
  const hueStep = hueRange / (count - 1); // Step between colors

  for (let i = 0; i < count; i++) {
    const hue = startHue + i * hueStep;
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  return colors;
};

const ActivityPieChart = ({ data }) => {
  // Generate shades of green based on the data length
  const COLORS = generateHslShades(data.length);

  return (
    <PieChart width={400} height={300}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label={(entry) => `$${entry.value}`}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index]} />
        ))}
      </Pie>
      <Tooltip formatter={(value) => `$${value}`} />
      <Legend />
    </PieChart>
  );
};
export default ActivityPieChart;
