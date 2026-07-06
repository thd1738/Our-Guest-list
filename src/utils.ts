import { GuestSide } from './types';
import regeneratedPhoto from './assets/images/regenerated_image_1783327971118.jpg';

export const DEFAULT_GROOM_PHOTO = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80';
export const DEFAULT_BRIDE_PHOTO = regeneratedPhoto;

export const getSidePhoto = (side: GuestSide): string => {
  try {
    const saved = localStorage.getItem(`wedding_${side}_photo`);
    if (side === 'bride' && saved === 'https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?auto=format&fit=crop&w=800&q=80') {
      localStorage.removeItem('wedding_bride_photo');
      return DEFAULT_BRIDE_PHOTO;
    }
    return saved || (side === 'groom' ? DEFAULT_GROOM_PHOTO : DEFAULT_BRIDE_PHOTO);
  } catch {
    return side === 'groom' ? DEFAULT_GROOM_PHOTO : DEFAULT_BRIDE_PHOTO;
  }
};

export const notifyPhotoUpdate = () => {
  try {
    window.dispatchEvent(new Event('photo_updated'));
  } catch {}
};
