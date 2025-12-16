// スプレッドシートの項目に合わせて型定義を更新
export interface Work {
  id: string
  title: string
  category: string
  year: number
  thumbnail: string
  videoUrl: string
  description: string
  role: string
  gallery?: string[] // 追加: 複数画像のURLリスト（存在しない場合もあるので ? をつける）
}

// 初期データは空配列にしておきます
export const works: Work[] = []