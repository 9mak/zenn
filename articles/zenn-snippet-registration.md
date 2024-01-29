---
title: "[Tips] Visual Studio Codeのスニペット登録してZennの記事書きやすくした"
emoji: "💆"
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["vscode", "zenn", "mac"] # 記事に関連するトピックをここに入力
published: true
---

## 🌟 はじめに
おぐまです。

Visual Studio Code（VSCode）のスニペット機能を活用して、Zennでの記事執筆の心理的および時間的な負担を軽減してみました。

スニペット機能を使えば繰り返し使うコードやテキストのテンプレートを簡単に挿入でき、記事作成にかかる時間を大幅に削減できます！

今回はZenn特有のMarkdown記法を使ったスニペットを作成したので毎回👇みなくて良くなります！！

https://zenn.dev/zenn/articles/markdown-guide#fn-ae40-1

:::message
記事内のjsonを登録したら即スニペットつかえます✋
:::

## 👷‍♂️ 事前準備
Zennの記事を書くのにスニペットを活用するには、まずVSCodeがインストールされてる必要があります。
※他エディターでもスニペット登録できると思いますが今回はVScodeに焦点を当ててるので

また、Markdownファイルの基本的な書き方に慣れているとよりよいです。

### 💻 開発環境
- macOS Sonoma　14.3
- Visual Studio Code 1.85.2 (Universal)
- Markdown知識

## 📖 ステップ
VSCodeでスニペットを作成しZennの記事執筆にどのように使うかを順に説明します。

### 👉 スニペットファイルの作成
まず、VSCodeでスニペットファイルを作成 or 既存ファイルを編集する方法を紹介します。
と言いたいところですが、正直ここは以下の方がわかりやすく紹介してくれているので以下参照😌
https://zenn.dev/miz_dev/articles/157a7aaad0bdcf

> 2.検索欄で登録したいスニペットの言語を入力し、選択する。

上記パートで "**markdown**" を選択して下さい。

### 👉 スニペットの記述
次に "**markdown.json**" に以下Zenn用のスニペットを貼り付けて保存してください。

```json
{
  "Numbered List": {
    "prefix": "nlist",
    "body": ["1. $1", "2. $2", "3. $3"],
    "description": "Numbered List",
    "scope": "markdown"
  },
  "Zenn Code Block": {
    "prefix": "zenn_code",
    "body": ["```${1:language}:${2:filename}", "$3", "```"],
    "description": "Code Block for Zenn",
    "scope": "markdown"
  },
  "Horizontal Rule": {
    "prefix": "hr",
    "body": ["-----"],
    "description": "Horizontal Rule for Zenn",
    "scope": "markdown"
  },
  "Zenn Message": {
    "prefix": "zenn_message",
    "body": [":::message", "$1", ":::"],
    "description": "Message block for Zenn",
    "scope": "markdown"
  },
  "Zenn Message Alert": {
    "prefix": "zenn_alert",
    "body": [":::message alert", "$1", ":::"],
    "description": "Alert message block for Zenn",
    "scope": "markdown"
  },
  "Zenn Accordion": {
    "prefix": "zenn_accordion",
    "body": [":::details ${1:title}", "$2", ":::"],
    "description": "Accordion (toggle) for Zenn",
    "scope": "markdown"
  },
  "Zenn Link Card": {
    "prefix": "zenn_linkcard",
    "body": ["@[card]($1)"],
    "description": "Link card for Zenn",
    "scope": "markdown"
  },
  "Zenn Diagram": {
    "prefix": "zenn_diagram",
    "body": ["```mermaid", "$1", "```"],
    "description": "Mermaid diagram for Zenn",
    "scope": "markdown"
  }
}
```

はい！これだけです笑
markdownファイルで "zenn"くらいまで打つと今回登録したスニペットが候補として出るようになります。簡単です😌

### 💡 トラブルシューティング

- **スニペットが表示されない**

スニペットのプレフィックスを入力しても提案が表示されない場合、スニペットファイルのフォーマットが正しくない可能性があります。
JSONフォーマットのエラー（不適切なカンマ、括弧の不足など）がないか確認してください。

:::message alert
VScodeの拡張機能が悪さしている場合もあります
まずはスニペット登録後VScodeを再起動して関連しそうな拡張機能を無効化/有効化して動作確認してみてください
:::

- **スニペットが適切な言語で動作しない**

スニペットが特定の言語（例えばMarkdown）でのみ動作するように設定されている場合、その言語でファイルを開いているか確認してください。

:::message
markdown以外のファイルでスニペットを動作させたい場合はスニペット登録の際に "**markdown**" 以外を選択して **[選択した言語].json** のファイルを編集してみてください
:::

- **スニペットが重複している**

既存スニペットと同じプレフィックスを持つ新しいスニペットを作成した場合、提案が重複することがあります。

:::message
重複を避けるために、ユニークなプレフィックスを使用してください
:::

- **スニペットの挿入後にフォーマットが崩れる**

スニペット挿入後、自動フォーマット設定によってレイアウトが意図しない形に変更されることがあります。

:::message
ファイルのフォーマット設定を調整するか、スニペットのフォーマットを修正してください
:::

## 🎉 まとめ

この記事では、VSCodeのスニペット機能を活用して、Zennでの記事執筆を効率化する方法を紹介しました。

最初だけめんどくさいですが "**ZennのMarkdownであれってどうやって書くんだっけ？**" が無くなり、今後かなり楽できるのでやってみてください🕺