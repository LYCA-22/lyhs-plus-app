export const formatDate = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString.replace(/\//g, "-"));
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours < 24) {
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        if (diffMinutes < 60) {
          return diffMinutes <= 0 ? "剛剛" : `${diffMinutes}分鐘前`;
        }
      }
      return `${diffHours}小時前`;
    }
    return "今天";
  } else if (diffDays === 1) {
    return "昨天";
  } else if (diffDays === 2) {
    return "前天";
  } else if (diffDays < 7) {
    return `${diffDays}天前`;
  } else if (now.getFullYear() === date.getFullYear()) {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }

  return dateString;
};
