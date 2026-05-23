async function getNextId(model, idField, options = {}) {
  const lastId = await model.max(idField, options)
  return Number(lastId || 0) + 1
}

module.exports = getNextId
