import {FileBackend} from "./fileBackend";
import JSZip from "jszip";

export default class ZipBackend implements FileBackend {
    private zip: JSZip;

    constructor() {
        this.zip = new JSZip();
    }
    onData(path: string, data: ArrayBuffer) {
        this.zip.file(path, data);
    };

    onComplete = async () => {
        console.log('Generating ZIP...');
        const content = await this.zip.generateAsync({type: 'blob'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(content);
        a.download = 'site_download.zip';
        a.click();
    };


}