---
title: "Google ColabでLangChainを使ってGitHubリポジトリを学習させる"
emoji: "🚀"
type: "tech"
topics: ["LangChain", "GitHub", "AI", "Python", "GoogleColab"]
published: false
publication_name: "ap_com"
published_at: 2024-11-27 12:00
---

## 🌟 はじめに

おぐまです。
Google Colabを使ってLangChainでGitHubリポジトリの内容を学習し、質問に答えられるシステムを作る方法をご紹介します。
環境構築の心配なく、ブラウザだけで試せるようにしました！😆

:::message alert
【重要】OpenAI APIの使用には料金が発生します。
使用前に必ず料金体系を確認し、予期せぬ高額請求を避けるため使用量の上限設定を行ってください。
本記事の内容を試す際は最小限の使用にとどめることをおすすめします。
:::

## 👷‍♂️ Google Colabでの準備

特にありません！
以下から[Langchain_GithubLoader.ipynb](https://colab.research.google.com/github/9mak/Langchain_GithubLoader/blob/main/Langchain_GithubLoader.ipynb#scrollTo=2qcdDAWw8FNR)を開いてREADMEに従い実行してください。

https://github.com/9mak/Langchain_GithubLoader

## 🎨 コードの説明

1. 必要なモジュールをインポートします。
2. OpenAI APIキーを環境変数から取得します。
3. GitHubリポジトリの情報を設定します。
4. GitLoaderを使ってリポジトリの内容を読み込みます。
5. VectorstoreIndexCreatorを使ってインデックスを作成します。
6. RetrievalQAチェーンを作成し、質問を設定して回答を取得します。

## 🤔 注意点

:::message alert

- 【非常に重要】APIの使用料金に十分注意し、使用量の上限を設定して定期的に使用状況を確認してください。
- OpenAI APIキーは安全に管理し、Colabノートブック共有する際はAPIキーが含まれていないことを確認してください。
- 大規模なリポジトリ処理時はColabの実行時間制限に注意してください。
- ネットワーク接続や権限の問題でエラーが発生する可能性があります。

:::

## 🎨 実行結果例

コードを実行すると、以下のような出力が得られます。
サンプルコードでは[自分のGithubのProfile](https://github.com/9mak/9mak)を読み込んでいます。

```markdown
インデックスの作成が完了しました。
質問: GithubのProfileにどんなものが設定されていますか？
回答: GitHubのプロフィールには以下の情報が設定されています：

- スキルセクションにはPython、CSS、Dart、JavaScriptが表示されています。
- GitHubの統計情報として、リポジトリの統計、活動時間、使用言語の割合、最も多くコミットした言語などが表示されています。
- GitHubプロフィールの詳細情報が表示されています。
- Spotifyの最近再生されたトラックが表示されています。
```

## 🎉 まとめ

このGoogle Colabスクリプトを使用することでGitHubリポジトリの内容を学習し、質問に答えられるシステムを簡単に作成できます。
LangChainとOpenAIの力を借りて、大規模なコードベースやドキュメントの理解を効率化できます。

JustIdeaですがGithubActionと組み合わせて指定した**GithubリポジトリのREADMEを自動作成**することもできると思います！

:::message alert
最後に重ねて注意しますがOpenAI APIの使用には料金が発生します。
使用する際は十分に注意し、必要最小限の使用にとどめてください。
不要な高額請求を避けるため、使用量の上限設定を必ず行ってください。
:::

### 参考

https://zenn.dev/umi_mori/books/prompt-engineer/viewer/github_repository_langchain_chatgpt
