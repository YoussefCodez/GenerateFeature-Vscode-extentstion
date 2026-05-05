/**
 * Converts a string to snake_case.
 * "auth profile" → "auth_profile"
 * "AuthProfile" → "auth_profile"
 */
export function toSnakeCase(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s\-]+/g, '_')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Converts a string to PascalCase.
 * "auth_profile" → "AuthProfile"
 * "auth profile" → "AuthProfile"
 */
export function toPascalCase(input: string): string {
  return toSnakeCase(input)
    .split('_')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Replaces template placeholders in a string.
 * {{feature_name}} → snake_case name
 * {{FeatureName}} → PascalCase name
 */
export function replacePlaceholders(
  template: string,
  featureName: string,
): string {
  const snake = toSnakeCase(featureName);
  const pascal = toPascalCase(featureName);

  return template
    .replace(/\{\{feature_name\}\}/g, snake)
    .replace(/\{\{FeatureName\}\}/g, pascal);
}

/**
 * Validates a feature name.
 * Returns an error message if invalid, or undefined if valid.
 */
export function validateFeatureName(name: string): string | undefined {
  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return 'Feature name cannot be empty';
  }

  if (trimmed.length > 64) {
    return 'Feature name is too long (max 64 characters)';
  }

  // After conversion, must be a valid directory name
  const snake = toSnakeCase(trimmed);
  if (snake.length === 0) {
    return 'Feature name must contain at least one letter or number';
  }

  if (/^[0-9]/.test(snake)) {
    return 'Feature name should not start with a number';
  }

  return undefined;
}

/**
 * Validates a custom layer name.
 * Returns an error message if invalid, or undefined if valid.
 */
export function validateLayerName(name: string): string | undefined {
  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return 'Layer name cannot be empty';
  }

  const snake = toSnakeCase(trimmed);
  if (snake.length === 0) {
    return 'Layer name must contain at least one letter or number';
  }

  return undefined;
}
