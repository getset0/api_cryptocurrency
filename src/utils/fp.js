const reduceValues = (values) => {
  return values.reduce((acc, value) => {
    return Object.assign(acc, value)
  }, {})
}

module.export = reduceValues