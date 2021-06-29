import ctrler from '/@/lib'

if (process.env.NODE_ENV === 'development') {
  window.ctrler = ctrler
}

export default ctrler
export { ctrler }
