import { fromBlob } from 'image-resize-compress';
import { imageToBase64 } from './base64';

export function resizeImage(image: File, width: number, height: number): Promise<string> {
	return new Promise((resolve) => {
		fromBlob(image, undefined, width, height).then((resizedImage) => {
			imageToBase64(resizedImage as File).then((base64) => {
				resolve(base64);
			});
		});
	});
}

export type ImageFormat = 'jpeg' | 'png' | 'webp' | 'bmp' | 'gif';

export function convertImageFormat(image: File, format: ImageFormat): Promise<string> {
	return new Promise((resolve) => {
		fromBlob(image, undefined, undefined, undefined, format).then((convertedImage) => {
			imageToBase64(convertedImage as File).then((base64) => {
				resolve(base64);
			});
		});
	});
}
