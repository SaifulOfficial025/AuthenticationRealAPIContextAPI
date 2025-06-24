import React, { useContext, useEffect, useState } from 'react';
import { ImageContext, ImageProvider } from '../context/ImageContext';

import LightGallery from 'lightgallery/react';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-fullscreen.css';
import 'lightgallery/css/lg-share.css';
import 'lightgallery/css/lg-video.css';
import 'lightgallery/css/lg-autoplay.css';

import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import lgFullscreen from 'lightgallery/plugins/fullscreen';
import lgShare from 'lightgallery/plugins/share';
import lgVideo from 'lightgallery/plugins/video';
import lgAutoplay from 'lightgallery/plugins/autoplay';

import { Download } from 'lucide-react';
import JSZip from 'jszip';

function ImageGallery() {
  const { images, loading } = useContext(ImageContext);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const updateBlurImage = (event) => {
      const slide = event.detail.instance.getSlideItem(event.detail.index);
      if (slide?.__slideEl) {
        document.documentElement.style.setProperty(
          '--lg-blur-img', `url('${slide.src}')`
        );
      }
    };
    window.addEventListener('lgAfterSlide', updateBlurImage);
    window.addEventListener('lgAfterOpen', updateBlurImage);
    return () => {
      window.removeEventListener('lgAfterSlide', updateBlurImage);
      window.removeEventListener('lgAfterOpen', updateBlurImage);
    };
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600 animate-pulse">
        Loading...
      </p>
    );
  }

  // Toggle selection of an image by index
  const toggleSelect = (index) => {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Download all selected images as ZIP
  const downloadSelectedAsZip = async () => {
    if (selected.length === 0) {
      alert('No images selected to download.');
      return;
    }
    const zip = new JSZip();

    // Fetch all selected images as blobs
    const fetchPromises = selected.map(async (i) => {
      const url = images[i].image;
      const response = await fetch(url);
      const blob = await response.blob();
      const ext = url.split('.').pop().split(/\#|\?/)[0]; // get file extension
      zip.file(`image_${i + 1}.${ext}`, blob);
    });

    try {
      await Promise.all(fetchPromises);
      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'selected_images.zip';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Error downloading ZIP: ' + err.message);
    }
  };

  // Share all selected images URLs as text via Web Share API
  const shareSelected = () => {
    if (selected.length === 0) {
      alert('No images selected to share.');
      return;
    }
    const urls = selected.map((i) => images[i].image).join('\n');
    if (navigator.share) {
      navigator
        .share({
          title: 'Shared Images',
          text: urls,
          url: window.location.href,
        })
        .catch(() => {
          alert('Sharing cancelled or failed.');
        });
    } else {
      alert('Sharing not supported. Here are the URLs:\n' + urls);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-2 py-6 sm:px-4 md:px-6">
      <h1 className="text-3xl text-center font-bold text-blue-700 mb-4 animate-fade-in">
        📷 Image Gallery
      </h1>

      {/* Action buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={downloadSelectedAsZip}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
          disabled={selected.length === 0}
          title="Download selected images as ZIP"
        >
          <Download size={20} />
          Download Selected ({selected.length})
        </button>
        <button
          onClick={shareSelected}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition"
          disabled={selected.length === 0}
          title="Share selected images URLs"
        >
          Share Selected ({selected.length})
        </button>
      </div>

      <LightGallery
        speed={600}
        mode="lg-slide"
        plugins={[
          lgThumbnail,
          lgZoom,
          lgFullscreen,
          lgShare,
          lgVideo,
          lgAutoplay,
        ]}
        elementClassNames="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2"
        download={true}
        autoplay={true}
        closable={true}
        addClass="custom-blur"
        zoomFromOrigin={true}
        actualSize={true}
      >
        {images.map((img, index) => (
          <a
            key={index}
            href={img.image}
            data-lg-size="1406-1390"
            data-sub-html={`<h4>${img.title}</h4><p>${img.description || ''}</p>`}
            className="relative block aspect-square overflow-hidden rounded-md shadow-sm transition-transform transform hover:scale-[1.03] group"
          >
            <img
              src={img.image}
              alt={img.title}
              loading="lazy"
              className="w-full h-full object-cover"
            />

            {/* Checkbox for marking */}
            <label
              htmlFor={`checkbox-${index}`}
              className="absolute top-2 left-2 bg-white rounded-md p-1 shadow cursor-pointer select-none"
              title={selected.includes(index) ? 'Unmark image' : 'Mark image'}
              onClick={(e) => {
                e.preventDefault();   // Prevent <a> navigation
                e.stopPropagation();  // Prevent LightGallery open
                toggleSelect(index);
              }}
            >
              <input
                type="checkbox"
                id={`checkbox-${index}`}
                className="hidden"
                checked={selected.includes(index)}
                readOnly
              />
              {/* Custom checkbox UI */}
              <svg
                className={`w-5 h-5 stroke-current ${
                  selected.includes(index)
                    ? 'text-blue-600 fill-blue-600'
                    : 'text-gray-400'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
              >
                {selected.includes(index) ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                ) : (
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="4"
                    ry="4"
                  />
                )}
              </svg>
            </label>

            {/* Download icon on hover */}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <a
                href={img.image}
                download
                className="bg-white p-1 rounded-full shadow hover:bg-gray-100"
                title="Download"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Trigger manual download
                  const link = document.createElement('a');
                  link.href = img.image;
                  link.download = '';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <Download size={16} className="text-gray-700" />
              </a>
            </div>
          </a>
        ))}
      </LightGallery>

      <style>{`
        .lg-backdrop::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: var(--lg-blur-img);
          background-size: cover;
          background-position: center;
          filter: blur(25px);
          transform: scale(1.1);
          z-index: 0;
        }
        .lg-outer.open .lg-backdrop {
          background: transparent !important;
        }
        .lg-toolbar .lg-icon.lg-zoom-in,
        .lg-toolbar .lg-icon.lg-zoom-out {
          display: inline-block;
        }
      `}</style>
    </div>
  );
}

export default function ImagePage() {
  return (
    <ImageProvider>
      <ImageGallery />
    </ImageProvider>
  );
}
