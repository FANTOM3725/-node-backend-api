export const parseId = (value) => {
  const id = Number(value)

  if (!Number.isInteger(id) || id <= 0) {
    return null
  }

  return id
}
export const parseIndex = (arr, id) => {
    const productIndex = arr.findIndex((product) => product.id === id)
    if(productIndex === -1){
        return undefined
    }
    return productIndex
}
