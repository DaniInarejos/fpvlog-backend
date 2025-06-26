import { storage } from '../configs/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

interface UploadImageOptions {
  folder: string      
  fileName: string    
  maxSizeInMB?: number 
}

export const uploadImageService = async (
  file: { type: string, arrayBuffer: () => Promise<ArrayBuffer>, name: string },
  options: UploadImageOptions
): Promise<string> => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!validTypes.includes(file.type)) {
    throw new Error('Formato de imagen no válido. Use: JPG, PNG, GIF o WEBP')
  }

  const maxSize = (options.maxSizeInMB || 5) * 1024 * 1024
  const buffer = await file.arrayBuffer()
  if (buffer.byteLength > maxSize) {
    throw new Error(`La imagen no debe superar los ${options.maxSizeInMB || 5}MB`)
  }

  const storageRef = ref(storage, `${options.folder}/${options.fileName}-${Date.now()}-${file.name}`)
  
  const snapshot = await uploadBytes(storageRef, buffer)
  
  return await getDownloadURL(snapshot.ref)
}