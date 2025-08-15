import {FileBackend} from "./fileBackend";

function arrayBufferToBase64Async(buffer: ArrayBuffer): Promise<string> {
    return new Promise((resolve, reject) => {
        const blob = new Blob([buffer]);
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result as string;
            resolve(dataUrl.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

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

        const outString = JSON.stringify(out)
        localStorage.setItem('beta', outString)
    };
}