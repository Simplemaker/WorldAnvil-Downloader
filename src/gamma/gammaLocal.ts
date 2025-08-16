import {Gamma} from "./gamma";
import {JSDOM} from 'jsdom'
import * as fs from "node:fs";
import * as path from "node:path";

export class GammaLocal extends Gamma {
    private root: string;

    constructor(root: string) {
        super();
        this.root = root;
    }

    parseHtml(html: string) {
        return new JSDOM(html).window.document
    }

    saveFile(name: string, data: string) {
        fs.writeFileSync(path.join(this.root, 'localGamma', name), data, 'utf-8')
    }

    saveAsset(name: string, data: ArrayBuffer) {
        fs.writeFileSync(path.join(this.root, 'localGamma', 'assets', name), new Uint8Array(data))
    }
}
