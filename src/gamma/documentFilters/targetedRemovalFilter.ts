
export default function targetedRemovalFilter(element: Element): Element {
    const targets = [
        element.querySelector('.search-form'),
        ...element.querySelectorAll('a[target="_blank"]')
    ]

    for (const target of targets) {
        if (target == null) continue;
        target.remove()
    }

    return element
}