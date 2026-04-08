import { useState, useEffect, useCallback } from "react";
import { urlService } from "../services/urlService";

// Local store for links
const LINKS_KEY = "snapurl_links";

function getStoredLinks() {
  try {
    return JSON.parse(localStorage.getItem(LINKS_KEY)) || [];
  } catch {
    return [];
  }
}

function setStoredLinks(links) {
  localStorage.setItem(LINKS_KEY, JSON.stringify(links));
}

export function useLinks() {
  const [links, setLinks] = useState(getStoredLinks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user links on mount
  useEffect(() => {
    const fetchUserLinks = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await urlService.getUserLinks();
        const userLinks = data.links || [];
        setLinks(userLinks);
        setStoredLinks(userLinks);
      } catch (err) {
        console.error("Failed to fetch user links:", err);
        setError(err.message);
        // Fall back to stored links if API fails
        setLinks(getStoredLinks());
      } finally {
        setLoading(false);
      }
    };

    fetchUserLinks();
  }, []);

  const addLink = useCallback((linkData) => {
    setLinks((prev) => {
      const next = [linkData, ...prev];
      setStoredLinks(next);
      return next;
    });
  }, []);

  const removeLink = useCallback(async (shortId) => {
    try {
      await urlService.deleteLink(shortId);
      setLinks((prev) => {
        const next = prev.filter((l) => l.shortId !== shortId);
        setStoredLinks(next);
        return next;
      });
    } catch (err) {
      throw err;
    }
  }, []);

  const refreshPreview = useCallback(async (shortId) => {
    try {
      const data = await urlService.preview(shortId);
      setLinks((prev) => {
        const next = prev.map((l) =>
          l.shortId === shortId ? { ...l, ...data } : l
        );
        setStoredLinks(next);
        return next;
      });
    } catch (err) {
      // silently fail
    }
  }, []);

  const clearLinks = useCallback(() => {
    setLinks([]);
    setStoredLinks([]);
  }, []);

  return { links, addLink, removeLink, refreshPreview, clearLinks, loading, error };
}