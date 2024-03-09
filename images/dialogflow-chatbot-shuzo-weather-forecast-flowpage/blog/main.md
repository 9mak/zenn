---
title: "DialogFlow CXで天気予報チャットボットをつくる: Flow,Pages編"
emoji: "🌥️"
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["gc24", "gcp", "dialogflowcx", "chatbot", "ai"] # 記事に関連するトピックをここに入力
published: false
publication_name: "ap_com"
published_at: 2024-04-28 12:00
---

## 🌟 はじめに

おぐまです。

勉強も兼ねてDialogFlow CXを使用した天気予報チャットボットを作ります！

それぞれ設定項目を分割して説明していて、前回は `Entityの作成` について説明しました。

1. `Intent`の作成
2. `Entity`の作成　
3. `Flow,Pages`の作成 👉 ココ！
4. `???` ※ここで作成したシンプルチャットボットを改造(応用)する

今回は3番の `Flow,Pages` について説明します。

:::message alert
今回は結構ボリュームがありますが飛ばしてよさそうなところはまとめて閉じておきます！
:::

## 👷‍♂️ 事前準備

- Google Cloud Platform アカウント
- DialogFlow CX Agent

https://zenn.dev/ap_com/articles/dialogflowcx-basic-guide

:::message
ここまでの前提知識含む事前準備は、上記にまとめてあるのでぜひ参考にしてみてください
:::

## 📖 ステップ

### 👉 Flowの理解

`Flow`はDialogFlow CXにおける会話の進行を管理するためのコンポーネントです。
フローを使用することで、特定の会話目的に沿った一連のインタラクション（`Pages`を含む）を設計し、ユーザーの入力に応じた適切な応答やアクションを定義することができます。

フロー内では、さまざまな`Pages`（会話の各ステップを表す）を組み合わせて、より複雑な会話フローを構築します。

### 📺 Flows画面の機能

| 機能                  | オプション              | 説明                                                                                                           |
|-----------------------|-----------------------|--------------------------------------------------------------------------------------------------------------|
| **Default Start Flow** |                   | デフォルトで作成されているFlow。新しいセッションが開始されると、このFlowから会話が始まります                        |
| **Add**                | **Create flow**       | 新しいカスタムFlowを作成します                                                                             |
|                       | **Use Prebuilt flow** | 事前に構築されたFlowをエージェントに追加します、特定の一般的な会話パターンや機能を迅速に統合できます    |
|                       | **Import flow**       | 既存のFlowを外部ファイルからインポートします、Flowのバックアップを復元したり、他のプロジェクトからFlowを転送したりする場合便利です |

※作成後はExportもできる

### 📺 Flows作成画面の主な要素

| 設定項目                                  | 説明                                                                                                                         |
|------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| **Display name**                         | Flowの表示名                                                                       |
| **Description**                          | Flowの目的や機能についての簡潔な説明                                                                               |
| **ML Settings**                          | マシンラーニング（ML）に関連する設定を調整します                                                                                |

※`ML Settings`以下の設定は今回不要のため省きます。利用するタイミングで以下参照ください。
https://cloud.google.com/dialogflow/cx/docs/concept/speech-models?hl=ja

### 👉 Flowの作成

1. **フローの新規作成**:
   以下どちらかで `Flows` を作成開始する
   - DialogFlow CXコンソールのサイドバーから `Flows` 横の `+` を選択し、`Create flow` を押す
   - `Flows list` - `Flows` 横の `+ Add` を選択し `Create flow` を押す

2. **フローの基本設定**: `Flow name` (`Display name`) と `Description` を入力して `Save` を押す

### 👉 Pagesの理解

`Pages`はDialogFlow CX内のフローにおける個別の会話ステップです。
それぞれのページは特定の目的を持ち、ユーザーの入力を受けて特定の応答を行うためのインテントやフルフィルメント、条件付きで分岐(Routes)させることができます。

### 📺 Pages画面の機能

| 機能                           | 説明                                                                                      |
|--------------------------------|-----------------------------------------------------------------------------------------|
| **Start Page**                 | デフォルトのフローが開始されるときに最初に遷移するページです                                                |
| **End Flow**                   | 現在アクティブなフローを終了し、現在のフローに遷移したページに戻ります。                                                            |
| **End Session**                | 現在のセッションを消去して、END_SESSION という名前の特別なページに遷移します。次のユーザー入力は、デフォルトの開始フローのスタートページでセッションを再起動します。                                                                           |
| **End Flow With Failure**      | 現在アクティブなフローを終了し、現在のフローに遷移したページに戻ります。呼び出しページは、flow-failed 組み込みイベントを使用して、この遷移を処理できます。                                                        |
| **End Flow With Human Escalation** | 現在アクティブなフローを終了し、現在のフローに遷移したページに戻ります。呼び出しページは、flow-failed-human-escalation 組み込みイベントを使用して、この遷移を処理できます。                                                      |
| **End Flow With Cancellation**| 現在アクティブなフローを終了し、現在のフローに遷移したページに戻ります。呼び出しページは、flow-cancelled 組み込みイベントを使用して、この遷移を処理できます。                                                                  |
| **Add**                        | 新しいページを追加するためのオプション                                                                            |

※End ~~ 既存で組み込まれていて編集は不可

### 📺 Pages作成画面の主な要素

| 設定カテゴリ                 | 設定項目                         | 説明                                                                                                                       |
|-----------------------------|---------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| **基本設定**                 | **Display name**                | ページの表示名                                                                                                 |
|                             | **Description**                 | ページの説明                                                                                                  |
| **Entry fulfillment**       | **Parameter presets**           | 現在のパラメータ値を設定または上書きします                 |
|                             | **Generators**                  | AIモデルを使用して、動的な応答やテキストを生成します                                                 |
|                             | **Agent responses**             | 対象のページに遷移してきたときのユーザーへの応答メッセージを定義します                                                            |
|                             | **Channel specific responses**  | 定のチャネル（例えば、テキストメッセージやソーシャルメディアプラットフォーム）にのみ返される応答を設定できる                                    |
|                             | **Webhook settings**            | Webhookの使用を有効にできます                                                                                              |
|        | **Advanced settings**                                | 同じページの音声設定、フローの音声設定、エージェントの音声設定をオーバーライドできます                                 |
|  | **Call companion settings** | コンパニオンの呼び出しの組み込み SMS 機能を呼び出せる |
|                             | **Send Call Companion SMS**     | Call Companion SMSを送信する設定です                                                                                        |
| **Parameter**               | **Display name**                | パラメータの表示名                                                                                             |
|                             | **Entity type**                 | パラメータのエンティティタイプを指定                                                                                  |
|                             | **Description**                 | パラメータの説明                                                                                              |
|                             | **Required**                    | パラメータが必須かどうかを指定します                                                                                       |
|                             | **Is list**                     | パラメータがリスト（複数の値を持つ）かどうかを指定します                                                                     |
|                             | **Redact in log**               | ログに記録される際にパラメータの値をマスクするかどうかを設定します                                                         |
|                             | **Convert phonetic alphabets** | 音声入力の際に音声アルファベットを変換するかどうかの実験的な設定                                                     |
|  | **Reprompt event handlers**           | パラメータ取得失敗した後にエンドユーザーに再度プロンプトするために使用されるイベントハンドラを追加できる           |
|            | **DTMF settings**                 | DTMF（dual tone multi frequency）を受け付けるかどうかを設定でき、有効化した場合ユーザーは電話のキーパッドを使用して入力を行うことができる                                  |
| **Route**    | **Description**             | ルートの説明、特定のインテントや条件が満たされたときにどのようなアクションが取られるかを説明します          |
|              | **Intent**                  | このルートが反応するインテント、ユーザーからの特定の発言や意図に基づいてアクションがトリガーされます        |
|              | **Condition**               | ルートがトリガーされる条件                                        |
|              |                             | - **Match AT LEAST ONE rule (OR)**: 一つ以上のルールにマッチする場合にアクションをトリガーします    |
|              |                             | - **Match EVERY rule (AND)**: すべてのルールにマッチする場合にのみアクションをトリガーします       |
|              |                             | - **Customize expression**: カスタム式を使用して条件を指定します                            |
|              | **Fulfillment**             | ルートがトリガーされたときに実行されるアクション、詳細の設定項目は他Fulfillment画面と同じ   |
|              | **Transition**              | ルートによってトリガーされるページまたはフローへの遷移                   |
|              |                             | - **Flow**: 特定のフローに遷移します                                                 |
|              |                             | - **Page**: 特定のページに遷移します                                                   |
|  **Add state handler(State Handler)**             | **Route groups**                            | ルートを再利用可能にするために定義したRoute                                                   |
|             | **Event handlers**                            | エンドユーザー入力がどのインテントとも一致しない場合や会話以外で何かが起こったときに呼び出すカスタムイベントを定義できる                                                   |
|             | **Data stores**                            | データからエンドユーザーの質問に対する答えを見つけるために使われる設定                                                 |

### 👉 Pagesの作成

今回の天気予報チャットボットでは以下の設定をしていきます。
　- `Display name`
　- `Entry fulfillment`
　- `Routes`
具体的には、`WeatherForecast`のインテントに基づいたユーザーの質問に対して、`Webhook`で天気予報APIでGETリクエストし、その結果の一部で応答をするようにします。

1. **Display nameの設定**: Pageの識別名として、`Weather Forecast Page`を設定します。
2. **Entry fulfillmentの設定**: ユーザーがこのページに最初に到達した際に表示されるメッセージです。今回のシナリオではオプショナルですが以下を`Entry fulfillment`👉`Agent responses`👉`Agent says`にAddします。
   code///
   こんにちは！
   天気予報チャットボットです。
   今日の天気、特定の日付の天気、特定の場所の天気を尋ねてください。

3. **Routesの設定**: `WeatherForecast`インテントを検出した場合に実行されるアクションを定義します。
   1. `Start Page`の設定
      - `Routes`を選択し`Add route`でRouteを追加する。
      - `Intent`にデフォルトで作成されている`Default Welcome Intent`を選択する。
      - `Transition`でPageの`Weather Forecast Page`を選択する。
   2. `Weather Forecast Page`の設定
      a. **Intentの指定**: `WeatherForecast`インテントを選択します。
      b. **Fulfillmentの設定**: 
         - `Webhook settings`
         - `Enable webhook`を選択します。
         - `Create webhook`を押してWebhook作成画面へ遷移します。
         - 以下パラメータに設定します。※記載ないものはデフォルトでOKです
            - Display name: Get Weather Forecast
            - Webhook URL: https://weather.tsukumijima.net/api/forecast/city/130010
            - Subtype: Flexible
            - Method: Get
            - Response configuration: 
               - Parameter name: Forecast
               - Field path: description.text
         - 作成出来たら先ほどのFulfillment画面に戻って`Tag`を設定します。
         - `Agent responses`
         - Agentの応答として表示するメッセージを設定します。今回はAPIリクエストの応答を使ってユーザーに回答したいので`Agent says`セクションに以下をAddします。
      code///
      以下が天気予報です！
      $session.params.Forecast

      c. **Transitionの設定**: 会話のフローをどのように進めるかを決定します。選択肢としては特定の`Page`への遷移やフローまたはセッションの終了があります。今回は`End Session`を選択して、会話を終了させるようにします。

APIは以下を使用しています。
https://weather.tsukumijima.net/api/forecast/city/130010
URL末尾の`130010`は東京のコードです。
DialogflowcxのデフォルトのWebhook機能とAPI側の仕様の関係で日付と場所を使ったクエリができず毎回東京のAPI実行日当日の応答が来ます。

### 👉 Test Agentでのテスト

Dialogflow CXで設定したチャットボットをテストするには、Dialogflow CXコンソール内のTest Agentツールを使用します。
実際にユーザーがチャットボットに対して行うであろう会話を模擬し、設定したフローが期待通りに機能するか確認できます。

1. **Test Agentの開始**: Dialogflow CXコンソールの右上にある「Test Agent」ボタンをクリックして、テストウィンドウを開きます。
2. **ユーザーの発言の入力**:
   - テストウィンドウで今回作成したFlow: `Wheather Forecast Flow` を選択します
   - テキスト入力フィールドに、「こんにちは！」と入力します
   - ~ (`Start Page`から`Weather Forecast Page`へ遷移する) ~
   - テキスト入力フィールドに、「今日の天気は？」と入力します
   - ~ (Webhookでリクエストしたレスポンスが応答として返ってきます)
3. **応答とフローの確認**: 応答には`以下が天気予報です！`に続いて、Webhookから取得した天気予報のテキスト（`$session.params.Forecast`によって参照される）が含まれているはずです。
4. **遷移とセッションの終了の確認**: チャットボットが応答後、会話が`End Session`によって適切に終了しているかを確認します。再度チャット送ってみて`Start Page`に遷移してたら問題ないです！

5. **問題がある場合のトラブルシューティング**:
   - 期待した応答が得られない場合は、インテントの設定、エンティティの抽出、Webhookの設定などを再確認してください。
   - WebhookのURL、リクエストメソッド（GET）、パラメータの設定が正しいか、またはCloud Functions内のコードで正しく外部APIからデータを取得し、適切なレスポンスを生成しているかを確認します。

