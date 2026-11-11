const PREFIX = /^(Mr|Mrs|Ms|Dr)\.?\s+/i

export const cleanName = (name) => name.replace(PREFIX, '')

export const initials = (name) =>
  cleanName(name)
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

export const firstLetter = (name) => cleanName(name)[0].toUpperCase()

const HUES = [248, 200, 160, 30, 340, 280, 20, 180]
export const avatarColor = (id) => `hsl(${HUES[id % HUES.length]} 70% 42%)`