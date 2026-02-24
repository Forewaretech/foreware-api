export const cleanFileName = (fileName: string) => {
  return (
    fileName
      .toLowerCase()
      .replace(/\s+/g, "-") // Spaces to hyphens
      .replace(/[^a-z0-9.-]/g, "") + // Remove special characters
    "-" +
    Date.now()
  ); // Add timestamp for uniqueness
};
