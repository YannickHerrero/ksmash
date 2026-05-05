import { useState, useEffect } from "react";

const CACHE = {};

// Fetch thumbnail from Wikipedia REST API
async function fetchImage(wikiSlug) {
  if (CACHE[wikiSlug]) return CACHE[wikiSlug];

  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiSlug)}`
    );
    if (!res.ok) throw new Error("Not found");
    const data = await res.json();

    // Get the highest-res thumbnail available
    const url = data.originalimage?.source || data.thumbnail?.source || null;
    CACHE[wikiSlug] = url;
    return url;
  } catch {
    CACHE[wikiSlug] = null;
    return null;
  }
}

export function useWikiImage(wikiSlug) {
  const [url, setUrl] = useState(CACHE[wikiSlug] || null);
  const [loading, setLoading] = useState(!CACHE[wikiSlug]);

  useEffect(() => {
    if (CACHE[wikiSlug]) {
      setUrl(CACHE[wikiSlug]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchImage(wikiSlug).then((result) => {
      if (!cancelled) {
        setUrl(result);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [wikiSlug]);

  return { url, loading };
}

// Prefetch images for a batch of groups
export function prefetchImages(groups) {
  for (const group of groups) {
    if (!CACHE[group.wiki]) {
      fetchImage(group.wiki);
    }
  }
}
