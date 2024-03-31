import * as path from 'node:path';
import * as fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';
import OsService from "#services/OsService";
import {configDotenv} from "dotenv";

configDotenv()


interface ImgBBResponse {
    data: {
        url: string;
    };
    success: boolean;
    status: number;
}

export default class ImageUploadService {
    private static IMGBB_API_URL: string = 'https://api.imgbb.com/1/upload';

    public static async uploadImage(imageName: string): Promise<string> {
        const imagePath: string = path.join(OsService.getDirname(), '../images', imageName);
        const formData: FormData = new FormData();
        formData.append('image', fs.createReadStream(imagePath));

        const response = await fetch(`${this.IMGBB_API_URL}?key=${process.env.IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData,
        });

        const data: ImgBBResponse = await response.json() as ImgBBResponse;

        if (data.success) {
            return data.data.url
        } else {
            throw new Error(`Failed to upload image. Status: ${data.status}`);
        }
    }

    public static async uploadMultipleImages(imageNames: string[]): Promise<string[]> {
        const uploadPromises: Promise<string>[] = imageNames.map((imageName: string) => this.uploadImage(imageName));
        return Promise.all(uploadPromises);
    }
}
