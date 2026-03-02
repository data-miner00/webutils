import { fromBlob } from 'image-resize-compress';
import { imageToBase64 } from './base64';

export async function resizeImage(image: File, width: number, height: number): Promise<string> {
	return new Promise((resolve) => {
		fromBlob(image, undefined, width, height).then((resizedImage) => {
			imageToBase64(resizedImage as File).then((base64) => {
				resolve(base64);
			});
		});
	});
}
