"use client";
import { useState, useEffect, useCallback } from "react";
import { useFavorites, type FavoriteAnnouncement } from "./display";
import {
  Trash2,
  ExternalLink,
  Calendar,
  User,
  Building2,
  File,
  Folder,
  RefreshCcw,
} from "lucide-react";
import Link from "next/link";

export function FavoritesList() {
  const { getAllFavorites, favoritesDB } = useFavorites();
  const [favorites, setFavorites] = useState<FavoriteAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const favoritesList = await getAllFavorites();
      setFavorites(favoritesList);
    } catch (error) {
      console.error("載入收藏列表失敗:", error);
    } finally {
      setLoading(false);
    }
  }, [getAllFavorites]);

  const removeFavorite = async (id: string) => {
    try {
      await favoritesDB.removeFavorite(id);
      await loadFavorites(); // 重新載入列表
    } catch (error) {
      console.error("移除收藏失敗:", error);
      alert("移除收藏失敗，請稍後再試");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateContent = (content: string[], maxLength: number = 100) => {
    const fullText = content.join(" ").replace(/<[^>]*>/g, ""); // 移除 HTML 標籤
    return fullText.length > maxLength
      ? fullText.substring(0, maxLength) + "..."
      : fullText;
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 rounded-full border-2 border-t-foreground border-inputPrimary animate-spin"></div>
        <p className="ml-3">載入收藏中...</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <Folder size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          還沒有收藏任何公告
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
          當你看到感興趣的公告時，點擊收藏按鈕就能在這裡找到它們
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="w-full items-center justify-center flex mb-3">
        <div className="w-10 bg-borderColor rounded-full h-1.5"></div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-medium font-sans">
            我的收藏 ({favorites.length})
          </h2>
          <p className="opacity-50 text-[14px]">公告皆是離線儲存在您的手機上</p>
        </div>
        <button
          onClick={loadFavorites}
          className="bg-background p-2 flex items-center justify-center rounded-full"
        >
          <RefreshCcw size={18} />
        </button>
      </div>

      <div className="grid gap-4 overflow-y-auto max-h-[50dvh]">
        {favorites.map((favorite) => (
          <div
            key={favorite.id}
            className="h-fit bg-background rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* 頭部信息 */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Building2
                    size={16}
                    className="text-blue-600 dark:text-blue-400"
                  />
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    {favorite.publisher}
                  </span>
                </div>
                <h3
                  className="text-lg font-medium text-gray-900 dark:text-gray-100 overflow-hidden"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {favorite.title}
                </h3>
              </div>
              <button
                onClick={() => removeFavorite(favorite.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="移除收藏"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* 內容預覽 */}
            <div className="mb-3">
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {truncateContent(favorite.content)}
              </p>
            </div>

            {/* 附件信息 */}
            {favorite.attachments && favorite.attachments.length > 0 && (
              <div className="mb-3 p-2 bg-hoverbg rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <File size={16} />
                  <span>包含 {favorite.attachments.length} 個附件</span>
                </div>
              </div>
            )}

            {/* 詳細信息和操作 */}
            <div className="flex flex-col justify-between pt-3 border-t border-borderColor w-full">
              <div className="flex whitespace-nowrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <User size={12} />
                  <span>{favorite.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{favorite.dateRange}</span>
                </div>
              </div>

              <div className="flex items-center w-full justify-between gap-2">
                <span className="text-xs text-gray-400">
                  收藏於 {formatDate(favorite.savedAt)}
                </span>
                <div className="flex gap-1">
                  <Link
                    href={favorite.url}
                    target="_blank"
                    className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="前往原始頁面"
                  >
                    <ExternalLink size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoritesList;
