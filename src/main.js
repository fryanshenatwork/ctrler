import ctrler from '/@/lib'

if (process.env.NODE_ENV === 'development') {
  window.myPlugin = ctrler
}

export default ctrler
export { ctrler }
