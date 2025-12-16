import { useEffect, useRef, useState } from 'react'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    // カーソル位置の追跡
    const moveCursor = (e: MouseEvent) => {
      // メインの点（即座に移動）
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      }
      // 遅れてくる円（少し遅延させるアニメーションはCSSではなくrequestAnimationFrameでやるのが理想ですが、今回は簡易的にCSS transitionで味付けします）
      if (followerRef.current) {
        // フォロワーは少しずらすと「慣性」っぽく見えますが、今回はシンプルに追従
        followerRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      }
    }

    // リンクへのホバー検知
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // ボタン、リンク、画像などに乗ったとき
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.closest('.cursor-pointer')
      ) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [])

  // スマホでは表示しない
  if (typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
    return null
  }

  return (
    <>
      <style>{`
        .custom-cursor {
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: difference; /* 背景色と反転して常に視認可能に */
        }
        .cursor-dot {
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
          margin-top: -4px;
          margin-left: -4px;
        }
        .cursor-follower {
          width: 40px;
          height: 40px;
          border: 1px solid white;
          border-radius: 50%;
          margin-top: -20px;
          margin-left: -20px;
          transition: transform 0.1s ease-out, width 0.3s ease, height 0.3s ease, background-color 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        /* ホバー時のスタイル変形 */
        .cursor-follower.is-hovering {
          width: 80px;
          height: 80px;
          margin-top: -40px;
          margin-left: -40px;
          background-color: white;
          border-color: transparent;
          opacity: 0.1; /* 薄く光る */
        }
      `}</style>
      
      {/* 小さい点 */}
      <div ref={cursorRef} className="custom-cursor cursor-dot"></div>
      
      {/* 大きい円（フォロワー） */}
      <div 
        ref={followerRef} 
        className={`custom-cursor cursor-follower ${isHovering ? 'is-hovering' : ''}`}
      ></div>
    </>
  )
}