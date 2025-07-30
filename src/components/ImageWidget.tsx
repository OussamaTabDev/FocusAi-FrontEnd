
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image, Upload, X } from 'lucide-react';

const ImageWidget: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Load saved image from localStorage on component mount
  useEffect(() => {
    const savedImage = localStorage.getItem('last-selected-image');
    if (savedImage) {
      setSelectedImage(savedImage);
    }
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setSelectedImage(imageUrl);
        // Save to localStorage
        localStorage.setItem('last-selected-image', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImageFile(null);
    localStorage.removeItem('last-selected-image');
  };

  return (
    <Card className="p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Image className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold">Last Picture</h3>
        </div>
        {selectedImage && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveImage}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {selectedImage ? (
        <div className="space-y-3">
          <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={selectedImage}
              alt="Last selected"
              className="w-full h-40 object-cover"
            />
          </div>
          <div className="text-xs text-muted-foreground text-center">
            {imageFile ? `File: ${imageFile.name}` : 'Previously selected image'}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <Upload className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-muted-foreground mb-3">No image selected</p>
          <label htmlFor="image-upload" className="cursor-pointer">
            <Button size="sm" asChild>
              <span>Select Image</span>
            </Button>
          </label>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      )}

      {selectedImage && (
        <div className="mt-3">
          <label htmlFor="image-update" className="cursor-pointer">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <span>Change Image</span>
            </Button>
          </label>
          <Input
            id="image-update"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      )}
    </Card>
  );
};

export default ImageWidget;
