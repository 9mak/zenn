---
title: "DialogFlow CXで天気予報チャットボットをつくる: Intent編"
emoji: "☔"
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["gc24", "gcp", "dialogflowcx", "chatbot", "ai"] # 記事に関連するトピックをここに入力
published: true
publication_name: "ap_com"
published_at: 2024-03-13 12:00
---

## 🌟 はじめに

おぐまです。

勉強も兼ねてDialogFlow CXを使用した天気予報チャットボットを作ります！

1つにまとめるとかなりのボリュームになりそうなので、それぞれ設定項目を分割していきます。

1. `Intent`の作成
2. `Entity`の作成
3. `Flow,Pages`の作成
4. `???` ※ここで作成したシンプルチャットボットを改造(応用)する

くらいで分割して進めていくのでお付き合いください💆

## 👷‍♂️ 事前準備

- Google Cloud Platform アカウント
- DialogFlow CX Agentを作っている状態

https://zenn.dev/ap_com/articles/dialogflowcx-basic-guide

:::message
ここまでの前提知識含む事前準備は、上記にまとめてあるのでぜひ参考にしてみてください
:::

## 📖 ステップ

### 👉 Intentの理解

Intentはユーザーの入力意図を理解し、適切な応答を生成するためものです。

Intentを設定することでユーザーが何をしたいのか言いたいのかを特定して、それに応じてチャットボットが対応できるようになります。

まずはIntent画面の要素と作成画面でどのような項目があるかみてみます🌜

#### 📺　Intents画面の機能

![Intent_Top](/images/dialogflow-chatbot-shuzo-weather-forecast-intent/Intent_Top.jpg)

| 機能              | 説明                                                  |
|-----------------|-----------------------------------------------------|
| Intents         | 既存のIntentのリストを表示し、新しいIntentの追加や編集を行う |
| Suggestions     | DialogFlowが自動的に生成するIntentの提案を表示する         |
| Overlaps        | 異なるIntent間で発話例が重複している場合に警告を表示する     |
| Import          | 外部からIntentの定義をインポートする機能                 |
| Create          | 新しいIntentを作成するためのボタン                     |
| Default Intents | DialogFlowには、デフォルトで用意されている一般的なIntent   |

#### 📺　Intent作成画面の要素

![Intent_Create_Top](/images/dialogflow-chatbot-shuzo-weather-forecast-intent/Intent_Create_Top.jpg)

| 要素                 | 説明                                                  |
|--------------------|-----------------------------------------------------|
| Display name       | インテントに付けられる名前。ユニークである必要があります           |
| Labels             | インテントを分類するためのタグやラベル管理や検索を容易にします      |
| Description        | インテントの目的や機能を説明するテキスト                         |
| Training Phrases   | ユーザーがインテントをトリガーする可能性のある発話例               |
| Skip auto annotation | トレーニングフレーズ内でDialogFlowによる自動Entity識別をスキップするかどうか |

### 👉 Intentの作成

次は実際にIntentを作ってみます。

1. `Intent`のトップ画面で`Create`を選択
2. ***Display name**: `WeatherForecast`と入力
3. **Description**: `ユーザーからの天気予報に関する質問に応答するインテント`と入力
4. **Labels**: インテントを分類するために、`weather`や`forecast`などのラベルを付ける
5. **Training Phrases**: 手動追加もできますがcsvにまとめてファイルアップロードして一括追加も可能なので今回はアップロードします。`アップロードボタン` > `ファイル選択` > `Select import mode`を選択 > `Submit` を押してアップロード

:::details それぞれの画面キャプチャ

**1**
![Intent_Create](/images/dialogflow-chatbot-shuzo-weather-forecast-intent/Intent_Create.jpg)

**2-5**
`Create`を押すと👇の画面になるのでアップロードしていく

![Intent_Create_Upload](/images/dialogflow-chatbot-shuzo-weather-forecast-intent/Intent_Create_Upload.jpg)

`Import as new training phrases`を選択して`Submit`

![Intent_Create_Upload_02](/images/dialogflow-chatbot-shuzo-weather-forecast-intent/Intent_Create_Upload_02.jpg)

`Intent`が作成されて以下のような画面になる

![Intent_Create_Upload](/images/dialogflow-chatbot-shuzo-weather-forecast-intent/Intent_Create_TraningPhrase.jpg)

:::

:::details 今回アップロードしたcsvファイルの中身

```csv
今日の天気は？
明日の天気を教えて
週末の東京の天気予報を知りたい
来週の大阪の天気はどうですか？
```

:::

:::message alert

- `Select import mode`は**追加**(Import as new training phrases) と **上書き**(Replace existing training phrases)が選べます

- `※Skip auto annotation`をdisableにすると、フレーズを追加すると自動で`Parameter id`や`Entity type`が識別されます

:::

#### 💡 補足

- Intentを細かく設定することで、ユーザーの質問に対してより正確に応答できるようになる
- トレーニングフレーズは多様性を持たせることが大事
- 異なる言い回しや表現を含めることで、チャットボットの理解度を向上させる
- `Intent` の `Suggestions` 機能は、実際のユーザーの発言パターンから**学習、分析**して新しいインテントやトレーニングフレーズを提案してくれるもの
  提案された内容を確認し有用だとおもったら、エージェントのトレーニングデータに適用することでエージェントのパフォーマンスをあげることができる🕺

  :::message
  簡単に言うと「いいな」と思った提案を選んでエージェントに取り入れるというプロセスになります
  :::

## 🎉 まとめ

今回は、DialogFlow CXを使用して天気予報チャットボットを作成する際の `Intent` の設定方法について詳しく解説しました。
次のステップでは、Entityを設計する方法について詳しく説明します。

## 💡 参考

https://cloud.google.com/dialogflow/cx/docs/concept/intent
