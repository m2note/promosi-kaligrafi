
import React, { useState, useCallback, useMemo } from 'react';
import { ImageFile, AspectRatio } from './types';
import { backgroundOptions, aspectRatioOptions } from './constants';
import { generatePromotionalImages } from './services/geminiService';
import { Spinner, PersonIcon, ProductIcon } from './components/icons';
import ImageUploader from './components/ImageUploader';
import GeneratedImageGallery from './components/GeneratedImageGallery';

export default function App() {
  const [modelImage, setModelImage] = useState<ImageFile | null>(null);
  const [dollImage, setDollImage] = useState<ImageFile | null>(null);
  const [background, setBackground] = useState<string>(Object.keys(backgroundOptions)[0]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const processImageTo9x16 = (dataUrl: string, mimeType: string): Promise<ImageFile> => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = dataUrl;
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const canvasWidth = 720;
            const canvasHeight = 1280;
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject(new Error('Tidak bisa mendapatkan konteks kanvas'));
            }

            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            const imageAspectRatio = image.width / image.height;
            const targetAspectRatio = canvasWidth / canvasHeight;

            let drawWidth = canvasWidth;
            let drawHeight = canvasHeight;

            if (imageAspectRatio > targetAspectRatio) {
                drawHeight = canvasWidth / imageAspectRatio;
            } else {
                drawWidth = canvasHeight * imageAspectRatio;
            }

            const x = (canvasWidth - drawWidth) / 2;
            const y = (canvasHeight - drawHeight) / 2;

            ctx.drawImage(image, x, y, drawWidth, drawHeight);

            const newDataUrl = canvas.toDataURL(mimeType, 0.95);
            const base64Part = newDataUrl.split(',')[1];
            if (!base64Part) {
                return reject(new Error('Gagal mengonversi gambar ke Base64.'));
            }

            resolve({
                base64: base64Part,
                mimeType: mimeType,
                previewUrl: newDataUrl
            });
        };
        image.onerror = (error) => {
            console.error('Error loading image for processing:', error);
            reject(new Error('Tidak dapat memuat gambar untuk diproses.'));
        };
    });
  };

  const fileHandler = async (file: File, callback: (result: ImageFile) => void) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        try {
            const originalDataUrl = reader.result as string;
            const processedImage = await processImageTo9x16(originalDataUrl, file.type);
            callback(processedImage);
        } catch (processError) {
             console.error('Error processing image:', processError);
             setError((processError as Error).message || 'Terjadi kesalahan yang tidak diketahui saat pemrosesan gambar.');
        }
    };
    reader.onerror = (error) => {
      console.error('Error converting file to base64:', error);
      setError('Tidak dapat membaca file yang dipilih.');
    };
  };

  const handleModelImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      fileHandler(e.target.files[0], setModelImage);
      setError(null);
    }
  };

  const handleDollImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      fileHandler(e.target.files[0], setDollImage);
      setError(null);
    }
  };
  
  const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSingle = useCallback((imageUrl: string, index: number) => {
    downloadImage(imageUrl, `pajangan-promoshot-${index + 1}.png`);
  }, []);

  const handleDownloadAll = useCallback(() => {
    generatedImages.forEach((imageUrl, index) => {
        downloadImage(imageUrl, `pajangan-promoshot-${index + 1}.png`);
    });
  }, [generatedImages]);

  const handleGenerate = useCallback(async () => {
    if (!modelImage || !dollImage) {
      setError('Silakan unggah gambar model dan produk.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const images = await generatePromotionalImages(modelImage, dollImage, background, aspectRatio);
      setGeneratedImages(images);
    } catch (err) {
      console.error('Generation Error:', err);
      const errorMessage = (err instanceof Error) ? err.message : 'Gagal menghasilkan gambar. Pastikan gambar masukan Anda jelas.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [modelImage, dollImage, background, aspectRatio]);

  const canGenerate = useMemo(() => modelImage && dollImage && !isLoading, [modelImage, dollImage, isLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black flex flex-col items-center p-4 sm:p-8 text-gray-200 font-sans">
      <main className="container mx-auto max-w-6xl w-full">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-100 tracking-tight">
            Pajangan <span className="text-pink-500">Promoshot</span>
          </h1>
          <p className="mt-2 text-lg text-gray-400 max-w-2xl mx-auto">
            Buat gambar promosi yang menakjubkan dan realistis untuk produk pajangan Anda dalam sekejap.
          </p>
        </header>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6">
            <ImageUploader
              id="model-uploader"
              title="Upload Model (Orang)"
              icon={<PersonIcon />}
              imagePreviewUrl={modelImage?.previewUrl}
              onChange={handleModelImageChange}
              aspectRatio={'9:16'}
            />
            <ImageUploader
              id="doll-uploader"
              title="Upload Produk Pajangan"
              icon={<ProductIcon />}
              imagePreviewUrl={dollImage?.previewUrl}
              onChange={handleDollImageChange}
              aspectRatio={'9:16'}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
            <div>
                <label htmlFor="background-selector" className="block text-lg font-semibold text-gray-300 mb-2 text-center">
                    Pilih Latar Belakang
                </label>
                <select
                    id="background-selector"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-pink-500 focus:border-pink-500 shadow-inner appearance-none"
                >
                    {Object.entries(backgroundOptions).map(([value, name]) => (
                        <option key={value} value={value}>{name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="ratio-selector" className="block text-lg font-semibold text-gray-300 mb-2 text-center">
                    Pilih Rasio Aspek Output
                </label>
                <select
                    id="ratio-selector"
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-pink-500 focus:border-pink-500 shadow-inner appearance-none"
                >
                    {aspectRatioOptions.map(({ value, name }) => (
                        <option key={value} value={value}>{name}</option>
                    ))}
                </select>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white bg-pink-500 rounded-full hover:bg-pink-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300 shadow-xl shadow-pink-500/30"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  Membuat...
                </>
              ) : (
                'Buat 6 Pose'
              )}
            </button>
          </div>

          {error && (
            <div className="mt-6 text-center text-red-400 bg-red-500/10 p-4 rounded-xl border-2 border-red-500/30 font-medium">
              <p>{error}</p>
            </div>
          )}
        </div>
        
        {generatedImages.length > 0 && !isLoading && (
            <div className="text-center mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                <button
                    onClick={handleDownloadAll}
                    className="inline-flex items-center justify-center px-8 py-3 text-md font-bold text-white bg-green-500 rounded-full hover:bg-green-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 shadow-lg shadow-green-500/30"
                >
                    Unduh Semua
                </button>
                <button
                    onClick={handleGenerate}
                    className="inline-flex items-center justify-center px-8 py-3 text-md font-bold text-pink-500 bg-transparent border-2 border-pink-500 rounded-full hover:bg-pink-500/10 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-800 shadow-md"
                >
                    Buat Lagi
                </button>
            </div>
        )}

        <GeneratedImageGallery images={generatedImages} isLoading={isLoading} onDownload={handleDownloadSingle} aspectRatio={aspectRatio}/>
      </main>

      <footer className="text-center mt-12 text-gray-500 text-sm">
        <p>Didukung oleh Gemini API dengan model Image-to-Image.</p>
      </footer>
    </div>
  );
}
