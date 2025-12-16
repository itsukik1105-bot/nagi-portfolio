import { useState, useEffect } from 'react'

const TABLET_BREAKPOINT = 1024 // タブレットも含める

/**
 * スマホ・タブレットかどうかを判定するフック
 */
export function useIsMobileOrTablet() {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      // 画面幅での判定
      const isSmallScreen = window.innerWidth < TABLET_BREAKPOINT
      
      // タッチデバイスかどうかの判定
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      setIsMobileOrTablet(isSmallScreen || isTouchDevice)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  return isMobileOrTablet
}