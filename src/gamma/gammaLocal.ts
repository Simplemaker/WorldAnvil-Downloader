import {Gamma} from "./gamma";
import {JSDOM} from 'jsdom'
import {betaReader} from "../betaReader";
import * as fs from "node:fs";
import * as path from "node:path";

export class GammaLocal extends Gamma {
    parseHtml(html: string) {
        return new JSDOM(html).window.document
    }
}

const gamma = new GammaLocal()

const stringData = fs.readFileSync(path.join(__dirname, '..', '..', 'beta.json'), 'utf-8')
betaReader(stringData, gamma)
