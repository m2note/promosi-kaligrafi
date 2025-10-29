import { GoogleGenAI, Modality } from "@google/genai";
import { ImageFile, AspectRatio } from '../types';
import { POSES_PROMPTS } from '../constants';

const getRatioDescription = (ratio: AspectRatio) => {
    switch (ratio) {
        case '16:9': return 'horizontal 16:9 landscape';
        case '1:1': return 'square 1:1';
        case '9:16':
        default: return 'vertical 9:16 portrait';
    }
}

async function generateSingleImage(
    ai: GoogleGenAI,
    modelImage: ImageFile,
    dollImage: ImageFile,
    posePrompt: string,
    background: string,
    aspectRatio: AspectRatio
): Promise<string> {
    const textPrompt = `Hasilkan satu gambar tunggal yang fotorealistis dan berkualitas promosi.

**Perintah Utama: Rasio aspek gambar keluaran HARUS ${getRatioDescription(aspectRatio)}. Ini adalah persyaratan yang ketat dan tidak dapat dinegosiasikan.**

**Konten Gambar:**
- **Orang:** Harus orang yang *sama persis* dari gambar masukan pertama.
- **Produk Pajangan:** Harus *produk pajangan yang sama persis* dari gambar masukan kedua. Jika produk tersebut adalah kaligrafi (misalnya lafaz Allah atau Muhammad) atau vas bunga, setiap detail, tulisan, lekukan, dan warna harus direplikasi dengan **presisi mutlak**.
- **Aksi:** Orang tersebut sedang ${posePrompt}.
- **Latar Belakang:** Pengaturannya adalah **${background}**.

**Gaya Artistik & Batasan:**
- **Replikasi Produk Akurat (ATURAN PALING PENTING):** Prioritas tertinggi adalah replikasi produk pajangan dari gambar kedua dengan sangat akurat. Produk **TIDAK BOLEH** diinterpretasikan ulang, diubah, atau didistorsi. Salin setiap detailnya seolah-olah itu adalah salinan foto yang sempurna. Ini sangat penting untuk kaligrafi atau desain yang rumit.
- **Akurasi Anatomi:** Tangan model harus digambar secara akurat dan realistis. Hindari anomali seperti jari tambahan, bentuk yang aneh, atau proporsi yang tidak wajar. Pastikan tangan terlihat alami saat memegang atau berinteraksi dengan produk.
- **Realisme:** Ciptakan pencahayaan profesional dan bersih yang cocok untuk iklan, membuat suasana yang menarik dan menonjolkan produk.
- **Konsistensi:** Pertahankan penampilan persis orang dan produk pajangan dari gambar sumber.
- **Kualitas:** Gambar akhir harus beresolusi tinggi dan cocok untuk penggunaan promosi profesional.
- **Format:** Hanya keluarkan data gambar.`;

    const modelImagePart = { inlineData: { data: modelImage.base64, mimeType: modelImage.mimeType } };
    const dollImagePart = { inlineData: { data: dollImage.base64, mimeType: dollImage.mimeType } };
    const textPart = { text: textPrompt };
    
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [modelImagePart, dollImagePart, textPart] },
                config: {
                    responseModalities: [Modality.IMAGE],
                }
            });

            for (const part of result.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64Data = part.inlineData.data;
                    const mimeType = part.inlineData.mimeType;
                    if (base64Data && mimeType) {
                        return `data:${mimeType};base64,${base64Data}`;
                    }
                }
            }
            throw new Error('No image data found in response.');
        } catch (error) {
            console.error(`Attempt ${attempt + 1} failed:`, error);
            if (attempt === 2) {
                throw new Error('Image generation failed after multiple retries.');
            }
            // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
    }
    
    throw new Error('Image generation failed, no image data returned.');
}

export async function generatePromotionalImages(
    modelImage: ImageFile,
    dollImage: ImageFile,
    background: string,
    aspectRatio: AspectRatio
): Promise<string[]> {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Shuffle the poses array to get a random selection
    const shuffleArray = (array: string[]) => {
        const newArr = [...array]; // Create a copy to avoid mutating the original
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    };

    const selectedPrompts = shuffleArray(POSES_PROMPTS).slice(0, 6);

    const imagePromises = selectedPrompts.map(prompt =>
        generateSingleImage(ai, modelImage, dollImage, prompt, background, aspectRatio)
    );

    const results = await Promise.all(imagePromises);
    return results.filter(result => result); // Filter out any potential empty results
}