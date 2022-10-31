import { Area } from '../typings/file';
import { isBrowser } from './type-checker';

export function byteToMegaByte(byte: number) {
  return (byte / (1024 * 1024));
}

export function megaByteToByte(megabyte: number): number {
  return megabyte * 1024 * 1024;
}

export function fileListToArray(fileList: FileList | File): File[] {
  return Array.prototype.slice.call(fileList);
}

export function readFile(file: File) {
  return new Promise<string | ArrayBuffer | null>((resolve) => {
    const reader = new FileReader();

    reader.addEventListener('load', () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

export function blobToFile(blob: Blob, name: string, options?: FilePropertyBag): File {
  return new File([blob], name, options);
}

export function createImageBlob(url: string) {
  return new Blob(
    [url],
    { type: 'image/jpeg' },
  );
}

export function srcToFile(src: string, name: string, options?: BlobPropertyBag) {
  return blobToFile(new Blob([src], options || { type: 'image/jpeg' }), name, options);
}

export function createImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });
}

export function blobToUrl(blob: Blob) {
  if (!isBrowser()) return '';

  const URL = window.URL || window.webkitURL;

  return URL.createObjectURL(blob);
}

export function createVideoBlob(url: string) {
  return new Blob(
    [url],
    { type: 'video/mp4' },
  );
}

export async function createCropImageBlob({
  src,
  area,
  imageLimit = 10 * 1024 * 1024,
  rotation = 0,
}: {
  src: string,
  area: Area,
  imageLimit?: number, // 10 * 1024 * 1024,
  rotation?: number,
}): Promise<Blob | string> {
  if (!isBrowser()) return Promise.resolve('');

  function getRadianAngle(degreeValue: number) {
    return (degreeValue * Math.PI) / 180;
  }

  const image = await createImage(src);

  const canvas = window.document.createElement('canvas');

  canvas.width = area.width;
  canvas.height = area.height;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ctx = canvas.getContext('2d')!;

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  // set each dimensions to double largest dimension to allow for a safe area for the
  // image to rotate in without being clipped by canvas context
  canvas.width = safeArea;
  canvas.height = safeArea;

  // translate canvas context to a central location on image to allow rotating around the center.
  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate(getRadianAngle(rotation));
  ctx.translate(-safeArea / 2, -safeArea / 2);

  // draw rotated image and store data.
  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5,
  );

  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = area.width;
  canvas.height = area.height;

  // paste generated rotate image with correct offsets for x,y crop values.
  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - area.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - area.y),
  );

  const imageFileSize = canvas.toDataURL().length;

  // As a blob
  return new Promise<Blob | string>((resolve) => {
    canvas.toBlob(
      (file) => resolve((file || '')),
      'image',
      Math.min(0.98, imageLimit / imageFileSize),
    );
  });
}
