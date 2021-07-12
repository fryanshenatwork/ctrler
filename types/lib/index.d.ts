interface AxiosCreateOptInterface {
    baseURL: string;
    timeout?: number;
    headers?: {};
}
interface actionOtherProps {
    params?: any;
    data?: any;
    header?: any;
}
interface ctrlerResultControlleraddInterface {
    name: string;
    action: (axiosInstance: any, useProps?: actionOtherProps) => {} | {
        method: string;
        url: string;
    };
    descript?: {};
}
interface ctrlerErrorInterface {
    code: string | Array<string>;
    descript: string | {
        [key: string]: any;
    };
}
interface ctrlerControllerInterface {
    use: (name: string, otherProps: actionOtherProps) => Promise<any>;
    add: (opt: ctrlerResultControlleraddInterface) => ctrlerControllerInterface;
    remove: (name: string) => any;
    list: Array<string>;
    axios: any;
}
interface ctrlerResultInterface {
    controller: ctrlerControllerInterface;
    error: {
        add: (opt: ctrlerErrorInterface) => void;
        remove: (name: string) => void;
        rewrite: (opt: ctrlerErrorInterface) => void;
        get: (code: string) => ctrlerErrorInterface;
        list: ctrlerErrorInterface[];
    };
}
interface ctrlerCreateProps {
    axiosInstance: AxiosCreateOptInterface;
    dataHandler?: {
        success: (res: {}) => {};
        error: (ers: {}) => {};
    };
}
interface ctrlerInterface {
    create: (opt: ctrlerCreateProps) => ctrlerResultInterface;
    utils: {
        isFunction: (fn: any) => boolean;
        isObject: (fn: any) => boolean;
    };
}
declare const ctrler: ctrlerInterface;
export default ctrler;
//# sourceMappingURL=index.d.ts.map