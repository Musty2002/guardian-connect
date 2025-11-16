import { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { toast } from 'sonner';

export const useNativeCamera = () => {
  const [isCapturing, setIsCapturing] = useState(false);

  const takePicture = async () => {
    setIsCapturing(true);
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      setIsCapturing(false);
      return image.webPath;
    } catch (error) {
      setIsCapturing(false);
      console.error('Error taking picture:', error);
      toast.error('Failed to capture photo');
      return null;
    }
  };

  const pickFromGallery = async () => {
    setIsCapturing(true);
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      });

      setIsCapturing(false);
      return image.webPath;
    } catch (error) {
      setIsCapturing(false);
      console.error('Error picking photo:', error);
      toast.error('Failed to pick photo');
      return null;
    }
  };

  return {
    takePicture,
    pickFromGallery,
    isCapturing,
  };
};
