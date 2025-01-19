export const validateThumbnailUrl = (
  url: string
): { isValid: boolean; message: string } => {
  if (url.length > 31) {
    return {
      isValid: false,
      message:
        "URL is too long (max 31 characters). Please use a URL shortener like https://tinyurl.com/",
    };
  }

  try {
    new URL(url);
    return { isValid: true, message: "" };
  } catch {
    return { isValid: false, message: "Please enter a valid URL" };
  }
};
