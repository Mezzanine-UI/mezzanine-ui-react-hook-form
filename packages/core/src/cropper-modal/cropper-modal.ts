const cropperModalPrefix = 'mzn-rhf-cropper-modal';
const cropperPrefix = `${cropperModalPrefix}__cropper`;

export const cropperModalClasses = {
  host: cropperModalPrefix,
  header: `${cropperModalPrefix}__header`,
  title: `${cropperModalPrefix}__title`,
  body: `${cropperModalPrefix}__body`,
  cropper: `${cropperPrefix}`,
  cropperContainer: `${cropperPrefix}--container`,
  cropperSlider: `${cropperPrefix}--slider`,
  footer: `${cropperModalPrefix}__footer`,
  close: `${cropperModalPrefix}__close`,
};
