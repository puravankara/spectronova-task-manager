const avatarPalette = [
  '#635BFF',
  '#8B5CF6',
  '#3B82F6',
  '#06B6D4',
  '#14B8A6',
  '#10B981',
  '#84CC16',
  '#EAB308',
  '#F59E0B',
  '#F97316',
  '#EF4444',
  '#EC4899',
]

/**
 * Returns a deterministic avatar background color based on the user's name.
 * The same name will always produce the same color from the predefined palette.
 */
export const getAvatarColor = (name?: string): string => {
  if (!name) {
    return '#94A3B8'
  }

  let hash = 0

  for (const character of name) {
    hash = character.charCodeAt(0) + hash * 31
  }

  const hue = Math.abs(hash) % 360

  return `hsl(${hue}, 65%, 75%)`
}

/**
 * Generates initials from a user's full name.
 *
 * Example:
 * "John Doe" -> "JD"
 */
export const getInitials = (name?: string): string => {
  if (!name) {
    return ''
  }

  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
