---
title: "[AWS] Amazon Bedrock Prompt Management が一般提供開始！新機能と活用方法"
emoji: "🤖"
type: "tech"
topics: ["aws", "bedrock", "ai", "llm", "prompt"]
published: false
publication_name: "ap_com"
published_at: 2024-12-18 12:00
---

## 🌟 はじめに

[おぐま](https://github.com/9mak)です。
Amazon Bedrockの新機能「Prompt Management」が一般提供（GA：General Availability）となりました。
本記事では、新機能の概要と主な特徴について解説します。

:::message
ちょっと前までPreviewでAPIから利用できなかったりもうちょい機能ほしいなぁという印象でしたが
GAとなったことでAPIからも利用できるようになっていたので紹介です。
:::

## 🎯 Prompt Managementとは

Amazon Bedrock Prompt Managementは、開発者やプロンプトエンジニアがFoundation Models（FMs）からより良い応答を得るために、プロンプトの作成、評価、バージョン管理、共有を簡素化するツールです。

## 🚀 新機能の概要

### 構造化プロンプト

- システム指示（System Instructions）の定義
- ツール設定
- 追加メッセージの設定が可能

### API統合の強化

- Converse APIとInvokeModel APIから直接プロンプトの呼び出しが可能
- Prompt ARNを指定するだけで利用可能

## 💡 主な特徴

### プロンプト作成と反復

- Prompt Builderを使用した複数のFMでの実験
- モデル設定、システム指示、ユーザー/アシスタントメッセージの設定
- 最大3つのバリエーションの同時比較が可能

### コラボレーション機能

- SSO対応のウェブインターフェース
- チーム間でのプロンプト作成と評価
- プロンプトの共有が容易

![AWS Bedrock Studio画面](/images/amazon-bedrock-prompt-management-ga-release/bedrock-studio.png)

:::message
この画面内で複数人によるプロンプトを作成、評価、共有ができるとのこと
:::

### エンタープライズ機能

- カスタムメタデータの保存
- 作成者、チーム、部署などの情報管理
- バージョン管理機能

## 🌏 利用可能なリージョン

| リージョン | 地域 |
| --------- | ---- |
| 米国 | 東部（バージニア北部）、西部（オレゴン） |
| ヨーロッパ | パリ、アイルランド、フランクフルト、ロンドン |
| アジアパシフィック | ムンバイ、東京、シンガポール、シドニー |
| その他 | 南米（サンパウロ）、カナダ（中部） |

## 💻 実装例

### Converse APIでの利用

```python
import json
import boto3

bedrock = boto3.client('bedrock-runtime', region_name='us-west-2')

modelId = "Prompt ARN"
promptVariables = {
    "name": {"text": "カレー"},
    "number": {"text": "10"},
    "language": {"text": "英語"}
}

response = bedrock.converse(
    modelId=modelId,
    promptVariables=promptVariables
)

print(response["output"]["message"]["content"]["text"])
```

## 🎉 まとめ

Amazon Bedrock Prompt Managementの一般提供開始により、以下のような利点が得られます：

- プロンプトの管理と運用が容易に
- コンソール上での一元管理が可能
- バージョン管理による安全な運用
- APIを通じた柔軟な統合

:::message
特に、プロンプト、モデル、プロパティといった設定をAWSコンソール上から管理できる点が大きな特徴となっています。
:::

:::message alert
本機能は各リージョンで順次展開されているため、利用可能なリージョンは随時確認することをお勧めします。
:::

https://aws.amazon.com/jp/bedrock/prompt-management/

https://aws.amazon.com/jp/blogs/machine-learning/amazon-bedrock-prompt-management-is-now-available-in-ga/
