/**
 * Original implementation: https://github.com/mmckelvy/walk-object
 */

export function walkObject(root: object, fn: (data: {value: any, location: string[], isLeaf: boolean, key: string}) => void) {
    function walk(obj, location = []) {
        Object.keys(obj).forEach((key) => {

            if (Array.isArray(obj[key])) {
                obj[key].forEach((el, j) => {
                    fn({
                        value: el,
                        key: `${key}:${j}`,
                        location: [...location, ...[key], ...[j]],
                        isLeaf: false
                    });
                    walk(el, [...location, ...[key], ...[j]])
                })
            } else if (typeof obj[key] === 'object') {
                fn({
                    value: obj[key],
                    key,
                    location: [...location, ...[key]],
                    isLeaf: false
                });
                walk(obj[key], [...location, ...[key]])
            } else {
                fn({
                    value: obj[key],
                    key,
                    location: [...location, ...[key]],
                    isLeaf: true
                })
            }
        })
    }
    walk(root);
}