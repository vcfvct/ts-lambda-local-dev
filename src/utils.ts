export function flattenArraysInJSON(json: Record<string, any>): Record<string, any> {
  const flattenedJson = json;
  for (const [key, value] of Object.entries(json)) {
    if (Array.isArray(value)) {
      flattenedJson[key] = value.join(',');
    } else if (typeof value === 'object' && value !== null) {
      flattenedJson[key] = flattenArraysInJSON(value);
    } else {
      flattenedJson[key] = value;
    }
  }
  return flattenedJson;
}
