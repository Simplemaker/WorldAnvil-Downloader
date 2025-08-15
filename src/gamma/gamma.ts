import {FileBackend} from "../fileBackend";
import {arrayBufferToString} from "../arrayBufferUtils";
import {pathExtension, pathTail} from "./pathUtils";
import {randomUuid} from "./uuid";
import {contentFilter} from "./documentFilters/contentFilter";
import {DocumentFilter} from "./documentFilters/documentFilter";
import {linkRenameFilter} from "./documentFilters/linkRenameFilter";
import {getBreadthFirstPageOrder} from "./pageOrder";
import targetedRemovalFilter from "./documentFilters/targetedRemovalFilter";


export class Gamma implements FileBackend {
    pageOrder: string[];
    documents: Record<string, Document>
    assets: Record<string, ArrayBuffer>
    pathRename: Record<string, string>;
    rootPath?: string;

    constructor() {
        this.pageOrder = [];
        this.documents = {};
        this.assets = {};
        this.pathRename = {};
    }

    onData(path: string, data: ArrayBuffer) {
        console.log(path)
        if (path.includes('.html')) {
            if (!this.rootPath) {
                this.rootPath = path;
            }
            this.documents[path] = this.parseHtml(arrayBufferToString(data))
        } else {
            // It's an asset
            this.assets[path] = data;
            this.pathRename[path] = randomUuid() + pathExtension(path)
        }
    };

    async onComplete() {
        // First acquire page order
        const pageOrder = getBreadthFirstPageOrder(this.documents, this.rootPath as string)

        // Add rename rules for documents
        pageOrder.forEach((path: string, index: number) => {
            this.pathRename[path] = `${(index + 1).toString().padStart(4, '0')} - ${pathTail(path)}`
        })

        // Save documents
        const documentFilters: DocumentFilter[] = [linkRenameFilter(this.pathRename), contentFilter, targetedRemovalFilter];
        for (const [path, document] of Object.entries(this.documents)) {
            try {
                const newBody = documentFilters
                    .reduce((p, filter) => filter(p),
                        document.body as Element)
                const result = `<body>${newBody.innerHTML}</body>`
                this.saveFile(this.pathRename[path], result)
            } catch (e) {
                console.error(`Failed to process document ${path}`, e)
            }
        }

        // Save assets
        for (const [path, asset] of Object.entries(this.assets)) {
            this.saveAsset(this.pathRename[path], asset)
        }

        console.log('Gamma complete!')
    };

    parseHtml(html: string) {
        return new DOMParser().parseFromString(html, 'text/html')
    }

    saveFile(name: string, data: string) {
        console.log(`Saving ${name}: ${data.slice(0, 100)}`)
    }

    saveAsset(name: string, data: ArrayBuffer) {
        console.log(`Saving ${name} as asset`)
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