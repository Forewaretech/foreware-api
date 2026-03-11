export const cleanFileName = (fileName: string) => {
  // 1. Separate the extension from the name
  const lastDotIndex = fileName.lastIndexOf(".");

  // If there's no dot, just clean the whole thing and add timestamp
  if (lastDotIndex === -1)
    return `${fileName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;

  const namePart = fileName.substring(0, lastDotIndex);
  const extension = fileName.substring(lastDotIndex); // e.g., ".jpg"

  // 2. Clean only the name part
  const cleanedName = namePart
    .toLowerCase()
    .replace(/\s+/g, "-") // Spaces to hyphens
    .replace(/[^a-z0-9-]/g, "") // Remove special characters (except hyphens)
    .replace(/-+/g, "-"); // Collapse multiple hyphens

  // 3. Reconstruct: name-timestamp.extension
  return `${cleanedName}-${Date.now()}${extension}`;
};
