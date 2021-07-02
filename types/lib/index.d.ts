interface AxiosCreateOptInterface {
    baseURL: string;
    timeout?: number;
    headers?: {};
}
interface ctrlerResultControlleraddInterface {
    name: string;
    action: any;
    descript?: {};
}
interface ctrlerErrorInterface {
    code: string | Array<string>;
    descript: string | {
        [key: string]: any;
    };
}
interface ctrlerResultInterface {
    controller: {
        use: (name: string) => void;
        add: (opt: ctrlerResultControlleraddInterface) => any;
        remove: (name: string) => any;
        list: Array<string>;
        axios: any;
    };
    error: {
        add: (opt: ctrlerErrorInterface) => void;
        remove: (name: string) => void;
        rewrite: (opt: ctrlerErrorInterface) => void;
        get: (code: string) => ctrlerErrorInterface;
        list: ctrlerErrorInterface[];
    };
}
declare const ctrler: {
    create(opt: {
        axiosInstance: AxiosCreateOptInterface;
        dataHandler?: {
            success: (res: {}) => {};
            error: (ers: {}) => {};
        };
    }): ctrlerResultInterface;
    utils: {
        isFunction: (fn: any) => boolean;
        isObject: (fn: any) => boolean;
    };
};
export default ctrler;
//# sourceMappingURL=index.d.ts.map