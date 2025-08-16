import {FileBackend} from "./fileBackend";
import {arrayBufferToBase64Async} from "./arrayBufferUtils";

import {download} from "./download";

export class BetaSaver implements FileBackend{
    data: [string, ArrayBuffer][]

    constructor() {
        this.data = []
    }

    onData(path: string, data: ArrayBuffer) {
        this.data.push([path, data])
    };

    async onComplete() {
        // Convert all fields to base64
        const out: string[][] = [];
        for (const [path, data] of this.data){
            out.push([path, await arrayBufferToBase64Async(data)])
        }

        const outString = JSON.stringify(out);
        download(outString, 'beta.json', 'application/json');
    };
}