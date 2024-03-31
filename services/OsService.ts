import path from "node:path";

export default class OsService {
    public static getDirname(): string {
        const __dirname = path.dirname(decodeURI(new URL(import.meta.url).pathname));
        return path.resolve(process.platform === "win32" ? __dirname.substring(1) : __dirname);
    }
}
