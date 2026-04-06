---
title: "GeminiにClaude Codeの漏洩コード読んでもらったら面白かった"
emoji: "🔍"
type: "tech"
topics: ["claudecode", "anthropic", "ai", "cli", "opensource"]
published: true
publication_name: "ap_com"
published_at: "2026-04-07 12:00"
---

## 🚀 はじめに

[おぐま](https://github.com/9mak)です。

2026年3月31日、Claude Codeのソースコードがnpmのリリースミスで公開されてしまいました。

漏洩したコードをベースに作られた [Gitlawb/openclaude](https://github.com/Gitlawb/openclaude) というフォークリポジトリを **Geminiに読み込んでもらって**調査してみたところ、「こんな機能まで実装してたの？」という発見が多かったので整理してみます。

自分でコードを全部読むのはしんどいので、Geminiのコンテキストウィンドウにリポジトリを突っ込んで質問しながら掘り下げる方法をとりました。

:::message
フォーク版のインストール・使用については別記事で書く予定です。
:::

## 📊 調査・分析結果

コードを読んでいくと、大きく2種類の実装に分かれていることが分かりました。

- **Anthropic側の未公開機能**（`USER_TYPE === 'ant'` という社内フラグや日付付きベータヘッダーで管理されていたもの）
- **フォーク開発者による独自追加**（OpenClaudeやclaw-codeが加えた機能）

`ant` はAnthropic従業員を示す社内フラグで、このフラグが立っているときだけ有効になる機能がコード内に多数あります。
断言はできませんが、外部公開を想定していないコードとして書かれていた可能性が高そうです。

:::message
**既にリリース済みの機能について**
「Opus 4.6」と「100万トークン対応」はコード内で見つかりましたが、どちらも現在は**公式にリリース済み**です。
リーク当時はまだ未公開だったものが、その後正式に公開された形です。
:::

### Anthropicオリジナルの未公開機能

社内ユーザー判定（`USER_TYPE === 'ant'`）や日付付きベータヘッダーで管理されていた未公開機能です。

#### 自律エージェント系

| 機能名 | 概要 |
| --- | --- |
| **KAIROS** | バックグラウンドで常時稼働する自律エージェントのコアシステム。数秒ごとに「今やるべきことはあるか？」を自己判断し、エラー修正・ファイル更新・タスク実行を自律的に行う |
| **autoDream** | `minHours: 24`・`minSessions: 5` の条件でバックグラウンド起動し、MEMORY.md等のプロジェクト記憶を整理・統合する |
| **Coordinator Mode** | Claudeが司令塔となり、複数の「ワーカー」エージェントを並列で起動してタスクを割り振る。プロンプトには「並列化はあなたのスーパーパワーです」と書かれている |
| **AGENT_TRIGGERS** | テスト失敗などの特定イベントを検知して自動でエージェントを起動する仕組み |

#### 未発表モデルと超推論モード

**Opus 4.6（コードネーム: Fennec / Capybara）**

コード内の変数 `opus46` としてULTRAPLANのデフォルトモデルに指定されています。
Opus 4.6本体（Fennec）は現在公式リリース済みですが、**Capybara（内部名: Mythos）** という未公開変種も存在しています。

`src/buddy/types.ts` のコメントに「capybaraという種族名がモデルのコードネームと衝突するため、16進数でエンコードして隠している」という記述があります。
`0x63, 0x61, 0x70...` という形で文字列を難読化しているわけで、なかなか生々しいですね。

:::details 漏洩コードで見つかった内部モデル一覧

| コードネーム | 概要 |
| --- | --- |
| **Fennec** | Opus 4.6。現在公式リリース済み |
| **Capybara（Mythos）** | Opus 4.6の未公開変種。1Mコンテキスト＋ファストモード付き |
| **Numbat** | 次世代の未公開モデル。テスト中 |
| **Tengu** | 内部でアクティブに使われているバリアント |

:::

**ULTRAPLAN**

`ULTRAPLAN_TIMEOUT_MS = 30 * 60 * 1000`（30分）という定数が定義されています。
ローカルCLIの処理を `Claude Code on the web`（ブラウザ環境）へ「テレポート」させて実行する設計が面白いです。

#### 遊び心の塊「BUDDY」

開発者の遊び心が一番詰まっている機能です。
`src/buddy/types.ts` に全18種族が定義されていて、レアリティに応じてターミナルの表示色が変わります（★〜★★★★★）。

| レアリティ | 主な種族 |
| --- | --- |
| common | duck（アヒル）、goose（ガチョウ）、mushroom（キノコ） |
| uncommon | chonk（太っちょ） |
| rare | axolotl（ウーパールーパー） |
| epic | capybara（カピバラ） |
| legendary | dragon（ドラゴン）、ghost（ゴースト） |

ステータスは5種類。Claudeらしいのが「SNARK（皮肉・毒舌）」の存在です。

| ステータス | 意味 |
| --- | --- |
| DEBUGGING | デバッグ能力 |
| PATIENCE | 忍耐 |
| CHAOS | カオス度 |
| WISDOM | 知恵 |
| **SNARK** | **皮肉・毒舌** |

ユーザーIDのハッシュから `CompanionBones`（骨格）が決定論的に生成され、モデルが `CompanionSoul`（魂＝名前や性格）を吹き込む仕組みになっています。

#### その他のベータ機能

最新の日付が `2026-03-28` など、リーク直前まで開発が続いていたことが分かります。

| 機能名 | 日付 | 概要 |
| --- | --- | --- |
| **TOKEN_EFFICIENT_TOOLS** | 2026-03-28 | 漏洩の3日前に定義。ツール使用時のトークン消費を抑える新規格 |
| **VOICE_MODE** | - | プッシュトゥトーク式の音声インターフェース |
| **ADVISOR_TOOL** | 2026-03-01 | 開発のアドバイスを行う特殊なツール |
| **AFK_MODE** | 2026-01-31 | ユーザーの離席を検知して適切に動作するモード |
| **FAST_MODE** | 2026-02-01 | 推論速度を優先するモード |
| **TASK_BUDGETS** | 2026-03-13 | コスト・トークン使用量に予算制限をかける機能 |
| **UNDERCOVER** | - | GitHubへのコミット時などにClaude Codeの使用形跡を消すステルス機能（開発中・現在はスタブ） |

### フォーク版（claw-code / OpenClaude）の独自実装

`claw-code` の `ROADMAP.md` や `PARITY.md` から判明した、フォーク開発者が追加した独自機能です。
Anthropicのオリジナルとは明確に方向性が異なります。

**「AIがAIツールを操作する」ための設計への転換**

人間がTUIを見るのではなく、エージェントがツールを操作することを前提にした抽象化レイヤーが追加されています。

- **WorkerStatus状態マシン**: `spawning` → `trust_required` → `ready_for_prompt` など、エージェントが「今何待ちか」を確実に判定できる仕組み
- **Clawhip統合**: `lane.started` などの構造化されたイベントとして処理し、Discord等に通知を送る監視システム
- **Summary Compression**: 大量のビルドログを要約してエージェントが次にすべきことだけをDiscordに流す機能
- **自動リカバリー**: 信頼プロンプトの自動解決や、プロンプトが誤ってシェルに打ち込まれた際の検知と再注入

また `claw-code` は著作権侵害を避けるため、TypeScriptのコードをそのままコピーせずRustでゼロから再実装しています。

## 🔍 考察

今回の調査で一番面白かったのは、**「Anthropicが目指した方向」と「フォーク開発者が求めた方向」のギャップ**でした。

**Anthropicの方向性**: BUDDY・VOICE_MODE・SNARKステータスなど、**エンジニアにとっての最高の相棒**を作ろうとしていた。

**フォーク版の方向性**: 状態マシンの厳格化・構造化イベント・自動リカバリーなど、人間を介在させずに**AIエージェントが全自動で開発できる基盤**としてツールを改造しようとしている。

「流出したのはコードだけでなく、開発の哲学そのものだった」という感じがします。

Capybaraの16進数エンコードも印象的で、コードネームがBUDDYの種族名と衝突するからといってわざわざ難読化している、というエンジニアリングの痕跡がリアルでした。

## 💡 学んだこと・発見

KAIROS・BUDDY・ULTRAPLANなどは今後正式にリリースされるはずで、今のClaude Codeとはまた違うユーザー体験になりそうです。
TOKEN_EFFICIENT_TOOLSが漏洩3日前に追加されていたように、リーク直前まで活発に開発が続いていました。開発速度がエグい。

## 🎯 まとめ

漏洩自体はAnthropicにとってつらい出来事だったと思いますが、コードを読む側としてはなかなか面白かったです。
SNARKステータスやULTRAPLANの「テレポート」発想、Anthropicとフォーク版の哲学の違いなど、コードから見えてくるものが多かったです。

フォーク版を使うかどうかの判断については別記事にまとめる予定です。

---

### 参考

- [GitHub - Gitlawb/openclaude](https://github.com/Gitlawb/openclaude)
- [GitHub - ultraworkers/claw-code](https://github.com/ultraworkers/claw-code)
- [Inside Claude Code's leaked source: 44 features Anthropic kept behind flags - The New Stack](https://thenewstack.io/claude-code-source-leak/)
- [Claude Code Leaked Source: BUDDY, KAIROS & Every Hidden Feature Inside - WaveSpeedAI](https://wavespeed.ai/blog/posts/claude-code-leaked-source-hidden-features/)
