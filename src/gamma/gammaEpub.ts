import JSZip from "jszip";

import {randomUuid} from "./uuid";
import {download} from "../download";
import {Gamma} from "./gamma";

export default class GammaEpub extends Gamma {
    processedDocuments: Record<string, string>;
    processedAssets: Record<string, ArrayBuffer>;
    private readonly title: string;
    private readonly author: string;
    private bookId: string;

    constructor(title: string, author: string) {
        super();
        this.processedDocuments = {};
        this.processedAssets = {};
        this.title = title;
        this.author = author;
        this.bookId = `urn:uuid:${randomUuid()}`;
    }

    saveFile(name: string, data: string) {
        this.processedDocuments[name] = data;
    }

    saveAsset(name: string, data: ArrayBuffer) {
        this.processedAssets[name] = data;
    }

    async onComplete(): Promise<void> {
        await super.onComplete();
        const zip = new JSZip();

        const pageOrder = Object.keys(this.processedDocuments).sort();

        zip.file('mimetype', 'application/epub+zip', {compression: 'STORE'});
        zip.file('META-INF/container.xml', this.createContainerXml());

        const oebps = zip.folder('OEBPS');
        if (!oebps) throw new Error("Could not create OEBPS folder");

        oebps.file('content.opf', this.createContentOpf(pageOrder));
        oebps.file('toc.ncx', this.createTocNcx(pageOrder));

        for (const [name, content] of Object.entries(this.processedDocuments)) {
            oebps.file(name, content);
        }

        const assets = oebps.folder('assets');
        if (!assets) throw new Error("Could not create assets folder");

        for (const [name, content] of Object.entries(this.processedAssets)) {
            assets.file(name, content);
        }

        const zipContent = await zip.generateAsync({type: 'blob'});
        download(zipContent, 'book.epub', 'application/epub+zip');
    }

    private getDocuments(): Record<string, Document> {
        const documents: Record<string, Document> = {};
        for (const [name, content] of Object.entries(this.processedDocuments)) {
            documents[name] = this.parseHtml(content);
        }
        return documents;
    }

    private createContainerXml(): string {
        return `<?xml version="1.0" encoding="UTF-8" ?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
   <rootfiles>
      <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
   </rootfiles>
</container>`;
    }

    private createContentOpf(pageOrder: string[]): string {
        const manifestItems = Object.keys(this.processedDocuments).map((name, i) =>
            `<item id="html_${i}" href="${name}" media-type="application/xhtml+xml"/>`
        ).join('\n');

        const assetItems = Object.keys(this.processedAssets).map((name, i) =>
            `<item id="asset_${i}" href="assets/${name}" media-type="${this.getMediaType(name)}"/>`
        ).join('\n');

        const spineItems = pageOrder.map((name, i) => {
            const foundId = Object.keys(this.processedDocuments).indexOf(name);
            return `<itemref idref="html_${foundId}"/>`
        }).join('\n');

        return `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="2.0" unique-identifier="BookId">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${this.title}</dc:title>
    <dc:language>en</dc:language>
    <dc:identifier id="BookId">${this.bookId}</dc:identifier>
    <dc:creator>${this.author}</dc:creator>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    ${manifestItems}
    ${assetItems}
  </manifest>
  <spine toc="ncx">
    ${spineItems}
  </spine>
</package>`;
    }

    private createTocNcx(pageOrder: string[]): string {
        const navPoints = pageOrder.map((name, i) => {
            const doc = this.getDocuments()[name];
            const title = doc.querySelector('title')?.textContent || name;
            return `
    <navPoint id="navPoint-${i + 1}" playOrder="${i + 1}">
      <navLabel><text>${title}</text></navLabel>
      <content src="${name}"/>
    </navPoint>`
        }).join('\n');

        return `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="${this.bookId}"/>
    <meta name="dtb:depth" content="1"/>
  </head>
  <docTitle>
    <text>${this.title}</text>
  </docTitle>
  <navMap>
    ${navPoints}
  </navMap>
</ncx>`;
    }

    private getMediaType(fileName: string): string {
        if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
            return 'image/jpeg';
        }
        if (fileName.endsWith('.png')) {
            return 'image/png';
        }
        if (fileName.endsWith('.gif')) {
            return 'image/gif';
        }
        if (fileName.endsWith('.css')) {
            return 'text/css';
        }
        return 'application/octet-stream';
    }
}
