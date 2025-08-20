export function getChangedFields<T extends Record<string, any>>(original: T, current: T): Partial<T> {
  const changed: Partial<T> = {};

  for (const key in current) {
    const originalValue = original[key];
    const currentValue = current[key];

    // Deep compare arrays and objects
    const isEqual = JSON.stringify(originalValue) === JSON.stringify(currentValue);

    if (!isEqual) {
      changed[key] = currentValue;
    }
  }

  return changed;
}
