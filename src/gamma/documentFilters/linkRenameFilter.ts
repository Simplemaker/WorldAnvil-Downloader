
function softDictMatch(dict: Record<string, string>, key: string) {
    for (const [dictKey, value] of Object.entries(dict)) {
        if (dictKey.includes(key)) {
            return value
        }
    }
    return undefined;
}

export function linkRenameFilter(pathRename: Record<string, string>) {
    return function(element: Element): Element {
        element.querySelectorAll('img').forEach(image => {
            image.src = `assets/${pathRename[image.src]}`
        })

        element.querySelectorAll('a').forEach(link => {
            const softMatch = softDictMatch(pathRename, link.href)
            if (softMatch){
                link.href = softMatch
            } else {
                console.log(`Broken link: ${link.href}`)
                link.href = ''
            }
        })
        return element;
    }
}