import {
  FC,
  ReactNode,
  useState,
} from 'react';
import { Area, Point } from 'react-easy-crop/types';
import Cropper, { CropperProps } from 'react-easy-crop';
import {
  Icon,
  Modal, ModalActions, ModalActionsProps, ModalProps, Slider, Typography,
} from '@mezzanine-ui/react';
import { TimesIcon } from '@mezzanine-ui/icons';
import { cropperModalClasses } from '@mezzanine-ui/react-hook-form-core';

import { blobToUrl, createCropImageBlob } from '../../utils/file';
import CropperMinusIcon from './CropperMinusIcon';
import CropperPlusIcon from './CropperPlusIcon';

export interface CropperModalProps extends Omit<ModalProps, 'children'> {
  aspect?: number;
  image?: CropperProps['image'];
  sizeLimitMb?: number;
  header?: ReactNode;
  modalActionProps?: Omit<ModalActionsProps, 'onClose' | 'onConfirm'>;
  onComplete?: (croppedImg: string, croppedFile: string | Blob) => void;
}

export const CropperModal: FC<CropperModalProps> = ({
  aspect,
  image,
  open,
  sizeLimitMb = 10,
  header,
  onClose = () => {},
  modalActionProps,
  onComplete,
}) => {
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();
  const [crop, setCrop] = useState<Point>({
    x: 0,
    y: 0,
  });

  const onCropChange = (location: Point) => {
    setCrop(location);
  };

  const onCropComplete: CropperProps['onCropComplete'] = (_, currentCroppedAreaPixels) => {
    setCroppedAreaPixels(currentCroppedAreaPixels);
  };

  const onConfirm = image && onComplete && croppedAreaPixels ? async () => {
    const croppedBlob = await createCropImageBlob({
      src: image,
      area: croppedAreaPixels,
      imageLimit: sizeLimitMb * 1024 * 1024,
    });

    if (croppedBlob instanceof Blob) {
      onComplete?.(
        blobToUrl(croppedBlob),
        croppedBlob,
      );
    }

    onClose();
  } : undefined;

  return (
    <Modal
      hideCloseIcon
      open={open}
      className={cropperModalClasses.host}
    >
      <div className={cropperModalClasses.header}>
        {header || (
          <Typography
            color="text-primary"
            variant="h3"
          >
            拆切影像
          </Typography>
        )}
        <button
          type="button"
          onClick={onClose}
          className={cropperModalClasses.close}
        >
          <Icon
            icon={TimesIcon}
            size={32}
            style={{ color: '#8F8F8F' }}
          />
        </button>
      </div>
      <div className={cropperModalClasses.cropper}>
        <div className={cropperModalClasses.cropperContainer}>
          <Cropper
            showGrid
            image={image}
            aspect={aspect}
            crop={crop}
            zoom={zoom}
            onCropChange={onCropChange}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            objectFit="horizontal-cover"
          />
        </div>
        <div className={cropperModalClasses.cropperSlider}>
          <CropperMinusIcon />
          <Slider
            max={2}
            min={1}
            step={0.01}
            value={zoom}
            onChange={setZoom}
          />
          <CropperPlusIcon />
        </div>
      </div>
      <ModalActions
        cancelText="取消上傳"
        confirmText="確定裁切"
        cancelButtonProps={{
          type: 'button',
          size: 'large',
        }}
        confirmButtonProps={{
          type: 'button',
          size: 'large',
        }}
        {...modalActionProps}
        onCancel={onClose}
        onConfirm={onConfirm}
      />
    </Modal>
  );
};
