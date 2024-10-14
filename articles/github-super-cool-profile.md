---
title: "GitHubのProfile README自動更新するようにした"
emoji: "🐻"
type: "idea"
topics: ["GitHub", "GitHubActions", "自動化", "プロフィール"]
published: false
publication_name: "ap_com"
published_at: 2024-11-20 12:00
---

## 🌟 はじめに

おぐまです。
GitHubプロフィールいい感じに作ってみました。
手動で更新するのは面倒で、最新情報を反映し忘れることもあるので一部自動化しています。

:::message
事例紹介だけで詳細コードの紹介はしていません。
詳細は[プロフィール](https://github.com/9mak)をご覧ください。
:::

## 👷‍♂️ プロフィール画面

https://github.com/9mak

![profile](/images/github-super-cool-profile/9mak_git_profile.png)

## 📝 実装内容

以下の要素を自動的に更新するGitHubプロフィールREADMEを作成しました。

1. **スキルセクション**
   - GitHub APIを使用して、リポジトリで使用されている言語を自動取得
   - skillicons.devを利用してスキルアイコンを視覚的に表示

2. **Zenn記事セクション**
   - Zennの公開RSSフィードを使用して最新の記事（最大5件）を取得・表示

3. **Connpassイベントセクション**
   - Connpass APIを使用して参加予定のイベント情報を取得・表示

4. **GitHub統計**
   - github-readme-statsを利用して、統計情報、言語使用率、アクティビティなどを視覚的に表示

5. **Spotify再生履歴**
   - Spotify APIを使用して最近聴いた曲の情報を表示

:::message alert
`Connpassイベントセクション`で利用しているconnpass apiのみ2024/10/14現在API利用申請が必要となっています。自分もまだ申請中です。
:::

## 🎉 まとめ

今回はGitHub Actionsを使用してGitHubプロフィールを自動的に更新する方法を実装しました。これにより以下が楽になります。

- 常に最新の情報を表示できる
- 手動更新の手間が省ける
- 多様な情報源を統合し、包括的なプロフィールを作成できる
- 視覚的に魅力的なプロフィールを維持できる

今後はNetflixの視聴履歴や趣味で撮ってる写真など表示できたらいいですね(他人事

## 💡 補足

使用した主な技術やサービス

https://docs.github.com/en/actions
https://skillicons.dev/
https://zenn.dev/zenn/articles/zenn-feed-rss
https://connpass.com/about/api/
https://github.com/anuraghazra/github-readme-stats
https://github.com/JeffreyCA/spotify-recently-played-readme

これらのリソースを参考に、自分だけのGitHubプロフィールを作成してみてください！
