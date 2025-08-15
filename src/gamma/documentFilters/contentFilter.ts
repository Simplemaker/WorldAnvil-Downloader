
export function contentFilter(body: Element) {
    const selection = body.querySelector('.user-css.main-container');
    if (selection == null) {
        console.log(body.outerHTML)
        throw new Error('Failed to find main-container selector.')
    }
    return selection;
}
