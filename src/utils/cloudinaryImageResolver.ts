export function getCloudinaryUrl(
    publicId: string, 
    cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME, 
    transformations?: string
): string {
  const base = `https://res.cloudinary.com/${cloudName}/image/upload`;
  return transformations
    ? `${base}/${transformations}/${publicId}`
    : `${base}/${publicId}`;
}
