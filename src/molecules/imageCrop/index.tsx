import 'react-image-crop/dist/ReactCrop.css';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { Crop, PixelCrop } from 'react-image-crop';
import ReactCrop from 'react-image-crop';

import { useDebounceEffect } from '@/hooks/useDebounceEffect';
import { getCroppedCanvas } from '@/utils/helper';

interface ReusableReactCropProps {
  src: string;
  aspectRatio: number;
  width: number;
  height: number;
  onCropComplete: (cropedFile: File) => void;
}

const ReusableReactCrop: React.FC<ReusableReactCropProps> = ({
  src,
  aspectRatio,
  onCropComplete,
  width,
  height,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const [crop, setCrop] = useState<Crop>({
    unit: 'px',
    x: 0,
    y: 0,
    width,
    height,
  });

  const handleCropChange = useCallback((newCrop: Crop) => {
    setCrop(newCrop);
  }, []);

  useEffect(() => {
    if (crop) croppedByCanvas(crop);
  }, [src, width]);

  async function croppedByCanvas(details: any) {
    if (details?.width && details?.height && imgRef.current) {
      // We use canvasPreview as it's much faster than imgPreview.
      const imageBlob = await getCroppedCanvas(
        imgRef.current,
        details,
        'image/png',
      );
      if (imageBlob) {
        const file = new File([imageBlob], 'cropped-image.png', {
          type: 'image/png',
        });
        onCropComplete(file);
      }
    }
  }

  useDebounceEffect(
    async () => {
      croppedByCanvas(completedCrop);
    },
    200,
    [completedCrop],
  );

  return (
    <ReactCrop
      crop={crop}
      onChange={handleCropChange}
      onComplete={(c) => setCompletedCrop(c)}
      aspect={aspectRatio}
      locked={true} // Set the fixed aspect ratio
      style={{ width: width + width * 0.1, height: height + height * 0.1 }}
    >
      <img
        ref={imgRef}
        alt="Crop me"
        src={src}
        className=" object-contain object-center"
      />
    </ReactCrop>
  );
};

export default ReusableReactCrop;
