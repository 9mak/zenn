---
title: "Dialogflow CXの基本を表でサクッと理解する"
emoji: "💆"
type: "tech"
topics: ["gc24", "ai", "googlecloud", "gcp"]
published: true
publication_name: "ap_com"
published_at: 2024-02-14 12:00
---
## 🌟 はじめに

おぐまです。

職場でGCPを使わせていただけることになったんですが正直GCPは毛嫌いしていました笑

AIについてはChatGPT使っているくらいで、どんな仕組みでどうやってできているかは全く知らない状態なので前提知識がほぼない状態からのスタートです🚀

手段は選ばす大体のゴールとして、部署内の問い合わせ対応や作業申請サポート、障害対応サポートができるチャットボットが作れたらいいなと思っています。

今回のゴールに合わせて技術選定していく中でGCPのサービスの中でも`Dialogflow CX`が使えそうなのがわかったので、`Dialogflow CX`の基本的な概念と実際のコンソール画面をみてどんなことができそうか記事にまとめました。

## 📖 Dialogflow CXってなんなんだ

### Dialogflowとは

まずは公式から

> Dialogflow CX は、エージェント設計のためのステートマシン アプローチを採用し、エージェント設計の新しい方法を提供します。これにより、会話を明確かつ明示的に制御して、エンドユーザーのエクスペリエンスと開発ワークフローを改善できます。

Dialogflow CX は、チャットボットなどの会話型**AIの作り方を新しくするツール**で、このツールを使うと開発者は**ユーザーとBotの会話の流れをもっと簡単に**作り、整理できる　と解釈しました。

-----

#### ツリー構造にしてみた

```yml
Dialogflow CX
├── Agents
│   ├── Flows
│   │   ├── Pages
│   │   │   ├── Intents
│   │   │   ├── Entity types
│   │   │   ├── Parameters
│   │   │   ├── Forms
│   │   │   └── State handlers
│   │   └── Fulfillment
│   │       └── Webhook
├── Regionalization and location settings
├── Console
├── Integrations
└── Interactions
```

-----

#### 表にしてみた

| Element                      | Description                                      |
|------------------------------|--------------------------------------------------|
| Agents                       | 会話型エージェント全体               |
| Flows                        | 会話の流れを管理し                         |
| Pages                        | 会話の特定の状態を表す                     |
| Entity types                 | ユーザー発言から特定の情報を抽取り出す         |
| Parameters                   | セッション中に収集される情報を表す         |
| Forms                        | ユーザーから必要な情報を収集するための構造 |
| Intents                      | ユーザーの意図を識別し                      |
| Webhook                      | 外部APIとの連携を可能にする                   |
| Fulfillment                  | ユーザーのリクエストに応じて回答を生成する|
| State handlers               | 会話の流れの制御を助ける                     |
| Regionalization and location | エージェントの地域設定を管理             |
| Console                      | エージェントの設計と管理を行うUI           |
| Integrations                 | 外部プラットフォームとの統合を可能にする     |
| Interactions                 | ユーザーとエージェントのやり取りを表す     |

:::message

- なんとなくいろんな機能があることだけわかった
- Consoleの中で操作してAgents, Flowsで仕組みを作っていく

:::

## 🚀 Dialogflow CXのConsoleを見てみる

Dialogflow CXの要素を実際にコンソール画面で見てみます！

:::message alert
同じ区見て見ようとする方は以下準備が必要なので注意ください

- GCPアカウント作成
- GCP請求先設定
- Project作成
- DialogflowのAPI有効化

:::

-----

上記が揃った状態で以下進みます！
まず[Dialogflow CXのコンソール](https://dialogflow.cloud.google.com/cx/projects?hl=ja)に行きます。

作成しているプロジェクトがあればオレンジ枠のように選択肢として出てくるので選択します。

※作成していない場合は `Create New Project` を選択するみたいです。
![select_project](/images/dialogflowcx-basic-guide/select_project.png)

次に `Create agent` を押します。
ツリー構造でみた上位のものですね。
会話型エージェント全体なのでスペースを作成するイメージ？

![create_agent](/images/dialogflowcx-basic-guide/create_agent.png)

`Create agent` 画面で地域設定等あるのでよしなに入力して `Create` を押します。

![set_location](/images/dialogflowcx-basic-guide/set_location.png)

なんか2つ画面が出てきました。
とりあえず今回は各要素がどんな感じで並んでいるかみたいので `Build your own` を選択します。

![select_build](/images/dialogflowcx-basic-guide/select_build.png)

:::message
ちなみに上の方を選択すると `Vertex AI` に飛びました
![auto_generate](/images/dialogflowcx-basic-guide/auto_generate.png)
:::

Agentの作成が完成すると以下のようBuild画面に遷移します。

Flowを編集する画面があり、 `Default Start Flow` というフローがあります。
Pagesもデフォルトで `Start Page` があります。どちらも複数作成できるようです。

![build_top](/images/dialogflowcx-basic-guide/build_top.png)

次に左カラムの `Build` から `Manage` に遷移してみました。
ここではFlowやPageを作成する要素となる `Intents` や `Entity types` がありますね。

`Generators` とかなんか強うそうなものもあるし、テストやGitとの連携、CI/CD機能もあるようです。

![console1](/images/dialogflowcx-basic-guide/console_1.png)

![console2](/images/dialogflowcx-basic-guide/console_2.png)

## 🎉 まとめ

記事ボリュームがすごくなりそうなので今回はさわりだけ紹介になりました。

Dialogflow CXを使えば、誰でも簡単に高度な会話型AIを開発できるようです。
コンソールもGoogle色が強くまだ慣れないですが、次回は簡単なチャットボット作成までやって見ようと思います。

## 💡 補足

https://cloud.google.com/dialogflow/cx/docs
