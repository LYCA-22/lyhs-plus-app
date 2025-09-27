import { useCallback, useState } from "react";
import { AdItem } from "./display";

export interface FavoriteAnnouncement extends AdItem {
  id: string;
  url: string;
  savedAt: string;
}

// IndexedDB 管理工具
export class FavoritesDB {
  private dbName = "Lyps_Announcements_Saved";
  private version = 1;
  private storeName = "announcements";

  async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: "id" });
          store.createIndex("savedAt", "savedAt", { unique: false });
          store.createIndex("url", "url", { unique: false });
        }
      };
    });
  }

  async addFavorite(announcement: FavoriteAnnouncement): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.put(announcement);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async removeFavorite(id: string): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getFavorite(id: string): Promise<FavoriteAnnouncement | null> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async getAllFavorites(): Promise<FavoriteAnnouncement[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const index = store.index("savedAt");
      const request = index.openCursor(null, "prev"); // 按保存時間倒序

      const results: FavoriteAnnouncement[] = [];
      request.onerror = () => reject(request.error);
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
    });
  }

  async isFavorite(url: string): Promise<boolean> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const index = store.index("url");
      const request = index.get(url);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(!!request.result);
    });
  }

  async getFavoriteByUrl(url: string): Promise<FavoriteAnnouncement | null> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const index = store.index("url");
      const request = index.get(url);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }
}

// 收藏功能的 hook
export const useFavorites = () => {
  const [favoritesDB] = useState(() => new FavoritesDB());
  const [isFavoriteState, setIsFavoriteState] = useState<{
    [url: string]: boolean;
  }>({});

  const checkIsFavorite = useCallback(
    async (url: string) => {
      try {
        const result = await favoritesDB.isFavorite(url);
        setIsFavoriteState((prev) => ({ ...prev, [url]: result }));
        return result;
      } catch (error) {
        console.error("檢查收藏狀態失敗:", error);
        return false;
      }
    },
    [favoritesDB],
  );

  const toggleFavorite = async (url: string, adData: AdItem | null) => {
    if (!adData) return;

    try {
      const isCurrentlyFavorite = await favoritesDB.isFavorite(url);

      if (isCurrentlyFavorite) {
        // 移除收藏
        const existingFavorite = await favoritesDB.getFavoriteByUrl(url);
        if (existingFavorite) {
          await favoritesDB.removeFavorite(existingFavorite.id);
        }
        setIsFavoriteState((prev) => ({ ...prev, [url]: false }));
      } else {
        // 添加收藏
        const favoriteAnnouncement: FavoriteAnnouncement = {
          id: `favorite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          url,
          title: adData.title,
          content: adData.content,
          attachments: adData.attachments,
          publisher: adData.publisher,
          author: adData.author,
          dateRange: adData.dateRange,
          savedAt: new Date().toISOString(),
        };

        await favoritesDB.addFavorite(favoriteAnnouncement);
        setIsFavoriteState((prev) => ({ ...prev, [url]: true }));
      }
    } catch (error) {
      console.error("收藏操作失敗:", error);
      alert("收藏操作失敗，請稍後再試");
    }
  };

  const getAllFavorites = async () => {
    try {
      return await favoritesDB.getAllFavorites();
    } catch (error) {
      console.error("獲取收藏列表失敗:", error);
      return [];
    }
  };

  const isFavorite = (url: string) => {
    return isFavoriteState[url] || false;
  };

  return {
    isFavorite,
    toggleFavorite,
    checkIsFavorite,
    getAllFavorites,
    favoritesDB,
  };
};
