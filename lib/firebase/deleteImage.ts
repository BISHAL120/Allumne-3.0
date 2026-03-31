import { deleteObject, getStorage, ref } from "firebase/storage";

// Delete image from Firebase if exists
export const deleteFirebaseImage = async (imageUrl: string) => {

    const oldImageUrl = new URL(imageUrl);

    const imagePath = decodeURIComponent(
        oldImageUrl.pathname.split("/o/")[1].split("?")[0]
    );

    const storage = getStorage();
    const imageRef = ref(storage, imagePath); // Use direct path
    await deleteObject(imageRef);
}