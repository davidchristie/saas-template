export function requiredVariable(name: string): string {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`${name} must be defined`);
  }
  return value;
}
