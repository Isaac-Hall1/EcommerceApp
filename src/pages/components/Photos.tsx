import { useState } from 'react';

interface PhotoUploadProps {
  onPhotoChange: (photos: File[]) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotoChange }) => {
  const [photos, setPhotos] = useState<File[]>([]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      if (photos.length + filesArray.length <= 5) {
        const updatedPhotos = [...photos, ...filesArray];
        setPhotos(updatedPhotos);
        onPhotoChange(updatedPhotos); 
      } else {
        alert('You can only upload up to 5 photos.');
      }
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="photo-upload">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handlePhotoUpload}
        disabled={photos.length >= 5}
      />
      <div className="photo-preview mt-4">
        {photos.map((photo, index) => (
          <div key={index} className="photo-item">
            <img
              src={URL.createObjectURL(photo)}
              alt={`Uploaded ${index + 1}`}
              className="w-20 h-20 object-cover"
            />
            <button
              type="button"
              onClick={() => removePhoto(index)}
              className="text-red-500 mt-2"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      {photos.length >= 5 && (
        <p className="text-red-500 mt-2">Maximum of 5 photos uploaded.</p>
      )}
    </div>
  );
};

export default PhotoUpload;
