import { useState } from "react";

const ProductGallery = ({ images = [] }) => {
  const imageList =
    images.length > 0
      ? images.map((image) => image.url || image)
      : ["/placeholder.png"];

  const [selectedImage, setSelectedImage] = useState(imageList[0]);

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white">
        <img
          src={selectedImage}
          alt="Product"
          className="aspect-square w-full object-cover"
        />
      </div>

      {imageList.length > 1 && (
        <div className="flex gap-3 overflow-x-auto">
          {imageList.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedImage(image)}
              className={`overflow-hidden rounded-xl border-2 transition ${
                selectedImage === image
                  ? "border-amber-700"
                  : "border-stone-200"
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="h-20 w-20 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;

