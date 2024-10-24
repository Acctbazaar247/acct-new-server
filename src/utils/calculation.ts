export default function findOriginalNumber(
  sum: number,
  percentage: number
): number {
  const factor = 1 + percentage / 100; // Convert percentage to multiplier (5% becomes 1.05)
  return sum / factor; // Divide the sum by the factor to get the original number
}
export function incrementByPercentage(
  value: number,
  percentage: number
): number {
  const factor = 1 + percentage / 100; // Convert percentage to multiplier
  return value * factor; // Multiply value by the factor to get the incremented value
}
