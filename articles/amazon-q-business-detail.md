---
title: "[AWS] Amazon Q Business良さそうなので徹底解説"
emoji: "🚀"
type: "tech"
topics: ["AWS", "AmazonQBusiness", "AI", "クラウド", "ビジネス"]
published: false
publication_name: "ap_com"
published_at: 2024-10-23 12:00
---

## 🌟 はじめに

おぐまです。

今回は、AWSが提供する新しいサービス「Amazon Q Business」について詳しく解説していきます。
Amazon Q Businessを使えば、生成AIの力を簡単にビジネスに取り入れられます。

## 🤖 Amazon Q Businessとは

Amazon Q Businessは、**ビジネス向けの生成AI機能をすぐに利用できるようにするサービス**です。
企業の知的資産を最大限に活用し、生産性を向上させるための強力なツールとして設計されています。

具体的には、以下のような機能を提供します：

- LLM（大規模言語モデル）を活用した自然言語対話
- RAG（Retrieval-Augmented Generation）による情報検索と回答生成
- 多様なデータソース連携
- Webインターフェース
- セキュアな認証認可

Amazon Q Businessでは、セキュリティとアクセス制御のために**IAM Identity Center**を使用して認証と認可を行います。
これにより、ユーザーごとに適切なアクセス権限を設定し企業のデータを安全に管理できます。

## 📖 Amazon Q Businessの必要性

企業内には膨大な情報が存在し、それらを効率的に活用することが課題となっています。
Amazon Q Businessは、これらの情報を統合しAIの力で簡単にアクセス可能にすることで以下のような効果が期待できます：

- **情報検索の効率化**：必要な情報をすぐに見つけられる
- **意思決定の迅速化**：データに基づいた判断が素早くできる
- **業務プロセスの自動化**：ルーチンタスクをAIが代行

## 👷 Amazon Q Businessの主要コンポーネント

Amazon Q Businessは、いくつかの重要なコンポーネントで構成されています。
それぞれについて見ていきましょう。

### 💾 データソースコネクタ

データソースコネクタは、様々な情報源からデータを取得するためのコンポーネントです。
40以上のコネクタが用意されており以下のようなサービスと連携可能です：

- Amazon S3
- Microsoft 365
- Salesforce
- Dropbox
- Google Drive

これにより、社内のさまざまな情報源から統合的に情報を取得し質問に答えることができます。

### 📊 インデックス

インデックスは、取得したデータを保存しAIが利用しやすい形に変換する場所です。
`Starter Index`と`Enterprise Index`の2種類があり扱えるデータ量が異なります。

### 🔍 Retriever

Retrieverは、ユーザーの質問に応じてインデックスから適切なデータを取得する役割を果たします。
Native RetrieverとAmazon Kendraの2つのオプションがあります。

### 🧠 LLM（大規模言語モデル）

Amazon Q BusinessではLLMを意識する必要はありません。
裏側でAmazon Bedrockを利用していると考えられます。※Amazon Qの裏側がBedrockらしいので

### 🔐 ID管理

ID管理にはIAM Identity Centerを使用します。
外部のIDプロバイダーとの連携も可能です。

## 🌐 Webインターフェースとその他の機能

Amazon Q Businessは標準でWebインターフェースを提供します。
さらに、以下のような機能も備えています。

### 自然言語による対話

ユーザーは自然な言葉で質問をすることができ、AIが適切な回答を生成します。
例えば：

- 「先月の売上実績はどうだった？」
- 「新製品のマーケティング戦略について教えて」
- 「有給休暇の残日数を教えて」

### Amazon Q Apps

自然言語でAIアプリケーションを作成できる機能です（プレビュー版）。
例えば：

- 文書校正アプリ
- 営業提案書生成アプリ
- 顧客対応シナリオ作成アプリ

これらのアプリは社内で共有することも可能です。

### その他の機能

- プラグイン：JiraやSalesforceなどの外部サービスと連携
- ガードレール：AIの応答をコントロールする機能

## 🔒 セキュリティとプライバシー

Amazon Q Businessは、企業のセキュリティ要件に配慮した設計となっています。

- **アクセス制御**: AWS IAM Identity Centerと連携しユーザーごとのアクセス権限を管理
- **データ保護**: 企業のデータはAWS KMSを使用して暗号化され安全に保管
- **コンプライアンス**: FIPSエンドポイントのサポートなど各種規制に準拠した運用が可能

## 💰 料金体系

Amazon Q Businessの料金は、インデックスと利用ユーザー数に基づいて計算されます。

| 機能 | Amazon Q Business Lite | Amazon Q Business Pro |
|------|------------------------|------------------------|
| 月額料金 | 3 USD/ユーザー | 20 USD/ユーザー |
| 基本機能 | 質問をしたり、許可に応じた応答を受け取る機能 | Liteの機能に加え、以下の追加機能 |
| インサイト取得 | 基本的なインサイト | 高度なインサイト取得機能 |
| アプリケーションへのアクセス | 基本機能へのアクセス | フル機能へのアクセス |
| Amazon Q Apps | 利用不可 | 利用可能（プレビュー） |
| Amazon Q in QuickSight | 利用不可 | 利用可能（Reader Pro） |

また、インデックスの料金も別途かかります：

- Starter Index: 0.140 USD/時間
- Enterprise Index: 0.264 USD/時間

詳細は以下公式の料金ページをご覧ください
https://aws.amazon.com/jp/q/business/pricing/

:::message alert
注意点

1. 無料トライアル期間で、50ユーザーまで60日間無料で利用できます。
2. Indexはアプリケーションごとに 1,500 インデックス時間の無料トライアルがあります。こちらも60 日間使用可能。

:::

## 🎉 まとめ

Amazon Q Businessを使えば、生成AIの力をビジネスに簡単かつ安全に取り入れることができます。
データソースの連携からWebインターフェースの提供、そして強固な認証認可まで必要な機能が揃っているのでAIを活用したビジネスアプリケーションを素早く立ち上げることができそうです。

これにより、業務の効率化やカスタマーサポートの向上など様々な場面でAIの恩恵を受けることができます。

## 参考

1. [Amazon Q Business公式ページ](https://aws.amazon.com/jp/q/business/)
2. [Classmethod - Amazon Q Business紹介](https://dev.classmethod.jp/articles/introduction-2024-amazon-q-business/)
