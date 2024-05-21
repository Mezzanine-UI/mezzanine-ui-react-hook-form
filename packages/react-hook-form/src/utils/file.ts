import { Area } from '../typings/file';
import { isBrowser } from './type-checker';

export function byteToMegaByte(byte: number) {
  return byte / (1024 * 1024);
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

export function blobToFile(
  blob: Blob,
  name: string,
  options?: FilePropertyBag,
): File {
  return new File([blob], name, options);
}

export function createImageBlob(url: string) {
  return new Blob([url], { type: 'image/jpeg' });
}

export function srcToFile(
  src: string,
  name: string,
  options?: BlobPropertyBag,
) {
  return blobToFile(
    new Blob([src], options || { type: 'image/jpeg' }),
    name,
    options,
  );
}

export async function base64ToFile(
  base64String: string,
  filename: string,
  options?: FilePropertyBag,
) {
  return fetch(base64String)
    .then((res) => res.blob())
    .then((blob) => new File([blob], filename, options));
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
  return new Blob([url], { type: 'video/mp4' });
}

export function base64MimeType(base64String: string) {
  let result = null;

  if (typeof base64String !== 'string') {
    return result;
  }

  const mime = base64String.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

  if (mime && mime.length) {
    result = mime[1];
  }

  return result;
}

export async function createCropImageBlob({
  mimeType,
  src,
  area,
  imageLimit = 10 * 1024 * 1024,
  rotation = 0,
}: {
  mimeType?: string;
  src: string;
  area: Area;
  imageLimit?: number; // 10 * 1024 * 1024,
  rotation?: number;
}): Promise<Blob | string> {
  if (!isBrowser()) return Promise.resolve('');

  function getRadianAngle(degreeValue: number) {
    return (degreeValue * Math.PI) / 180;
  }

  if (mimeType && !mimeType.startsWith('image')) {
    throw new Error('Invalid mime type.');
  }

  const mime = mimeType || base64MimeType(src) || 'image/png';

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
      (file) => resolve(file || ''),
      mime,
      Math.min(0.98, imageLimit / imageFileSize),
    );
  });
}

/**
 * 1. Pre-compress the img.
 * 2. Resolving the browser supporting-issues.
 */
export function preprocessImg(
  file: File,
  maxMb: number,
  options = {
    log: false,
  },
) {
  return new Promise<File>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      const img = new Image();

      img.src = event.target?.result as string;
      img.onload = () => {
        // 設定canvas參數
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const MAX_AREA = 16777216; // iOS canvas maximum area.
        let width = img.width;
        let height = img.height;

        if (width * height > MAX_AREA) {
          /** Canvas area 面積上限: (width * height > 16777216) */
          const scalar = Math.sqrt(MAX_AREA) / Math.sqrt(width * height);

          width = Math.floor(width * scalar);
          height = Math.floor(height * scalar);
          canvas.width = width;
          canvas.height = height;
          ctx?.fillRect(0, 0, canvas.width, canvas.height);
          ctx?.drawImage(img, 0, 0);
        } else {
          // 原圖
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
        }

        const compressImageAsync = (quality: number): Promise<Blob> => {
          return new Promise<Blob>((r) => {
            canvas.toBlob(
              (blob) => r(blob || new Blob()),
              'image/jpeg',
              quality,
            );
          });
        };

        const compressUntilSizeLessThan = (
          quality: number,
          targetSize: number,
        ): Promise<Blob> => {
          return compressImageAsync(quality).then((blob) => {
            if (blob.size <= targetSize || quality <= 0.1) {
              return blob;
            } else {
              quality -= 0.1;

              return compressUntilSizeLessThan(quality, targetSize);
            }
          });
        };

        // 若檔案大於500kb 要壓縮 取得圖片壓縮後的base64
        compressUntilSizeLessThan(0.7, maxMb * 1024 * 1024).then((blob) => {
          if (options.log) {
            const resizedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            // eslint-disable-next-line no-console
            console.log(
              `Resized image size: ${(resizedFile.size / 1024).toFixed(2)} KB`,
            );
          }

          const afterCompressReader = new FileReader();

          afterCompressReader.onloadend = () => {
            const base64data = afterCompressReader.result as string;

            base64ToFile(base64data, file.name, {
              type: file.type,
              lastModified: Date.now(),
            })
              .then(resolve)
              .catch(reject);

            if (options?.log)
              // eslint-disable-next-line no-console
              console.log('壓縮後的base64', base64data);
          };
          afterCompressReader.readAsDataURL(blob);
        });
      };
    };
    reader.onerror = function () {
      const error = new Error('無法辨識');

      // eslint-disable-next-line no-console
      if (options?.log) console.log('Error: ', error);
      reject(error);
    };
    reader.readAsDataURL(file);
  });
}
