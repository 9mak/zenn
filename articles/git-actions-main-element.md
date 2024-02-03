---
title: "[Tips] GitHub Actionsの要素を表で速攻理解する"
emoji: "💆"
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["github", "gitHubactions", "ci", "自動化"] # 記事に関連するトピックをここに入力
^published: true
publication_name: "ap_com"
# published_at: 2024-02-05 12:00
---
## 🌟 はじめに

おぐまです。

今回はGitHub Actionsについて、使うのに最低限必要な基本的要素と必須ではないが使うとこだわり機能が実装できる追加要素をわかりやすく表にまとめました。
何となくでも理解してすぐ実装してみたい人におすすめです🕺

GitHub Actionsを使いこなすことで、コードの自動テスト、ビルド、デプロイといったCI/CDの自動化ができるので開発が少し楽になります。

## 📖 GitHub Actionsを使うための最低限

### 要素をツリー構造にしてみた

基本(ほぼ必須)要素といくつかの追加要素をどんな関係で成り立ってるか一目でわかるようにツリー構造にしてみました。

```yml
workflow
├── on
│   ├── push
│   │   └── branches
│   ├── pull_request
│   │   └── branches
│   └── schedule
│       └── cron
├── jobs
│   └── <job_id>
│       ├── needs
│       ├── runs-on
│       ├── env
│       ├── if
│       ├── steps
│       │   ├── name
│       │   ├── env
│       │   ├── if
│       │   ├── uses
│       │   │   └── with
│       │   └── run
│       └── outputs
└── env
└── secrets (特定の場所ではなく、GitHubリポジトリの設定から参照されます)
```

:::message alert

- 各要素の意味や使い方について次のセクションで説明しています
- このタイミングではこんなんなってんだくらいで大丈夫です！！

:::

### 主要要素

ここで主要要素について表でまとめています。
ActionsのWorkflowを定義するのに必須の要素メインでまとめています。

| Element  | Description                                                  | Example                                      | Context            | Required          |
|----------|--------------------------------------------------------------|----------------------------------------------|--------------------|-------------------|
| `on`     | ワークフローをトリガーするGitHubイベントを定義            | `on: [push, pull_request]`                   | Workflow Level     | Yes               |
| `jobs`   | 並行して実行される一つ以上のジョブをまとめる                  | `jobs: { build: { runs-on: ubuntu-latest } }`| Workflow Level     | Yes               |
| `steps`  | ジョブ内の一つ以上のステップをまとめる                        | `steps: [ - uses: actions/checkout@v2 ]`     | Job Level          | Yes (in `jobs`)   |
| `uses`   | ジョブ内のステップの一部として使用するアクションを指定      | `uses: actions/checkout@v2`                  | Step Level         | Yes (in `steps`)  |
| `run`    | ジョブ内のステップの一部として実行するシェルコマンドを指定  | `run: echo Hello, world!`                    | Step Level         | Yes (in `steps`)  |
| `name`   | ステップまたはジョブに対して人間が読める文字列を設定        | `name: Greet Everyone`                       | Job or Step Level  | No                |
| `runs-on`| ジョブを実行するための仮想ホストマシンのタイプを指定        | `runs-on: ubuntu-latest`                     | Job Level          | Yes               |

## 🚀 GitHub Actionsをもっとちゃんと使うために

最低限使えるようになったらより細かい自動化をするために以下追加要素の表を作成しました。アイデア次第で結構いろんなことができそう。

:::message
基本的に必要要素は先に説明したもので、以降紹介する要素は必須ではないです
:::

### 追加要素

| Element   | Description                                                  | Example                                                  | Context           |
|-----------|--------------------------------------------------------------|----------------------------------------------------------|-------------------|
| `concurrency`       | 同時実行を制御 & ワークフローの実行が競合しないようにする                    | `concurrency: group: ${{ github.head_ref }}, cancel-in-progress: true` | Workflow Level |
| `env`     | ジョブやステップの実行環境に環境変数を設定                | `env: { NODE_ENV: 'production' }`                        | Job or Step Level |
| `if`      | 特定の条件が真のときにジョブやステップを実行するかどうかを決定| `if: github.ref == 'refs/heads/main'`                    | Job or Step Level |
| `schedule`          | ワークフローを定期的に実行するためのスケジュールを設定                        | `on: schedule: - cron: '0 0 * * *'`                            | Workflow Level    |
| `secrets` | セキュリティ上の理由で保護する必要がある値をワークフローに安全に渡す| `secrets: { GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} }` | Job or Step Level |
| `needs`   | 他のジョブの完了を待つジョブの依存関係を定義                | `needs: [job1, job2]`                                    | Job Level         |
| `outputs` | ジョブの実行結果を他のジョブで使用できるように出力          | `outputs: { output1: 'value' }`                          | Job Level         |
| `permissions`       | ワークフローがアクセスするリポジトリの権限を設定                              | `permissions: issues: write`                                   | Workflow Level    |
| `workflow_dispatch` | ワークフローを手動でトリガーするためのイベント                                | `on: workflow_dispatch`                                        | Workflow Level    |

## サンプルテンプレート

今までの表にあった要素(全部じゃないけど)を使ったテンプレートを考えてみました。
こんな感じで使えるんだよっていうのがイメージしてもらえたらありがたいです。

```yml
name: Example Workflow

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  issues: write

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2

    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '20'

    - name: Install dependencies
      run: npm install

    - name: Run a script
      run: npm test

    - name: Conditional step
      if: github.ref == 'refs/heads/main'
      run: echo "This step runs only on the main branch."

    env:
      NODE_ENV: production

  another-job:
    needs: build-and-test
    runs-on: ubuntu-latest
    steps:
    - name: Another step
      run: echo "This job runs after build-and-test."

    env:
      ANOTHER_ENV: value
```

このGitHub Actionsワークフローテンプレートは、以下の一連の操作を自動化するために設計されています：

1. **イベントトリガー**:
   - `main`ブランチへのプッシュ時
   - `main`ブランチへのプルリクエスト作成時
   - 手動での実行（`workflow_dispatch`を通じて）

2. **実行権限の設定**:
   - リポジトリのコンテンツを読み取る権限
   - issueに書き込む権限

3. **ビルドとテストの自動化** (`build-and-test`ジョブ):
   - GitHubリポジトリからコードをチェックアウト
   - Node.jsのセットアップ
   - 依存関係のインストール (`npm install`)
   - スクリプトの実行（例: `npm test`）
   - `main`ブランチ上でのみ実行される条件付きステップの追加
   - 環境変数`NODE_ENV`を`production`に設定

4. **依存ジョブの実行** (`another-job`ジョブ):
   - `build-and-test`ジョブが成功した後に実行
   - 単純なエコーコマンドを実行して、ジョブ間の依存関係と実行順序を示す
   - 環境変数`ANOTHER_ENV`を設定

## 🎉 まとめ

GitHub Actionsでもifとかつかえるんですね、、こだわったら沼りそうです笑
この記事で紹介した基本要素と追加要素を理解して活用できればかなりいろんなことが自動化できそうです！

ぜひ、自分のプロジェクトでGitHub Actionsを使ってみてください。

## 💡 補足

https://docs.github.com/ja/actions

:::message
公式もAWSやGCPの公式サイトと違って結構みやすい笑
本記事で解決できない内容は公式参照してください！！
:::
