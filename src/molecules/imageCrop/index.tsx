import 'react-image-crop/dist/ReactCrop.css';

import React, { useCallback, useState } from 'react';
import type { Crop } from 'react-image-crop';
import ReactCrop from 'react-image-crop';

interface ReusableReactCropProps {
  src: string;
  aspectRatio: number;
  width: number;
  height: number;
  onCropComplete: (crop: Crop) => void;
}

const ReusableReactCrop: React.FC<ReusableReactCropProps> = ({
  src,
  aspectRatio,
  onCropComplete,
  width,
  height,
}) => {
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

  const handleCropCompleted = useCallback(
    (completedCrop: Crop) => {
      onCropComplete(completedCrop);
    },
    [onCropComplete],
  );

  return (
    <ReactCrop
      crop={crop}
      onChange={handleCropChange}
      onComplete={handleCropCompleted}
      aspect={aspectRatio}
      locked={true} // Set the fixed aspect ratio
      ruleOfThirds={true}
      style={{ width: width + 16, height: height + 16 }}
    >
      <img alt="Crop me" src={src} />
    </ReactCrop>
  );
};

export default ReusableReactCrop;
