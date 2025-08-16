import path from "node:path";
import fs from "node:fs";
import {betaReader} from "./betaReader";
import GammaEpub from "./gamma/gammaEpub";

const root = path.join(__dirname, '..')
const localGamma = path.join(root, 'localGamma')

fs.rmSync(localGamma, {recursive: true, force: true})
fs.mkdirSync(path.join(localGamma, 'assets'), {recursive: true})

// const gamma = new GammaLocal(root)
const gamma = new GammaEpub('The Shatterplanes', 'DYSMN');
const stringData = fs.readFileSync(path.join(root, 'beta.json'), 'utf-8')
betaReader(stringData, gamma)
