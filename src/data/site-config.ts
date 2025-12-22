export const siteConfig = {
  // サイト全体の基本情報
  siteName: "itsuki.kusanagi",
  siteDescription: "Storytelling-Driven Creative Direction / Filmmaking",
  
  // ヒーロー背景動画のURL
  heroVideoUrl: "https://storage.googleapis.com/example2141/sozai_2.mp4",
  
  // コンタクト情報（Contactページで使用）
  contactEmail: "nagi@example.com",
  phone: "+81 70-4792-0661",
  location: "Based in Tokyo, Japan",
  
  // ソーシャルメディアリンク
  social: {
    instagram: "#",
    vimeo: "#",
    twitter: "#"
  },
  
  // Aboutページの情報
  about: {
    title: "itsuki.kusanagi",
    subtitle: "Director & Editor", // 肩書き
    
    // プロフィール画像
    profileImage: "https://storage.googleapis.com/studio-design-asset-files/projects/bXqzDJDpWD/s-727x969_v-fs_webp_4c394dcb-3e20-423d-844c-47fd431f78ab.jpg",

    // 【重要】3段構成に合わせて文章を3つの要素に整理しました
    bio: [
      // ① BACKGROUND (生い立ち・学歴・背景)
      "2004年、神奈川県川崎市出身。　デジタルネイティブ世代として育ち、幼少期から映像表現に親しむ。",
      
      // ② CAREER (経歴・活動内容)
      "大学入学を機に映像制作を本格的に開始。学生団体でのプロジェクトを通じて、企画・撮影・編集まで一貫して担当し、ストーリーテリングの技術を磨く。NewsPicksや電通クリエイティブピクチャーズでのインターンシップを経験し、商業映像制作の現場を学ぶとともに、クライアントワークにおけるコミュニケーション能力も向上させた。",
      
      // ③ VISION (アピールポイント・展望)
      "全てのデジタル体験に物語を、そんな新たな価値創出を目指している。映像とインタラクティブメディアの融合により、観る者が能動的に関与できる新しい表現形式を模索中。テクノロジーとアートの境界を超えた革新的なメディアの未来を切り拓くことを志す。"
    ],

    // 経歴リスト (descriptionを追加してUIに対応させました)
    experience: [
      {
        period: "2024 - 2025",
        company: "電通クリエイティブピクチャーズ", // 一番大きく表示
        position: "Production Manager (Intern)", // 次に大きく表示
        // ↓ 詳細説明（UIで表示される文章です。必要に応じて編集してください）
        description: "TVCMおよびWeb動画制作におけるプロダクションマネージャー業務に従事。制作スケジュールの管理、撮影現場の進行、スタッフィングの補助などを担当し、大規模な商業映像制作のワークフローを習得。"
      },
      {
        period: "2024 - Present",
        company: "UZABASE,inc (NewsPicks)",
        position: "Assistant Director (Intern)",
        description: "オウンドメディア「NewsPicks」の番組制作補助を担当。リサーチ業務から収録現場のディレクション補助、Premiere Proを用いた編集業務まで、番組制作の現場で実務経験を積む。"
      },
      {
        period: "2023 - Present",
        company: "慶應義塾放送研究会",
        position: "Keio University Student",
        description: "映像制作の企画・演出・編集を一貫して行う。自主制作映画やイベント用映像の制作プロジェクトを主導し、クリエイティブワークにおけるあらゆる能力の礎を磨く。"
      }
    ],

    // スキルリスト
    skills: [
      "Adobe Premiere",
      "Adobe After Effects",
      "Blender",
      "JavaScript",
      "TypeScript"
    ]
  }
}