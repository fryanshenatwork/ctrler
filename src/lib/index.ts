interface optInterface {
  msg?: string
}

export default (opt : optInterface = {}) : void => {
  console.log(`It's work ${opt.msg ? opt.msg : ''}`)
}
