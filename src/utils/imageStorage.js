/**
 * Image storage & compression utility for EcoWatch AI.
 * Resolves localStorage QuotaExceededError by:
 * 1. Performing client-side HTML5 Canvas compression on uploaded images.
 * 2. Persisting full-resolution compressed images in browser IndexedDB.
 * 3. Falling back safely to lightweight Data URLs if IndexedDB is unavailable.
 */

const DB_NAME = 'ecowatch_media_db';
const STORE_NAME = 'images';
const DB_VERSION = 1;

let dbPromise = null;

function getDB() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      console.warn('IndexedDB failed to open, falling back to in-memory/localStorage', event.target.error);
      resolve(null);
    };
  });

  return dbPromise;
}

/**
 * Save an image to IndexedDB.
 * @param {string} key - Unique key (e.g., report ID 'REP-2041')
 * @param {string} dataUrl - Compressed Data URL or blob
 */
export async function saveImageToIndexedDB(key, dataUrl) {
  try {
    const db = await getDB();
    if (!db) return false;

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(dataUrl, key);

      req.onsuccess = () => resolve(true);
      req.onerror = (e) => {
        console.warn('Failed to store image in IndexedDB', e);
        resolve(false);
      };
    });
  } catch (err) {
    console.warn('IndexedDB write error', err);
    return false;
  }
}

/**
 * Retrieve an image from IndexedDB.
 * @param {string} key - Unique key
 * @returns {Promise<string|null>}
 */
export async function getImageFromIndexedDB(key) {
  try {
    const db = await getDB();
    if (!db) return null;

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);

      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    console.warn('IndexedDB read error', err);
    return null;
  }
}

/**
 * Delete an image from IndexedDB.
 * @param {string} key - Unique key
 */
export async function deleteImageFromIndexedDB(key) {
  try {
    const db = await getDB();
    if (!db) return false;

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);

      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  } catch (err) {
    return false;
  }
}

/**
 * Compress an image file using an offscreen HTML5 canvas.
 * Reduces raw 5-15MB camera uploads to ~60-150KB JPEG without visible artifacting.
 *
 * @param {File} file - Original uploaded File object
 * @param {number} maxWidth - Maximum bounding width (default 1200px)
 * @param {number} maxHeight - Maximum bounding height (default 1200px)
 * @param {number} quality - JPEG compression quality 0.0 - 1.0 (default 0.72)
 * @returns {Promise<{ dataUrl: string, originalSize: number, compressedSize: number }>}
 */
export function compressImageFile(file, maxWidth = 1200, maxHeight = 1200, quality = 0.72) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image.'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate proportional scale
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to uncompressed dataUrl if canvas context is unavailable
          resolve({
            dataUrl: e.target.result,
            originalSize: file.size,
            compressedSize: file.size,
          });
          return;
        }

        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG with controlled quality
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

        // Estimate size in bytes from base64 string
        const base64Length = compressedDataUrl.length - (compressedDataUrl.indexOf(',') + 1);
        const compressedSize = Math.round((base64Length * 3) / 4);

        resolve({
          dataUrl: compressedDataUrl,
          originalSize: file.size,
          compressedSize,
        });
      };

      img.onerror = () => {
        reject(new Error('Failed to decode image data. The file may be corrupt.'));
      };

      img.src = e.target.result;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read image file from disk.'));
    };

    reader.readAsDataURL(file);
  });
}

