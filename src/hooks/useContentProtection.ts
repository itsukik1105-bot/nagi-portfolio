import { useEffect } from 'react'

/**
 * 画像コンテンツ保護フック
 * - 画像の右クリック無効化
 * - 画像の長押し無効化（モバイル）
 * - 画像ドラッグ無効化
 * 
 * ※テキスト選択や通常のリンク右クリックは有効のまま（UIUX維持）
 */
export function useContentProtection() {
  useEffect(() => {
    // 画像の右クリック無効化（画像要素のみ）
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'IMG' || target.closest('video')) {
        e.preventDefault()
        return false
      }
    }

    // 画像のドラッグ無効化
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'IMG') {
        e.preventDefault()
        return false
      }
    }

    // モバイルの長押し保存防止CSS（画像・動画のみ）
    const style = document.createElement('style')
    style.id = 'content-protection-style'
    style.textContent = `
      img, video {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }
    `
    document.head.appendChild(style)

    // イベントリスナー登録
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('dragstart', handleDragStart)

    // クリーンアップ
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('dragstart', handleDragStart)
      const existingStyle = document.getElementById('content-protection-style')
      if (existingStyle) {
        existingStyle.remove()
      }
    }
  }, [])
}