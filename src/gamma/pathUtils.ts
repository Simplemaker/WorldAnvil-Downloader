
export function pathTail(path: string) {
    const parts = path.split('/')
    return parts[parts.length - 1];
}

export function pathExtension(path: string) {
    const parse = /(\.[a-z]{1,4})[^.]*$/.exec(path);
    if (!parse || parse.length < 2) {
        throw new Error(`Failed to find file extension of ${path}`);
    }
    return parse[1]
}