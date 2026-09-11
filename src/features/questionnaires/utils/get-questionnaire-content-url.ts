export function getQuestionnaireContentUrl(contentFilePath: string | null | undefined): string | null {
  if (!contentFilePath) {
    return null;
  }

  if (contentFilePath.startsWith('http')) {
    return contentFilePath;
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    return contentFilePath;
  }

  const apiOrigin = apiBaseUrl.replace(/\/api\/?$/, '');

  return `${apiOrigin}${contentFilePath}`;
}
