import { useState, useEffect, useRef, RefObject } from 'react'

interface UseInViewCenterOptions {
  threshold?: number
  rootMargin?: string
}

/**
 * 要素が画面の中央付近にあるかを検出するフック
 * スマホ/タブレット専用で使用することを想定
 */
export function useInViewCenter<T extends HTMLElement>(
  options: UseInViewCenterOptions = {}
): [RefObject<T>, boolean] {
  const { threshold = 0.5, rootMargin = '-30% 0px -30% 0px' } = options
  const ref = useRef<T>(null)
  const [isInCenter, setIsInCenter] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInCenter(entry.isIntersecting)
      },
      {
        threshold,
        rootMargin, // 上下30%をカットして中央40%のみを検出エリアに
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, rootMargin])

  return [ref as RefObject<T>, isInCenter]
}