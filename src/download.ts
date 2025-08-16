export function download(data: string | ArrayBuffer | Blob, filename: string, mimeType: string) {
    const blob = data instanceof Blob ? data : new Blob([data], {type: mimeType});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
