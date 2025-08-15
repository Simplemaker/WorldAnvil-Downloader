import {softDictMatch} from "./pathUtils";

export function getBreadthFirstPageOrder(documents: Record<string, Document>, root: string) {
    const pages: string[] = [];

    // list as queue? It's slow but fine.
    const queue = [root];

    console.log('Determining page order.')
    while(queue.length > 0) {
        const next = queue.shift() as string;
        const softMatch = softDictMatch(documents, next)
        if (!softMatch) continue;
        if (pages.includes(softMatch.key)) continue;
        pages.push(softMatch.key);

        // Now add all link hrefs
        softMatch.value.querySelectorAll('a').forEach(link => queue.push(link.href))
    }
    console.log(`Page order found: ${pages}`)

    return pages;
}