import {FileBackend} from "./fileBackend";

// Alpha Script. Responsible for scraping images and subpages and passing it along to a backend.
export default async function alpha(backend: FileBackend) {

    const startUrl = location.href;
    const start = new URL(startUrl);
    const visited = new Set();

    async function scrape(url: string) {
        if (visited.has(url)) return;
        visited.add(url);
        console.log(`Scraping: ${url}`);

        const res = await fetch(url, {credentials: 'include'});
        const html = await res.text();

        backend.onData(url + '.html', new TextEncoder().encode(html).buffer)

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Images
        // @ts-ignore
        const images = [...doc.querySelectorAll('img')].map(img => img.src);
        for (let imgUrl of images) {
            if (!imgUrl) continue;
            const fullImg = new URL(imgUrl, url).href;
            await downloadToZip(fullImg);
        }

        // Subpage links
        // @ts-ignore
        const links = [...doc.querySelectorAll('a')].map(a => a.href);
        for (let link of links) {
            if (!link) continue;
            const u = new URL(link, url);
            if (
                u.host === start.host &&
                u.pathname.startsWith(start.pathname) &&
                u.href !== url
            ) {
                await scrape(u.href);
            }
        }
    }

    async function downloadToZip(fileUrl: string) {
        try {
            const res = await fetch(fileUrl);
            const blob = await res.blob();
            const arrayBuffer = await blob.arrayBuffer();
            backend.onData(fileUrl, arrayBuffer);
        } catch (err) {
            console.warn(`Failed to download ${fileUrl}:`, err);
        }
    }

    await scrape(startUrl);

    await backend.onComplete()
}
