import { useState, useEffect } from "react";
import axios from "axios";

export const usePublicGallery = (slug) => {
  const [gallery, setGallery] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      axios
        .get(`/api/gallery/public/${slug}/`)
        .then((res) => setGallery(res.data))
        .catch((e) => setError(e.response));
    }
  }, [slug]);

  return { gallery, error };
};
