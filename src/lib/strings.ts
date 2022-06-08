export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function chunk(str: string, size: number) {
  return str.match(new RegExp('.{1,' + size + '}', 'g'))
}
