import { useEffect } from 'react'

/**
 * コンテンツ保護フック
 * - 画像の右クリック・長押し・ドラッグ無効化
 * - テキスト選択無効化（連絡先は除外）
 * 
 * ※ .selectable クラスを持つ要素は選択可能
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

    // コンテンツ保護CSS
    const style = document.createElement('style')
    style.id = 'content-protection-style'
    style.textContent = `
      /* 画像・動画の保護 */
      img, video {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
        pointer-events: auto;
      }
      
      /* テキスト選択無効化（全体） */
      body {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      
      /* 選択可能にする要素（連絡先など） */
      .selectable,
      .selectable * {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
      
      /* input, textareaは常に選択可能 */
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
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