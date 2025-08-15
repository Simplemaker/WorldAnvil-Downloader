import {FileBackend} from "./fileBackend";
import { arrayBufferToBase64Async } from "./arrayBufferUtils";


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
        const blob = new Blob([outString], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'beta.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
}