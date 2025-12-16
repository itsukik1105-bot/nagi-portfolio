// src/hooks/useGlitchText.ts

import { useState, useRef, useCallback } from 'react'

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"

// 任意のテキストに対してグリッチエフェクトを提供するカスタムフック
export function useGlitchText(initialText: string) {
  const [displayText, setDisplayText] = useState(initialText)
  const intervalRef = useRef<any>(null)

  // ホバー開始時に呼び出す関数
  const triggerGlitch = useCallback(() => {
    let iteration = 0
    clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      setDisplayText(() =>
        initialText.split("").map((letter, index) => {
          // 既に元の文字に戻った部分はそのまま、それ以降はランダムな文字に
          if (index < iteration) return letter
          // 空白はそのままにする（自然に見せるため）
          if (letter === " ") return " "
          // ランダムな文字を生成
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        }).join("")
      )

      // 全ての文字が元に戻ったら終了
      if (iteration >= initialText.length) {
        clearInterval(intervalRef.current)
      }

      // 少しずつ元の文字に戻していくスピード調整
      iteration += 1 / 3
    }, 30) // 更新頻度（ミリ秒）
  }, [initialText])

  return { displayText, triggerGlitch }
}