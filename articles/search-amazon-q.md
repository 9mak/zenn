---
title: "Amazon Qについて調べてみた - AWSの新しいAIアシスタントの可能性"
emoji: "🤖"
type: "tech"
topics: ["AWS", "AmazonQ", "AI", "クラウド"]
published: true
publication_name: "ap_com"
published_at: 2024-10-16 12:00
---

## 🌟 はじめに

おぐまです。

AWSが2023年末のre:Inventで発表した新しいAIアシスタント「Amazon Q」について調査しました。
開発者支援から業務効率化まで幅広く使えるAIツールとして注目されています。
これからAmazon Qの利用を検討されている方や、このサービスにご興味をお持ちの方に向けてその概要や特徴をお伝えいたします。

## ✅ 発見

Amazon Qには以下の種類があることがわかりました：

1. AWS上でのシステム開発支援（Amazon Q For AWS Builder Use）
    - AWSコンソールでの利用
    - コンソールエラーのトラブルシューティング
    - AWS Supportとのチャット

2. IDE内での開発支援（Amazon Q in IDEs）
    - Visual Studio CodeやIntelliJでのAWS Toolkit統合
    - コード説明、バグ修正、リファクタリング支援

3. 一般的なビジネス用途向けAIアシスタント（Amazon Q For Business Use）
    - 企業内データを活用したQA対応や要約
    - 40以上のビジネスツールとの連携

4. データ分析と可視化（Amazon Q in Amazon QuickSight）
    - BI支援ツールとしての機能
    - 自然言語でのグラフ作成

5. コンタクトセンター支援（Amazon Q in Amazon Connect）
    - オペレーターのAIアシスタント機能
    - リアルタイムの会話分析と推奨事項提供

6. 外部チャットアプリとの連携（Amazon Q in AWS Chatbot）
    - SlackやMicrosoft Teamsでの利用
    - AWSサービスに関する質問対応

7. ネットワークのトラブルシューティング（Amazon Q in Reachability Analyzer）
    - VPCの接続問題解決支援
    - ネットワーク構成の自動分析

8. コード開発支援（Amazon Q in Amazon CodeCatalyst）
    - 課題分析とドラフトソリューション作成
    - プルリクエストの自動生成

9. SQLクエリの生成（Amazon Q generative SQL in Amazon Redshift）
    - 自然言語からSQLクエリの自動生成
    - クエリの最適化提案

10. ETL処理の支援（Amazon Q Data integration in AWS Glue）
    - ETLスクリプトの生成と最適化
    - データ統合プロセスのトラブルシューティング

11. コードの自動変換（Amazon Q Code Transformation）
    - レガシーコードの最新言語バージョンへの変換
    - クロスプラットフォーム対応のコード変換

12. AWS Console Mobile Appとの連携
    - モバイルでのAWSリソース管理
    - 音声認識によるクエリ入力機能

## 📌 調べたこと

ここでは、Amazon Qの中でも主要な種類(提供形態)について詳しく見ていきます。

### 🗣️ Amazon Q For AWS Builder Use

AWSコンソールの右側のアイコンをクリックすることで利用できるこの機能は、AWS開発者にとって強力な味方となりそうです。

- **AWSサービスの選択支援**: 適切なAWSサービスの選び方をアドバイスしてくれます。
- **CLIコマンドの提案**: 複雑なAWS CLIコマンドの構築をサポートします。
- **エラーのトラブルシューティング**: コンソールで発生したエラーの解決策を提案します。
- **AWS Supportとの連携**: より複雑な問題に対しては、AWS Supportとのチャットを通じて解決を図ることができます。

現時点では英語のみの対応となっているため、日本語で質問を考えて翻訳ツールで英語化する必要があります。

![AWSコンソールトップにいるAmazon Q](/images/search-amazon-q/amazon_q_builder_use.png)
![日本語はしゃべれないAmazon Q](/images/search-amazon-q/amazon_q_builder_use_chat.png)

### 💻 Amazon Q in IDEs

開発者の作業環境であるIDEに直接統合されるこの機能は、コーディングプロセスを大幅に効率化できそうです。

- **AWS Toolkit統合**: Visual Studio CodeやIntelliJなどの主要IDEでAWS Toolkitの一部として利用可能です。
- **コード説明**: 複雑なコードブロックの説明を生成し、理解を助けます。
- **バグ修正支援**: コード内のバグを特定し、修正案を提案します。
- **リファクタリング**: コードの品質向上のためのリファクタリング案を提示します。

### 🌐 Amazon Q For Business Use

ビジネス向けに特化したこの機能は、企業内の情報を有効活用できる可能性があります。

- **企業内データの活用**: 社内文書やデータベースなど、企業固有の情報を基にした質問応答が可能です。
- **多様なツールとの連携**: Microsoft 365、Salesforce、Amazon S3など、40以上のビジネスツールと連携し幅広い情報源からデータを取得します。
- **セキュリティ重視**: 企業のセキュリティポリシーに準拠し、機密情報を保護しながら利用できます。

現在、Amazon Q For Business Useが使用できるのはバージニアとオレゴンリージョンのみとなっています。
また、日本語にはまだ対応していないようです。

:::message
個人的に`40以上のビジネスツールと連携し幅広い情報源からデータを取得します`が気になるので今度触ってみます。
Bedrockのナレッジベースとかと似ている？
:::

## 🎉 まとめ

Amazon QはAWSの豊富なサービスと統合された強力なAIアシスタントです。
開発者支援から業務効率化、データ分析、ネットワークトラブルシューティングまで、幅広く活用できそうです。
特に、セキュリティとプライバシーをしっかり守ってくれるところが、企業で使うには心強いポイントだと感じました。

現時点では英語のみの対応や、利用可能なリージョンが限られているなどの制限がありますが今後のアップデートや日本語対応早くしてほしい。

## 💡 補足

- Amazon Q For AWS Builder Useは、既に利用可能です。
- Amazon Q For Business Useは、今年中に東京リージョンでの提供開始が予定されているそうです。
- コード生成やリファクタリング、ソフトウェアアップグレードなど、開発者向けの高度な機能も提供されているようです。

次は実際に触ってみて、その体験をお伝えできたらいいなと思っています。
では、また次回！
