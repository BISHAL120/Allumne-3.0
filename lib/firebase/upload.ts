import { storage } from "@/lib/firebase/firebase";
import { getDownloadURL, ref, uploadBytes, } from "firebase/storage";
import sharp from "sharp";
import { v4 as uuIdV4 } from "uuid";


// Option 1: Using uploadBytesResumable with Promise
/* async function uploadImageFirebase(buffer: Buffer) {
    const fileRef = ref(storage, `products/${uuIdV4()}.png`);
    const uploadTask = uploadBytesResumable(fileRef, buffer);

    return new Promise<{ url: string; }>((resolve, reject) => {
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Optional: track progress
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done`);
            },
            (error) => {
                // Handle errors
                console.error("Upload error:", error);
                reject(error);
            },
            async () => {
                // Handle successful upload
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve({
                        url: downloadURL,
                    });
                } catch (error) {
                    console.error("Error getting download URL:", error);
                    reject(error);
                }
            }
        );
    });
} */



// Option 2: Simpler approach using uploadBytes (if you don't need progress tracking)

type FolderType = "Products" | "Categories" | "SubCategories" | "Carousels" | "Thumbnails" | "ProfileImages" | "Demo" | "ActivationPayment" | "OrdersPayment";

export async function uploadImageFirebase(file: File, folder: FolderType, id?: string) {

    const customID = id || uuIdV4()

    // Convert the file to a buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Convert the image to WebP format
    const webpImageBuffer = await sharp(fileBuffer)
        .png({ quality: 80 })
        .toBuffer();


    const fileRef = ref(storage, `${folder}/${customID}.png`);

    try {
        // Upload the file
        const snapshot = await uploadBytes(fileRef, webpImageBuffer);
        // const snapshot = await uploadBytes(fileRef, file);

        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        return {
            url: downloadURL,
        };
    } catch (error) {
        console.error("Upload error:", error);
        throw error;
    }
}