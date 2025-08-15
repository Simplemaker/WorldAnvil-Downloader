
export function linkRenameFilter(pathRename: Record<string, string>) {
    return function(element: Element): Element {
        element.querySelectorAll('img').forEach(image => {
            image.src = `assets/${pathRename[image.src]}`
        })

        element.querySelectorAll('a').forEach(link => {
            if (pathRename[link.href]){
                link.href = pathRename[link.href]
            } else {
                link.href = ''
            }
        })
        return element;
    }
}