/**
 * Converts a string to CamelCase.
 * @param {string} input - The input string.
 * @returns {string} - The converted CamelCase string.
 */
function toCamelCase(input) {
	return input
		.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
		.replace(/^(.)/, (char) => char.toLowerCase());
}

/**
 * Converts a string to KebabCase.
 * @param {string} input - The input string.
 * @returns {string} - The converted KebabCase string.
 */
function toKebabCase(input) {
	return input
		.replace(/\s+/g, '-')
		.replace(/[_]+/g, '-')
		.replace(/([a-z\d])([A-Z])/g, '$1-$2')
		.replace(/-+/g, '-')
		.toLowerCase();
}

/**
 * Converts a string to PascalCase.
 * @param {string} input - The input string.
 * @returns {string} - The converted PascalCase string.
 */
function toPascalCase(input) {
	return input
		.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
		.replace(/^(.)/, (char) => char.toUpperCase());
}

/**
 * Converts a string to SnakeCase.
 * @param {string} input - The input string.
 * @returns {string} - The converted SnakeCase string.
 */
function toSnakeCase(input) {
	return input
		.replace(/\s+/g, '_')
		.replace(/-+/g, '_')
		.replace(/([a-z\d])([A-Z])/g, '$1_$2')
		.replace(/_+/g, '_')
		.toLowerCase();
}

/**
 * Converts a string to DotCase.
 * @param {string} input - The input string.
 * @returns {string} - The converted DotCase string.
 */
function toDotCase(input) {
	return input
		.replace(/\s+/g, '.')
		.replace(/[_]+/g, '.')
		.replace(/-+/g, '.')
		.replace(/([a-z\d])([A-Z])/g, '$1.$2')
		.replace(/\.{2,}/g, '.')
		.toLowerCase();
}

/**
 * Converts a string to ConstantCase.
 * @param {string} input - The input string.
 * @returns {string} - The converted ConstantCase string.
 */
function toConstantCase(input) {
	return input
		.replace(/\s+/g, '_')
		.replace(/-+/g, '_')
		.replace(/([a-z\d])([A-Z])/g, '$1_$2')
		.replace(/_+/g, '_')
		.toUpperCase();
}

export {
	toCamelCase,
	toKebabCase,
	toPascalCase,
	toSnakeCase,
	toDotCase,
	toConstantCase,
};
