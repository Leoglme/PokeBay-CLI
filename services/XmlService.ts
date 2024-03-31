import * as path from "node:path";
import * as fs from "fs";
import OsService from "#services/OsService";

export default class XmlService {
    public static async getXmlData(xmlFileName: string): Promise<string> {
        const xmlPath: string = path.join(OsService.getDirname(), '../xml', `${xmlFileName}.xml`);
        return new Promise((resolve, reject) => {
            fs.readFile(xmlPath, { encoding: 'utf-8' }, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data);
            });
        });
    }
}
