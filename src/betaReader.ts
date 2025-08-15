import {FileBackend} from "./fileBackend";

async function base64ToArrayBufferAsync(base64: string) {
    const res = await fetch(`data:application/octet-stream;base64,${base64}`);
    return await res.arrayBuffer();
}

export async function betaReader(backend: FileBackend) {
    const stringData = localStorage.beta
    if (!stringData) {
        throw new Error('Beta must be saved before reading.')
    }
    const stringKeys = JSON.parse(stringData) as [string, string][];

    for (const [key, dataAsString] of stringKeys ) {
        backend.onData(key, await base64ToArrayBufferAsync(dataAsString))
    }
    backend.onComplete()
}
