export function constrainNumber(value, { min = null, max = null } = {}) {
  if (
    min == null ||
    max == null ||
    typeof min !== "number" ||
    typeof max !== "number"
  )
    throw new Error("provide a number for both min and max value");

  if (value < min) return min;
  if (value > max) return max;
  return value;
}
