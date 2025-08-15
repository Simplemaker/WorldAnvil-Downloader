import {FileBackend} from "../fileBackend";
import {arrayBufferToString} from "../arrayBufferUtils";


export class Gamma implements FileBackend {
    pageOrder: string[];
    documents: Record<string, Document>
    assets: Record<string, ArrayBuffer>

    constructor() {
        this.pageOrder = [];
        this.documents = {};
        this.assets = {};
    }

    onData(path: string, data: ArrayBuffer) {
        console.log(path)
        if (path.includes('.html')) {
            this.pageOrder.push(path)
            this.documents[path] = this.parseHtml(arrayBufferToString(data))
        } else {
            // It's an asset
            this.assets[path] = data;
        }
    };

    async onComplete() {
        console.log('Gamma complete!')
    };

    parseHtml(html: string) {
        return new DOMParser().parseFromString(html, 'text/html')
    }
}

/*
The Gamma Ebook Generator

Gamma accepts a file stream containing images and pages.

Ideally, the following filters are applied:

images and webpages are sorted and categorized

Webpages are ordered - With earlier pages appearing first

A name converter is set up. Webpages are prefixed with \d{4} to allow for proper ebook ordering.
Images are converted to a <uuid>.png. Then, all image src links are updated with relative references.

Excess HTML elements are filtered out.



 */