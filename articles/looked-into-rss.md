---
title: "RSSについて気になったので調べてみた"
emoji: "📰"
type: "tech"
topics: ["RSS", "情報収集", "ウェブ技術"]
published: true
publication_name: "ap_com"
published_at: 2024-11-06 12:00
---

## 🌟 はじめに

おぐまです。
最近、効率的な情報収集方法を探していたところRSSという技術が気になりました。
昔から存在は知っていてAWSの最新情報もRSSで取得するようにしています。サイトの更新情報を取得して通知してくれるアレです。

https://dev.classmethod.jp/articles/aws-rss-feeds/

知っていた使っていたものの仕組みをよく知らず夜も眠れなくなったので調べてみました。
その内容をシェアしたいと思います。

## 📡 RSSとは

RSSは「Rich Site Summary」または「Really Simple Syndication」の略で、ウェブサイトの更新情報を配信するための仕組みです。
主に以下のような特徴があります。

- XMLベースのフォーマットを使用
- ウェブサイトの新着情報や更新情報を効率的に配信
- RSSリーダーと呼ばれるツールで購読可能

## 🔍 RSSの仕組み

RSSの基本的な仕組みは以下の通りです。

1. ウェブサイトがRSSフィードを作成・公開
2. ユーザーがRSSリーダーにフィードを登録
3. RSSリーダーが定期的にフィードをチェックし、更新情報を取得
4. ユーザーがRSSリーダーで更新情報を閲覧

:::message alert
そもそも1のウェブサイトがRSSフィードを提供していないと使えないわけではないです。👇で対処できます。

1. **RSS生成サービスの利用**：
   RSS.appやFeed43などのサービスを使用して、ウェブサイトのコンテンツからRSSフィードを生成する。

2. **スクレイピング技術の活用**：
   Pythonなどのプログラミング言語を使用して、ウェブサイトの内容を定期的にスクレイピングし、独自のRSSフィードを作成する。

3. **ブラウザ拡張機能の利用**：
   一部のブラウザ拡張機能は、RSSフィードのないウェブサイトからフィードを生成する機能を提供しています。

4. **Feed Creator**：
   FiveFilters.orgのFeed Creatorなどのツールを使用して、特定のウェブページから情報を抽出し、カスタムRSSフィードを作成する。

5. **メールアラートの利用**：
   一部のウェブサイトでは、RSSの代わりにメールアラートを提供しています。これを利用して更新情報を取得することもできます。

:::

## 🛠 RSSの活用方法

RSSを活用することで以下のようなメリットがあります。

- 複数のウェブサイトの更新情報を一元管理
- 必要な情報を効率的に収集
- サイト訪問の手間を省く

## 🔒 RSSのセキュリティ

RSSフィードは基本的に公開情報を扱うため、セキュリティ上の大きな問題はありません。ただし、RSSリーダーの選択時にはプライバシーポリシーを確認することをおすすめします。

## 💡 まとめ

RSSは、情報洪水の時代に効率的な情報収集を可能にする技術です。使い方次第で、生産性向上やトレンド把握に大きく貢献する可能性があります。また、RSSフィードが提供されていない場合でも、代替手段を活用することで同様の効果を得ることができます。

## 参考

https://ja.wikipedia.org/wiki/RSS
https://uxmilk.jp/44993
https://rss.app/