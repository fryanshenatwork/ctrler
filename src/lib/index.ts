import axios from 'axios'

// declare global {
//   interface Window { // eslint-disable-line
//     ctrler: any
//   }
// }

interface AxiosCreateOptInterface {
  baseURL: string,
  timeout?: number,
  headers?: {}
}

interface ctrlerResultControlleraddInterface {
  name: string,
  action: any,
  descript?: {}
}

interface ctrlerErrorInterface {
  code: string | Array<string>,
  descript: string | {[key: string]: any}
}

interface ctrlerResultInterface {
  controller: {
    use: (name: string) => void,
    add: (opt: ctrlerResultControlleraddInterface) => any,
    remove: (name: string) => any
    list: Array<string>,
    axios: any
  },
  error: {
    add: (opt: ctrlerErrorInterface) => void,
    remove: (name: string) => void,
    rewrite: (opt: ctrlerErrorInterface) => void,
    get: (code: string) => ctrlerErrorInterface,
    list: ctrlerErrorInterface[]
  }
}

const ctrler = {
  create (opt : {
    axiosInstance: AxiosCreateOptInterface,
    dataHandler?: {
      success: (res: {}) => {},
      error: (ers: {}) => {},
    }
  }) {
    const _this = this
    const controllers : {[key: string]: any} = {}
    const findError = function (code: string | Array<string>) {
      return result.error.list.find((e: any) => { // eslint-disable-line
        if (
          typeof (e.code) === 'string'
          && typeof code === 'string'
        ) {
          return `${e.code}` === `${code}`
        } if (
          Array.isArray(e.code)
        ) {
          if (typeof (code) === 'string') {
            return e.code.includes(`${code}`)
          } if (Array.isArray(code)) {
            return e.code.includes(`${code[0]}`)
          }
        }
      })
    }
    const result: ctrlerResultInterface = {
      controller: {
        use: (name: string) : any => {},
        add: () : any => result.controller,
        remove: (name: string) : any => result.controller,
        axios: undefined,
        get list () : Array<string> { return Object.keys(controllers) }
      },
      error: {
        add: () => true,
        remove: () => {},
        rewrite: () => {},
        get: (code : string) => {
          const found = findError(code)
          return found || { code: undefined, descript: code }
        },
        list: [
          {
            code: ['1011', 'Network Error'],
            descript: 'Network Error'
          },
          {
            code: ['404', 'Not Found'],
            descript: 'Page Not Found'
          }
        ]
      }
    }

    const axiosInstance = axios.create(opt.axiosInstance)

    const controllerAdd = function (caOpt: ctrlerResultControlleraddInterface) {
      let action
      if (controllers[caOpt.name] !== undefined) {
        throw new Error(`Controller name "${caOpt.name}" already taken`)
      }
      if (
        !_this.utils.isFunction(caOpt.action)
        && !_this.utils.isObject(caOpt.action)
      ) {
        throw new Error(`The function "add" second arg need to be function`)
      }
      if (typeof (caOpt.action) === 'object') {
        action = () => axiosInstance(caOpt.action)
      } else {
        action = () => caOpt.action(axiosInstance)
      }
      controllers[caOpt.name] = {
        action,
        descript: caOpt.descript
      }
      return result.controller
    }
    const controllerRemove = function (name: string) {
      const found = result.controller.list.find((e) => `${e}` === name)
      if (!found) {
        throw new Error(`Controller name "${name} was not assign to the controller`)
      }
      delete controllers[name]
      return result.controller
    }
    const controllerUse = function (name : string) {
      const found = result.controller.list.find((e) => `${e}` === name)
      if (!found) {
        throw new Error(`Controller name "${name} was not assign to the controller`)
      }
      const foundController = controllers[name]

      return new Promise((resolve, reject) => {
        foundController.action()
          .then((res: any) => {
            if (
              opt.dataHandler
              && opt.dataHandler.success
              && _this.utils.isFunction(opt.dataHandler.success)
            ) {
              resolve(opt.dataHandler.success(res))
            } else {
              resolve(res)
            }
          })
          .catch((ers: any) => {
            if (
              opt.dataHandler
              && opt.dataHandler.error
              && _this.utils.isFunction(opt.dataHandler.error)
            ) {
              reject({
                descript: foundController.descript,
                error: result.error.get(ers.message),
                originError: ers
              })
            } else {
              reject({
                descript: foundController.descript,
                error: result.error.get(ers.message)
              })
            }
          })
      })
    }

    const errorAdd = function (errorAddOpt: ctrlerErrorInterface) {
      const errorList = result.error.list
      if (
        findError(errorAddOpt.code)
      ) {
        throw new Error(`Error Code ${errorAddOpt.code} is exited`)
      }
      errorList.push(errorAddOpt)
    }
    const errorRewrite = function (errorRewriteOpt: ctrlerErrorInterface) {
      const found = findError(errorRewriteOpt.code)
      if (found === undefined) {
        throw new Error(`Error Code ${errorRewriteOpt.code} is undefined`)
      }

      found.descript = errorRewriteOpt.descript
    }

    result.controller.axios = axiosInstance
    result.controller.add = controllerAdd.bind(result.controller)
    result.controller.use = controllerUse
    result.controller.remove = controllerRemove
    result.error.add = errorAdd
    result.error.rewrite = errorRewrite
    return result
  },
  utils: {
    isFunction: (fn : any) : boolean => typeof (fn) === 'function',
    isObject: (fn : any) : boolean => typeof (fn) === 'object'
  }
}

export default ctrler
