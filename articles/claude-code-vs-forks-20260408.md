---
title: "Claude Codeのソースコード漏洩したけど、フォーク版を使う意味はないのでは？"
emoji: "⚖️"
type: "tech"
topics: ["claudecode", "anthropic", "ai", "cli", "opensource"]
published: true
publication_name: "ap_com"
published_at: "2026-04-08 12:00"
---

## 🚀 はじめに

[おぐま](https://github.com/9mak)です。

2026年3月31日、Anthropicの公式AIコーディングツール **Claude Code** のソースコードが、npmパッケージのリリースミスで公開されてしまいました。

意図的なハックではなく、`@anthropic-ai/claude-code` のバージョン 2.1.88 に本来含めてはいけないデバッグ用のファイルが混入したことによる人的ミスです。
Anthropicもこれを認めています。

Anthropic側のミスとはいえ、非公開で開発していたコードが一気に世界中に広まってしまったわけで、開発チームとしてはかなりつらい状況だったと思います。
ただせっかくなので、何が明らかになったのかをまとめてみます。

これをきっかけに **OpenClaude** などのフォーク版も登場しましたが、「じゃあ使う意味があるのか？」というと、正直微妙なところがあります。

## 📊 比較表

| 項目 | Claude Code（公式） | OpenClaude（フォーク） |
| --- | --- | --- |
| ライセンス | 非公開ライセンス | グレーゾーン（漏洩コードベース） |
| 使えるモデル | 設定次第でほぼ何でも | ほぼ何でも |
| 料金 | $20〜$200/月 | 無料（使用モデルの API 費用のみ） |
| ツール機能 | フル対応 | コマンド実行・ファイル操作・MCP など同等 |
| セキュリティ | 企業向けセキュリティ基準を満たしている | 偽フォーク経由のマルウェアに注意 |
| サポート | Anthropic 公式 | コミュニティベース |

## 🔍 詳細比較

### Claude Code（公式）

ターミナル上で動くコーディングツールです。
コマンドの実行・テスト・git 操作をターミナル内で直接こなせます。

モデルは「Anthropic のみ」というイメージがありますが、環境変数を設定するだけで Ollama などのローカルモデルにも接続できます。

```bash
# Ollama のローカルモデルを使う例（ollama が起動済みであること）
export ANTHROPIC_AUTH_TOKEN=ollama
export ANTHROPIC_API_KEY=""
export ANTHROPIC_BASE_URL=http://localhost:11434
claude --model llama3
```

設定方法の詳細はこちら。

- [モデル設定 - Claude Code 公式ドキュメント](https://code.claude.com/docs/en/model-config)
- [Ollama × Claude Code 統合ガイド](https://docs.ollama.com/integrations/claude-code)

### OpenClaude（フォーク）

OpenClaude は、漏洩したコードをフォークして他のモデルも使えるように改修したものです。
元のリポジトリは削除リスクを避けるため複数のミラーに分散して展開されています。

Claude Code のツール群（コマンド実行・ファイル読み書き・MCP など）はそのまま動きます。
ただ、公式の設定変更でも同じことができるので、機能面での差はほぼありません。

今回の漏洩で、**まだ公開されていない機能が 44 個**フィーチャーフラグとして含まれていることが分かりました。
名前が判明しているものをまとめると以下のとおりです。

| 機能名 | 概要 |
| --- | --- |
| **KAIROS** | 常時バックグラウンドで稼働する自律エージェント。数秒ごとに「今やるべきことはあるか？」を自己判断して動く |
| **BUDDY** | タマゴッチ風のAIペットコンパニオン。種族・ステータス・見た目のカスタマイズが実装済み |
| **ULTRAPLAN** | Claude Opus に最大30分間の遠隔プランニングをオフロードする機能 |
| **VOICE_MODE** | プッシュトゥトーク式の音声インターフェース |
| **Coordinator Mode** | 複数エージェントを並列で動かすマルチエージェント機能 |
| **WEB_BROWSER_TOOL** | CLIからブラウザに直接アクセスできる機能 |
| **DAEMON** | バックグラウンドプロセスとして常駐させるモード |
| **AGENT_TRIGGERS** | 特定のイベントをトリガーにエージェントを自動起動する仕組み |
| **autoDream** | 詳細不明。メモリや学習に関連する機能とみられる |
| **UNDERCOVER** | 詳細不明。ステルス動作に関連する機能とみられる |

:::message
ソースコードのコメントによると、一部機能は 2026年4月1〜7日に予告、5月に正式リリース予定だったようです。
:::

問題になってくるのがセキュリティ面です。
漏洩直後から偽のフォークが GitHub 上に大量に出回り、**インストールしただけでパスワードやクレカ情報が外部に送信されるものも確認されています。**
スター数が多くても安全とは限りません。

:::message alert
OpenClaude 系を試すときは、インストール先のリポジトリが本当に信頼できるものか確認してください。
見た目が本物っぽくても偽物のケースがあります。
:::

## 🎯 どっちを選ぶ？

**ほぼ全員、公式を使った方が良い**と思います。

「他のモデルを使いたい」なら公式の環境変数設定で対応できますし、API キー課金にすればコストの差もありません。

:::message alert
**業務 PC でのフォーク版利用は避けてください。**
漏洩したコードは Anthropic の知的財産であり、著作権放棄されたものではありません。
フォーク版を業務で使うことは著作権侵害リスクに加え、企業のセキュリティポリシーに抵触する可能性が高いです。
:::

フォーク版が少し面白いのは、**まだ公開されていない機能のコードを読める**点です。
「インストールはしないけどコードを読んでみたい」というのが一番安全な楽しみ方かもしれません。

## まとめ

今回の漏洩でコードが公開されたことで、内部の仕組みや未公開機能が明らかになりました。
フォーク版を使う実際のメリットは限られていて、マルウェアリスクだけが増える構図になっています。

他のモデルを使いたければ公式の設定変更で十分対応できるので、フォーク版を試すモチベーションはかなり薄いですね。

---

### 参考

- [Claude Code Source Leaked via npm Packaging Error, Anthropic Confirms - The Hacker News](https://thehackernews.com/2026/04/claude-code-tleaked-via-npm-packaging.html)
- [Inside Claude Code's leaked source: 44 features Anthropic kept behind flags - The New Stack](https://thenewstack.io/claude-code-source-leak/)
- [モデル設定 - Claude Code 公式ドキュメント](https://code.claude.com/docs/en/model-config)
- [Ollama × Claude Code 統合ガイド](https://docs.ollama.com/integrations/claude-code)
- [Fake Claude Code leak on GitHub spreads Vidar malware - Bitdefender](https://www.bitdefender.com/en-gb/blog/hotforsecurity/claude-code-leak-github-vidar-malware)
