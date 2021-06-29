import myPlugin from '/@/lib'

if (process.env.NODE_ENV) {
  window.myPlugin = myPlugin
}

export default myPlugin
export { myPlugin }
