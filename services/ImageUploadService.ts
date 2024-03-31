import * as path from 'node:path';
import * as fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';
import OsService from "#services/OsService";

interface ImgurResponse {
    data: {
        link: string;
    };
    success: boolean;
    status: number;
}

export default class ImageUploadService {
    private static IMGUR_API_URL: string = 'https://api.imgur.com/3/image';

    public static async uploadImage(imageName: string): Promise<string> {
        const imagePath: string = path.join(OsService.getDirname(), '../images', imageName);
        const formData: FormData = new FormData();
        formData.append('image', fs.createReadStream(imagePath));

        const response = await fetch(this.IMGUR_API_URL, {
            method: 'POST',
            headers: {
                Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
                ...formData.getHeaders(),
            },
            body: formData,
        });

        const data: ImgurResponse = await response.json() as ImgurResponse;
        return data.data.link;
    }

    public static async uploadMultipleImages(imageNames: string[]): Promise<string[]> {
        const uploadPromises = imageNames.map(imageName => this.uploadImage(imageName));
        return Promise.all(uploadPromises);
    }
}
