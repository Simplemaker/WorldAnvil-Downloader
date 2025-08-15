import {FileBackend} from "./fileBackend";
import { base64ToArrayBufferAsync } from "./arrayBufferUtils";


export async function betaReader(stringData: string, backend: FileBackend) {
    if (!stringData) {
        throw new Error('Beta must be saved before reading.')
    }
    const stringKeys = JSON.parse(stringData) as [string, string][];

    for (const [key, dataAsString] of stringKeys ) {
        backend.onData(key, await base64ToArrayBufferAsync(dataAsString))
    }
    backend.onComplete()
}
