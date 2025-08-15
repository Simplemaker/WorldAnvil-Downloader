
export function pathTail(path: string) {
    const parse = /([^\/]+)\/?(\.html)/.exec(path);
    if (!parse || parse.length < 3) {
        throw new Error(`Failed to find file extension of ${path}`);
    }
    return parse[1] + parse[2]
}

export function pathExtension(path: string) {
    const parse = /(\.[a-z]{1,4})[^.]*$/.exec(path);
    if (!parse || parse.length < 2) {
        throw new Error(`Failed to find file extension of ${path}`);
    }
    return parse[1]
}