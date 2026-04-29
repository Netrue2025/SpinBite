export function youtubeEmbedUrl(videoUrl: string) {
  try {
    const url = new URL(videoUrl);

    if (url.hostname.includes("youtube.com") && url.pathname.startsWith("/embed/")) {
      return videoUrl;
    }

    if (url.hostname.includes("youtube.com")) {
      const id = url.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : videoUrl;
    }

    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : videoUrl;
    }

    return videoUrl;
  } catch {
    return videoUrl;
  }
}

export function youtubeWatchUrl(videoUrl: string) {
  try {
    const embedUrl = new URL(youtubeEmbedUrl(videoUrl));

    if (embedUrl.hostname.includes("youtube.com") && embedUrl.pathname.startsWith("/embed/")) {
      const id = embedUrl.pathname.replace("/embed/", "");
      return id ? `https://www.youtube.com/watch?v=${id}` : videoUrl;
    }

    return videoUrl;
  } catch {
    return videoUrl;
  }
}
