
export interface FileBackend {
    onData: (path: string, data: ArrayBuffer) => void;
    onComplete: () => void;
}