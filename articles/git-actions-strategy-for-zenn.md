---
title: "[Tips] Zenn用のGit運用考えてみた(Github Actions編)"
emoji: "💆"
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["zenn", "github", "githubactions", "ci", "markdown"] # 記事に関連するトピックをここに入力
published: true
publication_name: "ap_com"
---

## 🌟 はじめに

こんにちは、おぐまです。

前回の記事では、Zennの記事を管理するためのブランチ編について説明しました。

今回は続編として、GitHub Actionsを利用してZennの記事品質を自動化する方法を紹介します。

## 👷‍♂️ 事前準備

### 💻 開発環境

- macOS Sonoma 14.3
- Visual Studio Code 1.85.2 (Universal)
- GitHubアカウント

## 📝 GitHub Actionsでの自動化

GitHub Actionsは、ワークフローを自動化するためのCI/CD機能です。
ここでは、Zennの記事にMarkdown Linterを導入して、記事の品質を自動でチェックする方法を見ていきます。

### 👉 Markdown Linterの導入

1. **`.github/workflows`ディレクトリを作成**  
   リポジトリのルートに`.github/workflows`ディレクトリを作成します。この中にGitHub Actionsのワークフロー設定ファイルを配置します。

2. **ワークフロー設定ファイルの作成**  
   `.github/workflows`ディレクトリ内に`markdown_lint.yml`という名前で新しいファイルを作成し、以下の内容を追加します。

```yaml
name: Markdown Lint

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '20'
    - name: Install Markdownlint CLI
      run: npm install -g markdownlint-cli
    - name: Lint Markdown files
      run: markdownlint '**/*.md' --ignore node_modules
```

この設定により、`main`や`develop`ブランチにpushされた時、またはPull Requestが作成された時にMarkdownファイルのLintが自動で行われます。

### 👉 こんかいのActions詳細

```yaml
name: Markdown Lint
```

- このワークフローの名前を指定
- GitHubのActionsタブでこの名前が表示される

```yaml
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
```

- このワークフローがトリガーされる条件を指定する
- 今回の例では、`main`または`develop`ブランチへの`push` or それらのブランチに対する`pull_request`があった場合にワークフローが実行されます

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
```

- 実行するジョブを定義します
- この例では`lint`という名前のジョブがあり、`ubuntu-latest`イメージ上で実行されます

```yaml
steps:
- uses: actions/checkout@v2
```

- リポジトリのコードをチェックアウトするためのステップ
- これにより、ワークフローがリポジトリのコードにアクセスできるようになる

```yaml
- name: Set up Node.js
  uses: actions/setup-node@v2
  with:
    node-version: '14'
```

- Node.jsをセットアップするステップ
- `actions/setup-node@v2`アクションを使用して、指定されたバージョン(この例では14)のNode.jsをセットアップする

```yaml
- name: Install Markdownlint CLI
  run: npm install -g markdownlint-cli
```

- Markdownlint CLIをインストールするステップ
- `npm install -g markdownlint-cli`コマンドを実行して、MarkdownのLintツールをインストールします

```yaml
- name: Lint Markdown files
  run: markdownlint '**/*.md' --ignore node_modules
```

- MarkdownファイルをLintするステップ
- `markdownlint '**/*.md' --ignore node_modules`コマンドを実行して、リポジトリ内の全てのMarkdownファイルをLintしますが、`node_modules`ディレクトリは除外します。

:::message alert
細かい記法については別途記事または公式サイト参照ください。
:::

### 👉 Lintルールのカスタマイズ

Markdownlintはカスタマイズ可能です。
プロジェクト(リポジトリ)のルートに`.markdownlint.json`ファイルを作成し、好みのルールを設定します。

例えば、以下の設定では、一部のルールを無効にしています。

```json
{
  "default": true,
  "MD013": false,
  "MD033": false
}
```

## 🎉 まとめ

GitHub Actionsを利用して、Zennの記事の品質を自動でチェックする方法を紹介しました。
これにより、記事の公開前に品質を確認し、読者にとって有益なコンテンツを提供しやすくなります。

## 💡 補足

https://github.com/markdownlint/markdownlint/blob/main/docs/RULES.md
:::message
Markdown Linterのルールカスタマイズは、公式ドキュメントを参照してください👆
:::
