export type URLParams = {[key: string]: string | number | boolean | null};

export function encodeUrlParams(params: URLParams) {
    let paramsEncoded = [];
    for (let name in params) {
        paramsEncoded.push(`${name}=${params[name]}`);
    }
    return paramsEncoded.join('&');
}