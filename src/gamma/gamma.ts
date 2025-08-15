import {FileBackend} from "../fileBackend";
import {arrayBufferToString} from "../arrayBufferUtils";
import {pathExtension, pathTail} from "./pathUtils";
import {randomUuid} from "./uuid";


export class Gamma implements FileBackend {
    pageOrder: string[];
    documents: Record<string, Document>
    assets: Record<string, ArrayBuffer>

    pathRename: Record<string, string>;


    constructor() {
        this.pageOrder = [];
        this.documents = {};
        this.assets = {};
        this.pathRename = {};
    }

    onData(path: string, data: ArrayBuffer) {
        console.log(path)
        if (path.includes('.html')) {
            this.pageOrder.push(path)
            this.documents[path] = this.parseHtml(arrayBufferToString(data))
            this.pathRename[path] = `${this.pageOrder.length.toString().padStart(4, '0')} - ${pathTail(path)}`
        } else {
            // It's an asset
            this.assets[path] = data;
            this.pathRename[path] = randomUuid() + pathExtension(path)
        }
    };

    async onComplete() {
        console.log(this.pathRename)
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