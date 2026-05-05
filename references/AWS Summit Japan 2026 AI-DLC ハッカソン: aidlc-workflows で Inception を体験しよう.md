AWS Summit Japan 2026 AI-DLC ハッカソン: aidlc-workflows で Inception を体験しよう

mazyu36 / Yuki Matsuda
2026/05/01に公開

AI

AWS

Agent

AWS Summit

Kiro

tech
AWS Summit Japan 2026 に合わせて、AI-DLC ハッカソン「人をダメにするサービスを考えよう!」 が開催中です！🎉

応募締切は 2026 年 5 月 10 日（日）
🏆 1 位チームには re:Invent 2026（米国ラスベガス開催）へのご招待（参加費・宿泊費・フライト費用）と優勝トロフィー
テーマは「人をダメにするサービスを考えよう!」— サービスで AI を使う必要はなく、人をダメにできるアイデアそのもの が評価対象
決勝は 2026 年 6 月 26 日（金） の AWS Summit Japan 2026 ＠幕張メッセで実施


本ハッカソンでは aidlc-workflows を使用し、AI-DLC (AI-Driven Development Life Cycle) の Inception フェーズの成果物 （README・設計ドキュメント等）を書類審査に提出します。応募にあたっては AI-DLC のワークフローを一度は回す必要があります。

そこで本記事では、aidlc-workflows を Kiro に導入し、Inception フェーズまでを実際に動かすハンズオンを紹介します！



記事の流れに沿って手を動かせば、そのまま書類審査の提出物の準備に着手できます。チームで議論しながらアイデアをブラッシュアップして、ぜひ応募まで駆け抜けましょう！

AI-DLC とは
AI-DLC は AWS が提唱するメソドロジーで、AI を「開発の中心的な協働者」として位置付け、チームと AI がリアルタイムに協調しながら開発を進めます。AI が計画を作成し、不明点の明確化を求め、人間の承認を得てから実装する、というサイクルを SDLC（ソフトウェア開発ライフサイクル）全体で繰り返します。

AI が計画を作成し、明確化を求め、計画を実装する一方で、人間が重要な決定を行う
出典: AI 駆動開発ライフサイクル:ソフトウェアエンジニアリングの再構築 (AWS ブログ)

ソフトウェア開発は以下の 3 つのフェーズで進めます。

開始 (Inception) フェーズ: AI がビジネス意図を要件・ストーリー・ユニット（並行開発可能な作業単位）に変換。チーム全体で AI の提案を検証する「モブエラボレーション (Mob Elaboration)」で進行
構築 (Construction) フェーズ: AI がアーキテクチャ・ドメインモデル・コード・テストを提案。技術的決定をリアルタイムですり合わせる「モブコンストラクション (Mob Construction)」で進行
運用 (Operation) フェーズ: 前フェーズのコンテキストを元に IaC とデプロイメントを管理
AI-DLC の 3 つのフェーズ：開始、構築、運用
出典: AI 駆動開発ライフサイクル:ソフトウェアエンジニアリングの再構築 (AWS ブログ)

なお本ハッカソンで書類審査の対象になるのは Inception フェーズの成果物のみ です。Construction / Operation フェーズは予選以降（MVP デモ・本番デプロイ）で取り組むフェーズなので、まずは Inception に集中するのがおすすめです。

従来の「スプリント」は時間や日単位のより短い「ボルト (Bolt)」に、「エピック」は「作業単位 (Unit of Work)」に置き換えられます。これにより以下のような効果が見込めます。

開発速度: 要件・ストーリー・設計・コード・テストを AI が高速に生成することで、従来数週間かかっていた作業を数時間〜数日で完了できる
品質: 継続的な意図のすり合わせにより、AI が解釈した抽象的な成果物ではなくチームの意図通りのものが作れる。組織固有のコーディング規約やセキュリティ要件も一貫して適用できる
開発者体験: 定型作業から解放され、開発者はより本質的な問題解決に集中できる
!
本記事では AI-DLC のメソドロジーの詳細は割愛します。以下の AWS Blog や Method Definition Paper を参照してください。

AI 駆動開発ライフサイクル:ソフトウェアエンジニアリングの再構築 (AWS ブログ)
Open sourcing adaptive workflows for AI-DLC (AWS Blog)
AI-DLC Method Definition Paper
aidlc-workflows に含まれるもの
aidlc-workflows は AI-DLC のワークフローをルールファイル（ステアリングファイル）として定義したものです。Coding Agent の「プロジェクトルール」「ステアリング」の仕組みに乗っかる形で動作し、Kiro や Claude Code などの Coding Agent に対応しています。

本記事では Kiro にフォーカスして紹介します。

用語
本記事や AI-DLC のワークフローで登場する用語を整理します。

用語	意味
Greenfield	既存コードベースがない新規プロジェクト
Brownfield	既にコードベースが存在するプロジェクト。AI-DLC は既存コードを Reverse Engineering で解析したうえで要件定義や実装を進める
Unit of Work（ユニット）	並行開発可能な作業の単位。Units Generation ステージでシステムをこの単位に分解する。以降の Construction Phase は Unit of Work ごとに実行する
3 フェーズの Adaptive Workflow
ワークフローは以下の 3 フェーズで構成されています。

フェーズ	目的	ハッカソンとの対応
🔵 INCEPTION	WHAT（何を）と WHY（なぜ）を決める	本記事のハンズオンと書類審査で扱う範囲
🟢 CONSTRUCTION	HOW（どう作るか）を決めて実装する	予選以降で取り組む範囲
🟡 OPERATIONS	デプロイと運用	現在はプレースホルダー
特徴は Adaptive である点で、全ステージを機械的に実行するのではなく、ユーザーの要求内容や既存コードベースの状態、変更の複雑度に応じて必要なステージのみを実行します。例えば Greenfield プロジェクトでは Reverse Engineering はスキップされます。

🔵 INCEPTION PHASE
要件定義・設計を担うフェーズです。ハッカソンの書類審査で提出するのはこのフェーズの成果物になります。本記事のハンズオンもこのフェーズを対象にしています。

ステージ	実行条件	何をするか
Workspace Detection	ALWAYS	ワークスペースを解析し Greenfield / Brownfield を判定
Reverse Engineering	CONDITIONAL	Brownfield のみ。既存コードからアーキテクチャ・コンポーネント・依存関係を抽出
Requirements Analysis	ALWAYS	ユーザー要求を整理し機能要件・非機能要件を文書化
User Stories	CONDITIONAL	ユーザー向け機能の場合に、ペルソナとユーザーストーリーを作成
Workflow Planning	ALWAYS	以降どのステージを実行するかを計画しユーザーに提示
Application Design	CONDITIONAL	新規コンポーネント・サービス・メソッドを設計
Units Generation	CONDITIONAL	システムを複数の Unit of Work に分解
🟢 CONSTRUCTION PHASE
実装フェーズです。ハッカソンでは書類審査を通過した後、予選（5/30）の MVP デモや決勝（6/26）の AWS 上へのデプロイで取り組むことになります。書類審査の段階ではここまで進める必要はないので、ハッカソンの応募時は Inception フェーズを優先してください。

Inception で定義された Unit of Work ごとに以下のステージがループで実行され、全 Unit 完了後に Build and Test が実行されます。

ステージ	実行条件	何をするか
Functional Design	CONDITIONAL	ビジネスロジック・ドメインモデル・業務ルールを設計
NFR Requirements	CONDITIONAL	性能・可用性・セキュリティなど非機能要件を整理し技術スタックを選定
NFR Design	CONDITIONAL	非機能要件に対するレジリエンス・スケーラビリティ等の設計パターンを適用
Infrastructure Design	CONDITIONAL	クラウドサービスへのマッピング・ネットワーク・デプロイメント構成を設計
Code Generation	ALWAYS	計画 → 実装の 2 段階でコード・テストを生成
Build and Test	ALWAYS	全 Unit 完了後に実行。ビルド手順と Unit / Integration / Performance 等のテスト手順を生成
生成されるアーティファクト
ワークフロー実行中に生成されるドキュメントは全て aidlc-docs/ 配下に Markdown として出力されます。

aidlc-docs/
├── aidlc-state.md         # ワークフローの状態管理
├── audit.md               # ユーザー入力・AI レスポンスの監査ログ
├── inception/             # 🔵 Inception Phase の成果物 ← ハッカソン書類審査の提出対象
├── construction/          # 🟢 Construction Phase の成果物（予選以降）
└── operations/            # 🟡 Operations Phase（プレースホルダー）

ハッカソンの書類審査で提出するのは inception/ 配下の成果物が中心になります。construction/ は予選以降のタイミングで必要になるため、書類審査の段階ではまだ気にしなくて OK です。

アプリケーションコードは aidlc-docs/ には配置されず、ワークスペースルートに出力されます。aidlc-docs/ は Markdown ドキュメントのみが格納されるルールです。

aidlc-state.md で進捗を追跡でき、セッションを中断しても再開可能です。audit.md はユーザーの全入力と AI のレスポンスを ISO 8601 のタイムスタンプ付きで記録する監査ログになっています。

Extensions
aws-aidlc-rule-details/extensions/ 配下にセキュリティやテストなど、カテゴリ別の追加ルールが入っています。Requirements Analysis で提示されるオプトイン質問に Yes と答えると、対応するルールが以降のステージで Blocking Constraint として強制されます。

extensions/
├── security/baseline/
│   ├── security-baseline.md          # ルール本体
│   └── security-baseline.opt-in.md   # オプトイン用の質問
└── testing/property-based/
    ├── property-based-testing.md
    └── property-based-testing.opt-in.md

独自の Extension を追加する枠組みも用意されており、組織固有のコンプライアンスルールなどを組み込めます。ハッカソンでは主に Inception フェーズを扱うため必須ではありませんが、Construction フェーズでコード生成まで進める場合はセキュリティ要件の強制などに活用できます。

Kiro への導入
Releases ページ から最新の ai-dlc-rules-v<release-number>.zip をダウンロードして展開します。

zip の中には以下の 2 つのフォルダが含まれています。

aws-aidlc-rules/: ワークフローのコアルール（core-workflow.md）
aws-aidlc-rule-details/: コアルールから条件付きで参照される詳細ルール群
以下のコマンド例は macOS / Linux で ~/Downloads/aidlc-rules に展開したケースです（README の手順）。core-workflow.md を .kiro/steering/ 配下に、詳細ルールを .kiro/ 配下に配置します。

mkdir -p .kiro/steering
cp -R ~/Downloads/aidlc-rules/aws-aidlc-rules .kiro/steering/
cp -R ~/Downloads/aidlc-rules/aws-aidlc-rule-details .kiro/

配置後のディレクトリ構成は以下のようになります。

<project-root>/
├── .kiro/
│   ├── steering/
│   │   └── aws-aidlc-rules/
│   │       └── core-workflow.md
│   └── aws-aidlc-rule-details/
│       ├── common/
│       ├── inception/
│       ├── construction/
│       ├── extensions/
│       └── operations/

!
Windows（PowerShell / CMD）の場合、または Kiro 以外の Coding Agent（Amazon Q Developer, Cursor, Cline, Claude Code, GitHub Copilot, OpenAI Codex など）を使う場合のセットアップ手順は、リポジトリの README の Platform-Specific Setup を参照してください。

読み込み確認は、Kiro IDE なら Steering パネルで core-workflow が Workspace 配下に表示されていれば OK、Kiro CLI なら /context show で .kiro/steering/aws-aidlc-rules が表示されていれば OK です。

!
Kiro IDE で使う場合は、AI-DLC のワークフローに沿って動作させるため Vibe モードの使用が推奨されています。途中で Spec モードへの切り替えを提案されることがありますが、No を選択して Vibe モードに留まります。

Spec モードへの切り替えを提案された際に No を選択する

ハンズオン
ここからは実際に Kiro IDE で aidlc-workflows を動かしてみます。

ハッカソンのテーマは「人をダメにするサービスを考えよう!」です。記事ではハンズオンを簡潔にするため、題材は一般的な「シンプルな EC サイト」を使います。ハッカソンに応募する際は、ここを「人をダメにする」アイデアに置き換えて同じ流れで進めてみてください。

ステップは Inception フェーズのステージと対応させた構成にしています。各ステップの最後に Kiro が次のステージへ進む流れになります。

AI-DLC のワークフローは Adaptive な設計で、プロジェクトの規模や複雑度に応じて実行されるステージが変わります。本記事のハンズオンと皆さんの環境で実行されるステージが同じとは限らないので、その点ご留意ください。例えば本記事の EC サイトの例では User Stories ステージがスキップされています（シンプルなプロジェクトでユーザータイプが単一のため）。

!
以降のスクリーンショットは Kiro IDE の Vibe モード、日本語表示のものです。使用する LLM やタイミングによって出力内容は変わりますが、流れは同じです。

Step 1: ワークフロー起動と Workspace Detection
Kiro IDE のチャットに AI-DLC を使って、 から始まる文言で、作りたいものを伝えます。本記事では以下のように入力しました。

AI-DLC を使って、シンプルな EC サイトを作成したいです。日本語で進めてください。

!
デフォルトだと成果物や対話が英語になります。日本語で進めたい場合は、上記のように 日本語で進めてください。 を添えておきます。

ハッカソンのテーマは「人をダメにするサービスを考えよう!」です。応募の際はこのチャットにアイデアを直接書いても構いませんが、アイデアや背景が複雑になるなら別ファイル（例: idea.md）に整理しておき、チャットでそれを読み込ませる形にすると扱いやすくなります。例えば:

AI-DLC を使って、idea.md に記載のサービスを作成したいです。日本語で進めてください。

すると Kiro は Steering と関連するルールファイル・extensions の opt-in ファイルを読み込みます。

Kiro がワークフローを起動し、Steering とルールファイルを読み込む

続いてウェルカムメッセージが表示されます。AI-DLC のワークフローの概要と 3 フェーズのステージ構成が ASCII 図で説明されます。

ウェルカムメッセージで AI-DLC の 3 フェーズが説明される

ここから Inception フェーズの最初のステージ、Workspace Detection に入ります。Kiro がワークスペース直下をスキャンし、既存のコードやプロジェクト構造を確認します。今回は空のディレクトリから始めたので Greenfield プロジェクトと判定し、以降のフェーズで生成するファイルを記録する audit.md と aidlc-state.md を aidlc-docs/ 配下に作成します。

Workspace Detection が実行され Greenfield と判定される

Workspace Detection はこれで完了です。続いて Requirements Analysis ステージに自動で進みます。

!
各ステップの切りがよいタイミングで git commit しておくと、必要に応じて任意のステージまで簡単に巻き戻せます。AI が成果物を作成する開発はサンクコストが小さいため、手戻りを恐れず気軽にやり直せるのが利点です。

自動化するのも一つの手で、例えば Kiro の Agent Hooks を使えば aidlc-state.md の更新（= ステージ完了）をトリガーに自動で commit させることも可能です。詳しくは Kiro の Agent Hooks で開発ワークフローを自動化する (AWS ブログ) を参照してください。

Step 2: Requirements Analysis
Requirements Analysis は「質問ファイルの生成 → 回答 → 要件ドキュメントの生成 → 承認」の流れで進みます。

質問ファイルの生成
Kiro がリクエストに対してインテント分析を行い、曖昧な部分を洗い出した上で、要件を明確にするための質問ファイル requirement-verification-questions.md を作成します。

要件分析で質問ファイルが作成される

質問に回答する
requirement-verification-questions.md を開くと、Multiple Choice 形式の質問が並んでいます。EC サイトの例では以下のような 12 個の質問が用意されていました。

要件確認質問ファイルの中身

各質問の [Answer]: の後ろに選択肢のアルファベット（A〜E など）を書き込んでいきます。選択肢に該当するものがなければ E) などの Other を選び、自由記述します。

AI-DLC の特徴はモブワーク（Mob Elaboration）です。チームで画面を共有しながら議論して回答を決めていくのがおすすめです。AI からの質問はアイデア出しや方針合わせのきっかけにもなるので、ぜひ議論などしながら進めてください。

質問の中には以下のような技術スタックに関するものも含まれています。

## Question 5
フロントエンドの技術スタックの希望はありますか？

A) React（Next.js）
B) Vue.js（Nuxt.js）
C) 素のHTML/CSS/JavaScript
D) 特にこだわりなし（おすすめを提案してほしい）
E) Other (please describe after [Answer]: tag below)

[Answer]: E 後で決定します

特に制約がない場合は、上記のように「後で決定します」として先送りしておくのがおすすめです。ソフトウェア開発のプラクティスとしても、まず「何を作るか」を明確にしてから技術選定を行うことで、決めたものに合わせた判断ができます。ただし組織や案件によっては技術要素に縛りがある場合（例: 社内標準が React、DB は PostgreSQL、など）もあるので、その場合はここに制約として書いておくと以降の設計に反映されます。

質問の末尾 2 つは Extensions のオプトインに関するものです。Extensions はハッカソンの書類審査（Inception）では必須ではなく、Construction フェーズ以降で必要に応じて有効化できます。詳細は Extensions セクション を参照してください。

## Question 11: Security Extensions
このプロジェクトにセキュリティ拡張ルールを適用しますか？

A) はい — すべてのセキュリティルールをブロッキング制約として適用する（本番グレードのアプリケーション向け推奨）
B) いいえ — セキュリティルールをスキップする（PoC、プロトタイプ、実験的プロジェクト向け）
C) Other (please describe after [Answer]: tag below)

[Answer]:

## Question 12: Property-Based Testing Extension
このプロジェクトにプロパティベーステスト（PBT）ルールを適用しますか？

A) はい — すべてのPBTルールをブロッキング制約として適用する（ビジネスロジック、データ変換、シリアライゼーション、ステートフルコンポーネントを持つプロジェクト向け推奨）
B) 部分的 — 純粋関数とシリアライゼーションのラウンドトリップにのみPBTルールを適用する
C) いいえ — PBTルールをスキップする（シンプルなCRUDアプリケーション、UIのみのプロジェクト向け）
D) Other (please describe after [Answer]: tag below)

[Answer]:

要件ドキュメントの生成
全ての質問に [Answer]: で回答を書いたら、Kiro のチャットに回答完了した旨を伝えます。

回答しました

Kiro が回答を読み取り、回答サマリと矛盾チェックの結果を提示した上で、要件ドキュメント requirements.md を生成します。

回答を受けて要件ドキュメントが生成される

要件ドキュメントを確認し承認する
生成された requirements.md を開いて内容を確認します。インテント分析の結果・プロジェクト概要・機能要件・非機能要件などがまとめられています。ここでもチームで画面を共有しながら内容を確認し、認識が合っているかを議論していくのがおすすめです。

違和感や認識とずれている部分があれば、チャットで指摘コメントを伝えて修正してもらい、納得できた段階で承認の旨を Kiro に伝えます。承認すると Kiro が次のステージに進む準備をします。

要件ドキュメントを承認した後の画面

これで Requirements Analysis ステージは完了です。

このように「AI が計画の提示や具体化のための質問を投げる → チームで回答する → AI が成果物を作成する → チームでレビューして承認する」というサイクルが AI-DLC の基本的な流れです。AI が成果物作成を担うことで、人間はアイデアや要件の良し悪しといった意思決定に注力できます。以降のステージも同じリズムで進んでいきます。

Step 3: Workflow Planning
Requirements Analysis の次は Workflow Planning ステージです。ここでは、Requirements Analysis の内容を踏まえて、Kiro が残りの Inception / Construction の各ステージをどう進めるかの実行計画 execution-plan.md を作成します。

各ステージを「EXECUTE（実行する）」「SKIP（スキップする）」のどちらにするかが、リクエスト内容・規模・複雑度に応じて AI によって判断されます。AI-DLC の Adaptive Workflow の肝にあたるステージです。

初期の実行計画

今回の EC サイトの例では、初期案として Units Generation が SKIP になっています。システムの規模が小さく、単一ユニットで扱えると判断されたためです。

不明点は Kiro に聞く
計画の内容に不明な点があれば、Kiro に直接質問できます。例えば「ユニット生成を skip したのはなぜ」と聞いてみると、以下のように根拠を説明してくれます。

ユニット生成が skip された理由を Kiro に質問する

計画を変えたい時は指示する
計画が意図と合っていない場合は、チャットで指示することで修正できます。今回は勉強目的でフロントエンドとバックエンドを複数のマイクロサービス構成にしたいので、以下のように指示してみます。

勉強のためにもフロントエンドとバックエンドは複数のマイクロサービスという構成にしたいです。

これを受けて Kiro が計画を更新し、requirements.md と execution-plan.md、aidlc-state.md に変更を反映します。

マイクロサービス構成に変更後の実行計画

今度は Units Generation が EXECUTE になりました。計画が意図通りになったら承認して次のステージに進みます。

Step 4: Application Design
Application Design ステージでは、システムのコンポーネント構成・サービス・依存関係・メソッドシグネチャなどの設計を行います。

!
Application Design は CONDITIONAL なステージです。新規コンポーネントやサービスの設計が不要なシンプルな変更では、このステージ自体がスキップされることもあります。本記事の EC サイトの例では実行されています。

これまでと同様に、Kiro が設計の具体化のための質問を提示します。EC サイトの例では、バックエンドのマイクロサービスの分割方針（ドメイン別 / 機能別 / 最小構成）、フロント / バックの技術スタック、データベースの選定、サービス間通信（REST / gRPC など）、API Gateway の設計方針などを問います。ここでの選択が以降のアーキテクチャの骨格を決めるので、チームで議論しながら選んでいきます。

Application Design の具体化のための質問

回答すると Kiro が以下のような設計ドキュメントを生成します。

components.md: コンポーネントごとの責務
services.md: サービス定義、ポート割当、オーケストレーション
component-methods.md: 各サービスの API エンドポイント・メソッドシグネチャ
component-dependency.md: 依存関係マトリクス、データフロー、通信パターン
application-design.md: 上記を統合した設計概要
内容をレビューして、違和感があればチャットで修正を指示、問題なければ承認します。

Application Design の成果物を承認

Step 5: Units Generation
Units Generation ステージでは、Application Design で定義したコンポーネントを、並行して開発可能な Unit of Work に分解します。以降の Construction フェーズはこの Unit 単位でループするため、分割方針が開発の進め方に直結します。

!
Units Generation も CONDITIONAL なステージです。単一ユニットで扱える小さなシステムではスキップされます。本記事の EC サイトの例では、当初は SKIP と判断されましたが、マイクロサービス構成に変更したので EXECUTE に切り替わりました。

質問では、Kiro が実装順序（ボトムアップ / フロントエンド先行 / 機能スライス）、リポジトリ構成（モノレポ / マルチレポ）、API Gateway の実装方針、サービス内のディレクトリ構成などを問います。チームの人数やスキルセット、どう並行開発したいかを踏まえて選択します。

Units Generation の質問

回答を受けて Kiro が以下のようなドキュメントを生成します。

unit-of-work.md: Unit 定義・実装順序・技術スタック
unit-of-work-dependency.md: Unit 間の依存関係
unit-of-work-story-map.md: 機能要件と Unit のマッピング（カバレッジ確認）
生成内容を確認して、意図通りの分割・順序になっているかをレビューし、問題なければ承認します。これで Inception フェーズの全ステージが完了です。

Units Generation の成果物を承認

Step 6: Inception フェーズの完了を確認する
Units Generation を承認すると、Kiro は Inception フェーズを完了したと判断し、そのまま Construction フェーズ（Functional Design など）に進もうとします。

ハッカソンの書類審査の段階では Inception フェーズの成果物があれば十分なので、ここでチャットの実行をキャンセルしてワークフローを止めて問題ありません。

止めたら、aidlc-docs/aidlc-state.md を開いて Inception フェーズのステージがすべて完了しているか確認しておきましょう。## Stage Progress の箇所を見て、以下のようになっていれば OK です。

Workspace Detection: [x]
Requirements Analysis: [x]
User Stories: [x] または SKIP
Workflow Planning: [x]
Application Design: [x]
Units Generation: [x] または SKIP
aidlc-state.md で Inception フェーズの完了を確認

あとは aidlc-docs/ 配下のドキュメントを GitHub リポジトリに push すれば、ハッカソンの書類審査の提出物として利用できます。

Inception フェーズで生成された requirements.md、application-design.md、unit-of-work.md などは、そのまま書類審査の評価軸（ビジネス意図の明確さ / Unit 分解の適切さ / ドキュメントの品質）に対応しています。書類審査に通った後の予選以降で、残りの Construction フェーズに進んで MVP デモを作る形になります。

なお、書類審査通過後に MVP デモを作るタイミングでは、ここまでの成果物を元にワークフローを再開できます。aidlc-state.md や requirements.md、unit-of-work.md などのアーティファクトが揃っていれば、別セッションから始めても Kiro が状態ファイルを読み込んで続きから進めてくれます。

再開時は Kiro のチャットに以下のように指示するだけで OK です。

aidlc のワークフローを再開したい

Kiro が aidlc-state.md や関連ドキュメントを読み込み、次のステージ（ここでは Construction フェーズの Functional Design）から再開してくれます。

新しいセッションからワークフローを再開

ハッカソンに応募しよう！
ハンズオンで Inception フェーズの成果物が揃ったら、いよいよ AWS Summit Japan 2026 AI-DLC ハッカソン への応募です！書類審査の段階では Construction / Operations フェーズまで進める必要はなく、Inception フェーズの成果物があれば応募できます。人をダメにするアイデアができたら、ぜひ応募してみてください！

応募概要
項目	内容
応募締切	2026 年 5 月 10 日（日）
提出物	公開 GitHub リポジトリ URL、Inception フェーズの成果物（README・設計ドキュメント等）
書類審査の評価軸	ビジネス意図 (Intent) の明確さ / Unit 分解の適切さ / 創造性とテーマ適合性 / ドキュメントの品質
参加条件	2〜4 名のチーム / AWS Builder ID の取得 / 18 歳以上 / AWS Summit Japan 2026 期間中に対面参加可能 / チームで AWS アカウントを使用し AWS 上で開発・稼働
賞品
順位	内容
🥇 1 位チーム	re:Invent 2026（米国ラスベガス開催）へのご招待（参加費・宿泊費・フライト費用）＋ 優勝トロフィー
🥈 2 位チーム	特別体験型賞品（AWS 企画による限定プログラムへの参加）※調整中（例：AWS 担当者との交流、特別セッション等を予定）
🥉 3 位チーム	特別体験型賞品（AWS 企画による限定プログラムへの参加）※調整中（例：AWS 担当者との交流、特別セッション等を予定）
応募ページはこちら。



テーマは 「人をダメにするサービスを考えよう!」。サービス自体で AI を使う必要はなく、人をダメにできるアイデアそのもの が評価対象です。AI-DLC の Inception フェーズをチームで回せば、アイデア出しと設計を短時間で進められます。ぜひ応募に挑戦してみてください！

終わりに
aidlc-workflows は AI-DLC のメソドロジーを Coding Agent 上で実行するための OSS 実装です。Kiro だけでなく Claude Code などの Coding Agent でも、それぞれのルール / ステアリングの仕組みに乗せれば同じように利用できます。

ハッカソンへの応募のきっかけとしてはもちろん、日々の開発ワークフローへの組み込みもぜひ試してみてください。チームでの合意形成や設計の初期検討フェーズを AI で加速する手段として、汎用的に使えます。

aidlc-workflows は OSS として公開されており、Issue や Pull Request でのフィードバック・コントリビュートも歓迎されています。使ってみて気付いた改善点や拡張アイデアがあれば、ぜひ GitHub リポジトリでフィードバックしてみてください。



それでは、AI-DLC ハッカソンでの皆さんの挑戦を楽しみにしています！

Reference













