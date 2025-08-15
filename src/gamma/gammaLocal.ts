import {Gamma} from "./gamma";
import {JSDOM} from 'jsdom'
import {betaReader} from "../betaReader";
import * as fs from "node:fs";
import * as path from "node:path";

const root = path.join(__dirname, '..', '..')
const localGamma = path.join(root, 'localGamma')

fs.rmSync(localGamma, {recursive: true, force: true})
fs.mkdirSync(path.join(localGamma, 'assets'), {recursive: true})


export class GammaLocal extends Gamma {
    parseHtml(html: string) {
        return new JSDOM(html).window.document
    }

    saveFile(name: string, data: string) {
        fs.writeFileSync(path.join(root, 'localGamma', name), data, 'utf-8')
    }

    saveAsset(name: string, data: ArrayBuffer) {
        fs.writeFileSync(path.join(root, 'localGamma', 'assets', name), new Uint8Array(data))
    }
}

const gamma = new GammaLocal()

const stringData = fs.readFileSync(path.join(root, 'beta.json'), 'utf-8')
betaReader(stringData, gamma)
