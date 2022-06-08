const randomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const randomChoice = (array) => {
  return array[randomInt(0, array.length - 1)]
}
export { randomInt, randomChoice }
