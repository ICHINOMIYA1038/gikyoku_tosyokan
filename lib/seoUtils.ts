// SEO用のユーティリティ関数

/**
 * テキストを指定文字数で切り取り、省略記号を追加
 * @param text 対象テキスト
 * @param maxLength 最大文字数（デフォルト：120）
 * @returns 切り取られたテキスト
 */
export const truncateText = (text: string, maxLength: number = 120): string => {
  if (!text) return "";
  
  // HTMLタグを削除
  const plainText = text.replace(/<[^>]*>/g, "");
  
  if (plainText.length <= maxLength) return plainText;
  
  // 文の区切りで切る
  const truncated = plainText.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf("。");
  
  if (lastPeriod > maxLength * 0.7) {
    return truncated.substring(0, lastPeriod + 1);
  }
  
  return truncated.substring(0, maxLength - 3) + "...";
};

/**
 * 作品用のメタディスクリプション生成
 * @param post 作品データ
 * @returns メタディスクリプション
 */
export const generatePostDescription = (post: any): string => {
  const parts = [];
  
  // 作者名と作品名
  if (post.author?.name && post.title) {
    parts.push(`${post.author.name}作『${post.title}』`);
  }
  
  // 上演時間
  if (post.playtime && post.playtime !== -1) {
    parts.push(`上演時間約${post.playtime}分`);
  }
  
  // 登場人物数
  const personCount = [];
  if (post.man && post.man !== -1) personCount.push(`男${post.man}人`);
  if (post.woman && post.woman !== -1) personCount.push(`女${post.woman}人`);
  if (personCount.length > 0) {
    parts.push(`登場人物：${personCount.join("、")}`);
  }
  
  // あらすじがある場合は追加
  if (post.synopsis) {
    const truncatedSynopsis = truncateText(post.synopsis, 80);
    parts.push(truncatedSynopsis);
  }
  
  // デフォルト文言を追加
  parts.push("戯曲図書館で詳細をご覧ください。");
  
  return parts.join("。").replace(/。。/g, "。");
};

/**
 * カテゴリー用のメタディスクリプション生成
 * @param category カテゴリーデータ
 * @returns メタディスクリプション
 */
export const generateCategoryDescription = (category: any): string => {
  const postCount = category.posts?.length || 0;
  const description = category.description || "";
  
  let result = `「${category.name}」カテゴリーの戯曲作品一覧。`;
  
  if (postCount > 0) {
    result += `全${postCount}作品を掲載。`;
  }
  
  if (description) {
    result += truncateText(description, 80);
  }
  
  result += "上演時間や人数で検索可能。戯曲図書館。";
  
  return result;
};

/**
 * 作者用のメタディスクリプション生成
 * @param author 作者データ
 * @returns メタディスクリプション
 */
export const generateAuthorDescription = (author: any): string => {
  const postCount = author.posts?.length || 0;
  
  let result = `${author.name}の戯曲作品一覧。`;
  
  if (postCount > 0) {
    result += `全${postCount}作品を掲載。`;
    
    // 代表作があれば追加
    if (author.posts && author.posts.length > 0) {
      const titles = author.posts.slice(0, 3).map((p: any) => `『${p.title}』`);
      result += `代表作：${titles.join("、")}など。`;
    }
  }
  
  result += "戯曲図書館で全作品をチェック。";
  
  return result;
};

/**
 * SEO用のタイトル生成
 * @param pageTitle ページタイトル
 * @param siteName サイト名
 * @param separator 区切り文字
 * @returns SEOタイトル
 */
/**
 * 劇団用のメタディスクリプション生成
 * theater-groups/[slug]とshogekijo/[slug]の両方で使用可能
 */
export const generateTheaterGroupDescription = (group: any): string => {
  const parts: string[] = [];

  // 劇団名 + 種別
  const typeLabels: Record<string, string> = {
    STUDENT: '学生劇団',
    INTERCOLLEGE: 'インカレ劇団',
    ACADEMIC: '大学演劇学科',
    AMATEUR: '社会人劇団',
    PROFESSIONAL: 'プロ劇団',
    YOUTH: 'ユース劇団',
  };
  const typeLabel = typeLabels[group.groupType] || '劇団';
  parts.push(`${group.name}は${typeLabel}`);

  // 都道府県
  const prefecture = group.prefecture || group.universities?.[0]?.university?.prefecture;
  if (prefecture) {
    parts.push(`${prefecture}を拠点に活動`);
  }

  // 設立年
  if (group.foundedYear) {
    parts.push(`${group.foundedYear}年設立`);
  }

  // 部員数
  if (group.memberCount) {
    parts.push(`部員数${group.memberCount}名`);
  }

  let result = parts.join('、') + '。';

  // description概要
  if (group.description) {
    result += truncateText(group.description, 80);
  }

  return result;
};

export const generateSeoTitle = (
  pageTitle?: string,
  siteName: string = "戯曲図書館",
  separator: string = " | "
): string => {
  if (!pageTitle) return siteName;
  
  // タイトルが長すぎる場合は調整
  const maxLength = 60;
  const fullTitle = `${pageTitle}${separator}${siteName}`;
  
  if (fullTitle.length > maxLength) {
    const availableLength = maxLength - siteName.length - separator.length - 3;
    const truncatedTitle = pageTitle.substring(0, availableLength) + "...";
    return `${truncatedTitle}${separator}${siteName}`;
  }
  
  return fullTitle;
};