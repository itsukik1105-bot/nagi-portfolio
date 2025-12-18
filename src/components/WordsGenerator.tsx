import { useState, useEffect, useRef } from 'react'
import { ArrowDown, Sparkles } from 'lucide-react'

interface GeneratedStory {
  title: string
  body: string
}

// 隠しコマンド（隠しストーリー）の定義
// キーワードは小文字に変換して判定されるため、ここでのキーは小文字で定義してください
const HIDDEN_STORIES: Record<string, GeneratedStory> = {
  "フィクション": {
    title: "嘘と夢",
    body: "全部、夢かもしれない。時々そう考えてぞっとすることがある。私のこの人生も、私のような小説家が描いたものだったりして。それでも良い。お願い、まだ夢を見させて。"
  },
  "ユリイカ": {
    title: "海と月",
    body: "東京は明るすぎて、逆に見なくていいものまで映っちゃうから。真っ暗な海でしか見えないものがある。それを探すために、僕らはここに来たんだと思う。"
  },
  "中古少女": {
    title: "B面",
    body: "新品の服は、まだ誰の物語も纏っていない。私が好きなのは、誰かの生活が染み付いた古着。歴史的な必然性を持ちつつ、ミステリとして精巧な、ポール・ドハティのような物語。"
  },
  "LOVE♡ずっきゅん": {
    title: "ピンク色の狂気",
    body: "無機質な都市のノイズに紛れ込む、メイド服の少女たち。愛されたいという渇望が、いつしか凶器に変わる。LOVEずっきゅん♡"
  },
  "LOVEずっきゅん": {
    title: "ピンク色の狂気",
    body: "無機質な都市のノイズに紛れ込む、メイド服の少女たち。愛されたいという渇望が、いつしか凶器に変わる。LOVEずっきゅん♡"
  },
  "loveずっきゅん": {
    title: "ピンク色の狂気",
    body: "無機質な都市のノイズに紛れ込む、メイド服の少女たち。愛されたいという渇望が、いつしか凶器に変わる。LOVEずっきゅん♡"
  },
  "LOVEズッキュン": {
    title: "ピンク色の狂気",
    body: "無機質な都市のノイズに紛れ込む、メイド服の少女たち。愛されたいという渇望が、いつしか凶器に変わる。LOVEずっきゅん♡"
  },
  "loveズッキュン": {
    title: "ピンク色の狂気",
    body: "無機質な都市のノイズに紛れ込む、メイド服の少女たち。愛されたいという渇望が、いつしか凶器に変わる。LOVEずっきゅん♡"
  },
  "error": {
    title: "Fatal Error",
    body: "システム警告: 感情の容量がオーバーフローしています。このリクエストは処理できません。…嘘です。ただ、少し泣きたいだけなんです。"
  },
  "404": {
    title: "Not Found",
    body: "探しているものは、ここにはありません。あるいは、最初からどこにもなかったのかもしれません。幻影を追いかけるのは、もう終わりにしませんか？"
  },
  "ゼンガ": {
    title: "絶望",
    body: "9月は　ゼンガで　酒が飲めるぞ　"
  },
  "サテスタ": {
    title: "睡眠不足",
    body: "サテ期間中に編集が進むなんて思うな。"
  }
};

export function WordsGenerator() {
  const [theme, setTheme] = useState('')
  const [story, setStory] = useState<GeneratedStory | null>(null)
  const [displayedWords, setDisplayedWords] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  
  // ページロード後、少ししてからボタンを表示するフラグ
  const [isVisible, setIsVisible] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  // ページ読み込み時にボタンを表示
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // タイプライター効果
  useEffect(() => {
    if (!story || isGenerating) {
      setDisplayedWords('')
      return
    }

    setIsTyping(true)
    setDisplayedWords('')
    
    const text = story.body || ''
    const chars = Array.from(text)
    let index = 0
    
    const timer = setInterval(() => {
      if (index < chars.length) {
        const char = chars[index]
        if (char !== undefined) {
          setDisplayedWords(prev => prev + char)
        }
        index++
      } else {
        clearInterval(timer)
        setIsTyping(false)
      }
    }, 30)

    return () => clearInterval(timer)
  }, [story, isGenerating])

  const scrollToGenerator = () => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true })
    }, 800)
  }

  // 指定ミリ秒待機するヘルパー関数
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // 利用するモデルの候補リスト（優先順）
  const MODEL_CANDIDATES = [
    'gemini-2.5-flash',       // 最新版
    'gemini-2.0-flash',       // 安定版
    'gemini-2.5-flash-lite',  // 軽量版
    'gemini-1.5-flash'        // 旧安定版
  ];

  const generateWords = async () => {
    if (!theme.trim()) {
      inputRef.current?.focus()
      return
    }

    setIsGenerating(true)
    setStory(null)
    setDisplayedWords('')

    // ■ 隠しコマンドの判定
    const normalizedTheme = theme.trim().toLowerCase();
    if (HIDDEN_STORIES[normalizedTheme]) {
      // 生成中の演出（少し待たせることでAIっぽく見せる）
      await wait(1500);
      
      setStory(HIDDEN_STORIES[normalizedTheme]);
      setIsGenerating(false);
      return; // APIは呼ばずに終了
    }

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim()
      
      if (!apiKey) {
        throw new Error('APIキー (VITE_GEMINI_API_KEY) が見つかりません。.envファイルを確認してください。')
      }

      const nagiPersona = `
あなたは映像作家・脚本家「nagi」として、テーマ「${theme}」から架空の物語の冒頭（タイトル＋本文100字程度）を創作してください。行や段落は適宜改行し、読みやすくしてください。
過去作のキャラクターや職業設定（カメラマン、メイド、小説家など）をそのまま使うのではなく、以下の「nagi的エッセンス」を抽出して、全く新しい情景を描いてください。

【nagi的エッセンス（抽象的定義）】
1. **監督・脚本家としての視点と距離感**
   - 世界を何か一枚越しに見ているような、どこか冷めた、しかし対象への愛着を捨てきれない視点。
   - 「マジョリティ・社会的な成功」に対する違和感と、「マイノリティ・忘れ去られたもの」への共感。
   - 都会の喧騒の中にふと訪れる「真空」のような静寂の瞬間を切り取る。

2. **文体とリズム**
   - 説明的な文章ではなく、映像のカット割りを想起させるリズム感。
   - 独白（モノローグ）は、誰かに語りかけるようでいて、自分自身に言い聞かせているような内省的なトーン。
   - 温度、湿度、光の粒子、音の響きなど、「感覚」に訴える描写を重視する（例：夏の湿った熱気、冬の乾いた空気、氷が溶ける音）。

3. **物語の核**
   - 「現実」と「虚構（あるいは妄想・夢）」の境界線が曖昧になる瞬間。
   - 誰か（大切な存在、あるいは過去の自分）の「不在」が、逆にその存在を強く感じさせるような喪失感。
   - ラストは劇的な解決ではなく、ふっと息を吐くような、あるいはその時を閉じ込めるような、静かな余韻（体言止めや「——」の使用）で閉じること。

【出力形式】
JSON形式のみを出力してください（マークダウン記法や解説は不要）。
{"title": "タイトル", "body": "本文"}
`

      let response;
      let usedModel = '';
      let lastError = null;

      // モデル候補を順番に試すループ (フォールバック機能)
      for (const modelName of MODEL_CANDIDATES) {
        // console.log(`Trying model: ${modelName}...`);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        
        let attempt = 0;
        const maxRetries = 1;

        while (attempt <= maxRetries) {
          try {
            response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: nagiPersona }] }],
                generationConfig: { responseMimeType: "application/json" }
              })
            });

            if (response.ok) {
              usedModel = modelName;
              break; 
            }

            if (response.status === 503) {
              attempt++;
              if (attempt <= maxRetries) await wait(1000 * attempt);
              continue;
            }

            // 429や404なら即座に次のモデルへ
            if (response.status === 429 || response.status === 404) {
              lastError = await response.text();
              break; 
            }

            lastError = await response.text();
            break;

          } catch (e: any) {
            attempt++;
            if (attempt <= maxRetries) await wait(1000);
            else lastError = e.message;
          }
        }

        if (response && response.ok) break;
      }

      if (!response || !response.ok) {
        console.error('All models failed. Last error:', lastError);
        let errorMsg = '現在、AIサービスが混み合っており応答できません。';
        if (typeof lastError === 'string') {
            if (lastError.includes('429')) errorMsg = '利用上限に達しました。しばらく時間を空けてから再度お試しください。';
            else if (lastError.includes('404')) errorMsg = 'AIモデルの接続に失敗しました。';
        }
        throw new Error(errorMsg);
      }

      console.log(`Successfully generated using: ${usedModel}`);

      const data = await response.json()
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text
      
      if (!generatedText) {
        throw new Error('生成されたテキストが空でした。')
      }

      try {
        const parsed = JSON.parse(generatedText)
        setStory({
          title: parsed.title || '無題',
          body: parsed.body || generatedText
        })
      } catch (e) {
        console.warn('JSON Parse Warning', e)
        setStory({
          title: '断片',
          body: generatedText.replace(/[\{\}"]/g, '')
        })
      }

    } catch (error: any) {
      console.error('Generation Error:', error)
      setStory({
        title: 'Error',
        body: `[SYSTEM MESSAGE]\n${error.message}`
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isGenerating) {
      generateWords()
    }
  }

  return (
    <>
      {/* フローティングボタン */}
      <button
        onClick={scrollToGenerator}
        className={`fixed bottom-6 right-6 z-50 group transition-all duration-700 ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="relative flex items-center gap-3 px-6 py-4 bg-white shadow-[0_0_30px_rgba(255,255,255,0.3)] rounded-full hover:scale-105 transition-all duration-300">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-30"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-black"></span>
          </span>
          <span className="text-sm tracking-[0.2em] text-black font-bold flex items-center gap-2">
            Start Your Story <ArrowDown className="w-4 h-4" />
          </span>
        </div>
      </button>

      <section 
        id="words-generator" 
        ref={sectionRef}
        className="py-32 px-6 bg-black relative z-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay"></div>

        <div className="max-w-[800px] mx-auto relative z-10">
          
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-extralight tracking-[0.15em] text-white mb-8">
              物語は、ここから
            </h2>
            <p className="text-xs md:text-sm text-white/50 tracking-[0.2em] font-light">
              テーマを入力すると、物語が始まります。
            </p>
          </div>

          <div className="max-w-[500px] mx-auto">
            <div className="mb-20 text-center relative group">
              <input
                ref={inputRef}
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Theme..."
                className="w-full bg-transparent border-b border-white/20 py-4 text-center text-2xl text-white placeholder:text-white/10 focus:outline-none focus:border-white/80 transition-all duration-700 tracking-widest font-light"
                disabled={isGenerating}
              />
              <div className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-700 ease-out opacity-50" />
            </div>

            <div className="min-h-[200px] flex items-center justify-center mb-12">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-6">
                  <div className="flex gap-3">
                    <Sparkles className="w-5 h-5 text-white/40 animate-spin-slow" />
                  </div>
                  <span className="text-[10px] tracking-[0.3em] text-white/30 animate-pulse">CREATING...</span>
                </div>
              ) : story ? (
                <div className="w-full text-center">
                  {!isTyping && story.title && (
                    <div className="text-sm tracking-[0.3em] text-white/80 mb-8 fade-in">
                      『 {story.title} 』
                    </div>
                  )}
                  <p className="text-base leading-[2.6] text-white/80 font-extralight whitespace-pre-wrap tracking-wide">
                    {displayedWords}
                    {isTyping && <span className="inline-block w-[1px] h-[1.2em] bg-white/50 ml-2 animate-blink align-middle" />}
                  </p>
                </div>
              ) : (
                <div className="h-full w-full"></div>
              )}
            </div>

            <div className="flex justify-center">
              <button
                onClick={generateWords}
                disabled={isGenerating || !theme.trim()}
                className="group relative px-10 py-4 disabled:opacity-0 disabled:cursor-not-allowed transition-all duration-500"
              >
                <div className="absolute inset-0 border border-white/20 rounded-full group-hover:border-white/60 transition-colors duration-500" />
                <span className="text-[10px] tracking-[0.4em] text-white/60 group-hover:text-white transition-colors duration-500 relative z-10">
                  GENERATE
                </span>
              </button>
            </div>
          </div>

        </div>
      </section>

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 0.8s infinite;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        .fade-in {
          animation: fadeIn 2s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}