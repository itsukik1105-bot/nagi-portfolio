// スプレッドシートの項目に合わせて型定義を更新
export interface Work {
  id: string
  title: string
  category: string
  year: number
  thumbnail: string
  videoUrl?: string          // 直接埋め込み動画（MP4等）
  youtubeUrl?: string        // YouTube埋め込み用URL
  externalVideoUrl?: string  // 外部リンク（Instagram Reels等）
  description: string
  role: string
  gallery?: string[]         // 複数画像のURLリスト
}

// 初期データは空配列（fetchWorksで取得）
export const works: Work[] = []