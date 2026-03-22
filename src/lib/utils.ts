export function getAssetPath(path: string): string {
  const basePath = "/cooking-recipes";
  // If path starts with http or is already relative, return as is
  if (path.startsWith("http") || !path.startsWith("/")) {
    return path;
  }
  return `${basePath}${path}`;
}
