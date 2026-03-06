import { fromBlob, type ImageFormat } from 'image-resize-compress';
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

export { type ImageFormat } from 'image-resize-compress';

export function convertImageFormat(image: File, format: ImageFormat): Promise<string> {
	return new Promise((resolve) => {
		fromBlob(image, undefined, undefined, undefined, format).then((convertedImage) => {
			imageToBase64(convertedImage as File).then((base64) => {
				resolve(base64);
			});
		});
	});
}

export interface CompressionOutput {
	base64: string;
	compressedSize: number;
}

export function compressImage(image: File, level: number): Promise<CompressionOutput> {
	return new Promise((resolve) => {
		fromBlob(
			image,
			(1 / level) * 90,
			undefined,
			undefined,
			image.type === 'image/webp' ? 'webp' : ('jpg' as ImageFormat)
		).then((compressedImage) => {
			imageToBase64(compressedImage as File).then((base64) => {
				resolve({
					base64,
					compressedSize: compressedImage.size
				});
			});
		});
	});
}
