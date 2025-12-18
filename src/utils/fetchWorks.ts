import Papa from 'papaparse'
import { type Work } from '../data/works'

// あなたのスプレッドシートURL（変更不要）
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSMlkhh8iMgNQ8JV5bLiMEtc8eBx0lJlj9wmYjk380j-iInJ5nQzDmRv_5F4VD4vvbvB3_EiTWALFW4/pub?gid=1868272004&single=true&output=csv'

export const fetchWorks = async (): Promise<Work[]> => {
  return new Promise((resolve, reject) => {
    // キャッシュ回避のため、URLに現在時刻を付与
    const noCacheUrl = `${SHEET_URL}&t=${Date.now()}`

    Papa.parse(noCacheUrl, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          // スプレッドシートのデータをWork型に変換
          const works = results.data.map((row: any) => ({
            id: row.id,
            title: row.title,
            category: row.category,
            year: Number(row.year),
            thumbnail: row.thumbnail || undefined,
            // 3パターンの動画URL（スプレッドシートから自動取得）
            videoUrl: row.videoUrl || undefined,           // 直接埋め込み（MP4等）
            youtubeUrl: row.youtubeUrl || undefined,       // YouTube埋め込み
            externalVideoUrl: row.externalVideoUrl || undefined, // 外部リンク（Instagram等）
            role: row.role || undefined,
            // gallery列が存在する場合、'|' で区切って配列にする
            gallery: row.gallery ? row.gallery.split('|').map((url: string) => url.trim()) : undefined,
            // 作品詳細（4段構成）
            about: row.about || undefined,
            concept: row.concept || undefined,
            process: row.process || undefined,
            client: row.client || undefined,
          }))
          
          // IDとタイトルがある有効なデータだけを返す
          const validWorks = works.filter((w) => w.id && w.title) as Work[]
          console.log("Fetched works:", validWorks)
          resolve(validWorks)
        } catch (e) {
          console.error('Data parsing error:', e)
          reject(e)
        }
      },
      error: (error) => {
        console.error('Papa Parse error:', error)
        reject(error)
      },
    })
  })
}