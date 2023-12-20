export const getSum = (values: number[]): number => {
  return values.reduce((acc, score) => {
    return acc + score
  }, 0)
}
