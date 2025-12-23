import { useState, useEffect, useRef } from 'react'
import { ArrowDown, Sparkles } from 'lucide-react'

interface GeneratedStory {
  title: string
  body: string
}

// 隠しコマンド（隠しストーリー）の定義
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
  "love♡ずっきゅん": {
    title: "ピンク色の狂気",
    body: "無機質な都市のノイズに紛れ込む、メイド服の少女たち。愛されたいという渇望が、いつしか凶器に変わる。LOVEずっきゅん♡"
  },
  "loveずっきゅん": {
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
  
  const [isVisible, setIsVisible] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

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

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // ■ 優先的に試すモデルリスト
  const PREFERRED_MODELS = [
    'gemini-2.5-flash-lite', // 最優先
    'gemini-2.5-flash',      // 次点
    'gemini-3-flash',        // 予備
    'gemini-2.0-flash'       // 予備
  ];

  // API呼び出しのヘルパー関数
  const callGeminiAPI = async (modelName: string, apiKey: string, prompt: string) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });
    return response;
  };

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
    const hiddenKey = Object.keys(HIDDEN_STORIES).find(key => key.toLowerCase() === normalizedTheme);
    
    if (hiddenKey) {
      await wait(1500); // 生成演出
      setStory(HIDDEN_STORIES[hiddenKey]);
      setIsGenerating(false);
      return; 
    }

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim()
      
      if (!apiKey) {
        throw new Error('APIキー (VITE_GEMINI_API_KEY) が見つかりません。.envファイルを確認してください。')
      }

      const nagiPersona = `
あなたは映像作家・脚本家「nagi」として、テーマ「${theme}」から架空の物語の冒頭（タイトル＋本文150字程度）を創作してください。行や段落は適宜改行し、読みやすくしてください。
過去作のキャラクターや職業設定（カメラマン、メイド、小説家など）、またここに出てきた文言をそのまま使うのではなく、以下の「nagi的エッセンス」を学習した上で、抽象的に「nagi的エッセンス」をトレースし、全く新しい情景を描いてください。
ガラス越し、レンズ越し、ファインダー越し、雨粒、アスファルトなどのフレーズが多様され過ぎていますので、別の表現方法を工夫してください。回答によって同じワードやフレーズを繰り返さないでください。

【nagi的エッセンス】
1. **視点と距離感**
   - 世界をどこか俯瞰して見ているような、どこか少し冷めた、それでいて愛着を捨てきれない視点。
   - 世の中のマジョリティに対する違和感、そしてマイノリティの個性を尊重する視点。そこにあるのは反骨ではなく多様性の認可。確固たるアイデンティティーを持ち、常に広い視野で世界を眺めているような距離感。ただ、孤独ではなく、むしろその距離感が生み出す独特の親密さ。
   - 都会の喧騒の中にふと訪れる「真空」のような静寂の瞬間。それは寂しさではない、むしろ世界との一体感を感じさせるような瞬間。たまには人のセリフが出てきてもいいかもしれないが、それはあくまで「世界の一部」として機能していること。いただいたテーマに対して、直接的に言及しすぎないこと。確固たる世界観の中で、あくまで間接的に表現すること。

2. **文体とリズム（編集的ライティング）**
   - **【接続詞の完全撤廃】**
     - 「だから」「しかし」「そして」等の接続詞を禁止します。論理で繋ぐのではなく、映像のカット（情景）を並べることで文脈を作ってください。
   - **【体言止めの強制】**
     - 文末の50%以上を名詞（体言）で止めてください。これにより、読者に息継ぎの「間」を強制的に作らせます。
   - **【感情の物質化（Show, Don't Tell）】**
     - 「悲しい」「寂しい」「切ない」等の抽象語を禁止します。感情はすべて物理現象（光の明滅、温度の変化、湿った空気、金属の冷たさ）に変換して記述してください。
   - **【解像度のスイッチング】**
     - 「都市の全景（マクロ）」の直後に「爪先の汚れ（ミクロ）」を描写するなど、視点の距離を脈絡なく急激に変化させ、映像的な眩暈（めまい）を誘ってください。
   - 映像のカット割りを想起させるリズム感。
   - 独白（モノローグ）は、自分自身に言い聞かせているような内省的なトーン。
   - 温度、湿度、光の粒子、音の響きなど、「感覚」に訴える描写。

3. **物語の核**
   - 「現実」と「虚構」の境界線が曖昧になる瞬間。
   - 人間はあるきっかけで強くも、弱くもなる。その「きっかけ」の描写。
   - 誰かの「不在」が、逆にその存在を強く感じさせるような描写。それ自体を嘆いているわけではなく、むしろその不在が生み出す独特の存在感、温かさ。なにかのきっかけとして機能している。
   - ラストは劇的な解決ではなく、静かな余韻（体言止めや「——」）で閉じる。
   - **【虚構の浸食】**
     - 描写している内容が「現実」なのか「語り手の妄想」なのかを曖昧にしてください。「〜のような気がした」ではなく、妄想を現実として断定的に描写すること。
   - **【不在の証明】**
     - 「誰かがいないこと」を嘆くのではなく、「そこに誰かがいた痕跡（体温の残り香、飲みかけのグラス）」を描くことで、逆説的にその存在の大きさを表現してください。
   - **【フェードアウトのエンド】**
     - 物語を結論付けたり、教訓で締めくくったりしないでください。ふっと息を吐くような、あるいはカメラの録画停止ボタンを押すような、唐突で静かな終わり方（体言止めや「——」）で閉じてください。

【出力形式】
JSON形式のみを出力してください（マークダウン記法不要）。
{"title": "タイトル", "body": "本文"}
`

      let response;
      let usedModel = '';
      let lastError = '';

      // Phase 1: 優先リストを順に試す
      for (const model of PREFERRED_MODELS) {
        try {
          response = await callGeminiAPI(model, apiKey, nagiPersona);
          if (response.ok) {
            usedModel = model;
            break;
          }
          if (response.status === 503) {
            await wait(1500);
            response = await callGeminiAPI(model, apiKey, nagiPersona);
            if (response.ok) {
              usedModel = model;
              break;
            }
          }
          lastError = await response.text();
        } catch (e: any) {
          lastError = e.message;
        }
      }

      // Phase 2: 自動検出
      if (!response || !response.ok) {
        console.warn('Preferred models failed. Fetching dynamic model list...');
        try {
          const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
          const listData = await listRes.json();
          if (listData.models) {
            const availableModels = listData.models
              .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
              .map((m: any) => m.name.replace('models/', ''));

            const autoCandidates = availableModels.sort((a: string, b: string) => {
              const aScore = (a.includes('lite') ? 2 : 0) + (a.includes('flash') ? 1 : 0);
              const bScore = (b.includes('lite') ? 2 : 0) + (b.includes('flash') ? 1 : 0);
              return bScore - aScore;
            });

            for (const model of autoCandidates) {
              response = await callGeminiAPI(model, apiKey, nagiPersona);
              if (response.ok) {
                usedModel = model;
                break;
              }
            }
          }
        } catch (e) {
          console.error('Failed to fetch dynamic model list:', e);
        }
      }

      if (!response || !response.ok) {
        let errorMsg = 'AIモデルの接続に失敗しました。';
        if (lastError.includes('429')) errorMsg = '利用制限(Quota)に達しました。しばらく時間を空けてから再度お試しください。';
        else if (lastError.includes('404')) errorMsg = '利用可能なAIモデルが見つかりませんでした。';
        else if (lastError.includes('503')) errorMsg = 'サーバーが混み合っています。';
        throw new Error(`${errorMsg}\n(Details: ${lastError.slice(0, 100)}...)`);
      }

      console.log(`Successfully generated using: ${usedModel}`);

      const data = await response.json()
      let generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text
      
      if (!generatedText) {
        throw new Error('生成されたテキストが空でした。')
      }

      // JSONクリーニング
      generatedText = generatedText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();

      try {
        let parsed = JSON.parse(generatedText)
        
        // ■■■ 修正箇所: 配列で返ってきた場合の対応 ■■■
        // スクリーンショットのような [ {...} ] の形式に対応
        if (Array.isArray(parsed)) {
            parsed = parsed[0];
        }

        // オブジェクトであることを確認
        if (!parsed || typeof parsed !== 'object') {
            throw new Error('Invalid JSON structure');
        }

        setStory({
          title: parsed.title || '無題',
          body: parsed.body || generatedText
        })
      } catch (e) {
        console.warn('JSON Parse Warning (Recovering...)', e)
        
        // 正規表現での抽出（最後の手段）
        const titleMatch = generatedText.match(/"title"\s*:\s*"(.*?)"/);
        const bodyMatch = generatedText.match(/"body"\s*:\s*"(.*?)(?:"|$)/s);

        if (titleMatch || bodyMatch) {
            setStory({
                title: titleMatch ? titleMatch[1] : '無題',
                body: bodyMatch ? bodyMatch[1].replace(/\\n/g, '\n') : generatedText.replace(/[{}"]/g, '').trim()
            })
        } else {
            setStory({
                title: '断片',
                body: generatedText.replace(/[\{\}\[\]"]/g, '') // [] も除去
            })
        }
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