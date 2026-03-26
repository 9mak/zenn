---
title: "ServiceNowのライセンス体系をちゃんと理解する"
emoji: "🪪"
type: "tech"
topics: ["servicenow", "itsm", "license", "saas", "enterprise"]
published: true
publication_name: "ap_com"
published_at: "2026-03-25 12:00"
---

## ✍️ はじめに

[おぐま](https://github.com/9mak)です。

ServiceNowを使っていると「このユーザーどのライセンスにすればいいの？」「なんでこんなにお金かかるの？」ってなりがち。

ライセンスの仕組みがけっこうクセあるので、ざっくり整理してみます。

:::message
この記事の情報は2026年3月時点のものです。変更される場合があるので、最新情報は公式または担当営業に確認してください。
:::

## 🛠️ 準備

先に用語だけ押さえておくとスムーズです。

| 用語 | 意味 |
| --- | --- |
| Fulfiller | チケットを実際に処理する人 |
| Requester | 申請・依頼する人 |
| Business Stakeholder（Approver） | 承認する人 |
| Unrestricted User | ロール関係なくアクティブユーザー全員が課金対象になるモデル |
| Assist | Now Assist（AI機能）の消費単位 |

## 👨‍🔧 ライセンスの全体像

ServiceNowのライセンスは大きく3種類あります。

---

### ロールベース（Role-Based）

ITSM・CSM・GRC・SPMなどの主要製品が該当していて、ユーザーのロールに応じて課金されます。

| ロール | できること | 費用 |
| --- | --- | --- |
| **Fulfiller（ITIL）** | チケット作成・更新・解決・削除など全操作 | 最も高い |
| **Business Stakeholder（Approver）** | 申請の承認・却下、レポート閲覧 | 有償（Fulfillerより安い） |
| **Requester（End User）** | 自分の申請の登録・追跡、ナレッジ閲覧 | **無料** |

**Requesterは無料**なのがポイントで、一般社員がポータルから申請するだけなら課金は発生しません。お金がかかるのはサービスデスクのエージェントや開発者などFulfillerがほとんどです。

:::message
**Fulfillerの課金カウントについて**
アクティブかつ過去365日以内にログインしたユーザーが対象になります。ただ契約によって違うこともあるので、詳しくは担当営業に確認するのが確実です。退職者などの放置アカウントはこまめに整理しておくと節約になるので、ここは地味に大事です。
:::

---

### Unrestricted（全員が課金対象）

HRSD・Employee Center Proなど一部の製品で使われている課金方式です。

ロールベースとの違いは**ロールに関係なく、インスタンス上のアクティブユーザー全員がそのまま課金対象になる**という点。

1万人規模の会社でHRSDを入れた場合、ITSMならサービスデスク担当者100人分だけ払えばいいところが、Unrestrictedだと全社員1万人分の請求になります。なかなかしんどい。

:::message alert
**ITSMとHRSDを併用するときの落とし穴**

「ITSMだけ使ってるつもり」でも、同じインスタンスにHRSDのようなUnrestricted製品を入れていると、全社員分のアクティブユーザーがそちらで課金されます。ITSMは100人分しか払ってないのに、気づいたらHRSDで全社員分の請求が来ていた、というパターンが起こりえます。

Unrestricted製品を導入するときは「このインスタンスに何人アクティブユーザーがいるか」を事前に確認しておきましょう。
:::

ロールがなくても「アクティブ」な状態なら全員が対象なので、退職者や使ってないアカウントを放置しているとじわじわ請求が増えます。

---

### 使った分だけ課金（Consumption-Based）

ITAM（SAM Pro / HAM Pro）、ITOM、IRM、RPA、Now Assistなどが対象で、ユーザー数じゃなく実際の使用量に応じて課金されます。

| 製品 | 何を数えるか |
| --- | --- |
| ITOM | 管理対象のサーバー・デバイス数 |
| SAM Pro | 管理対象ソフトウェアのインストール数 |
| Now Assist | Assist（AI操作1回ごとに消費） |
| Integration Hub | API呼び出し数 |

Now AssistはAI機能を使うたびにAssistが減っていく仕組みで、使い方が広がるほど請求額が読みにくくなるのがちょっと怖いところ。

---

## 🎯 製品・エディション・モジュールの関係

ここがコスト面で一番混乱しやすいところです。

### 製品ごとに別の契約・別の請求

ITSMを持っていてもITOMを追加するには別途ライセンスが必要で、費用もまとめてくれるわけじゃないです。

```
ITSM（ロールベース） → 別契約・別請求
ITOM（使用量課金）  → さらに別契約・別請求
CSM（ロールベース） → さらに別契約・別請求
```

製品を増やすほど請求も増えるシンプルな構造になってます。

### Standard / Professional / Enterprise はITSMの中のランク

各製品にはエディションがあって、上に行くほど機能が増えて価格も上がります。

| エディション | 主な特徴 |
| --- | --- |
| **Standard** | インシデント管理・変更管理・問題管理など基本機能 |
| **Professional** | 高度な自動化・AI連携などが追加 |
| **Enterprise** | フル機能 |

Now AssistなどのAI機能を使いたい場合、まずProかEnterprise以上に上げて、さらにAssistのアドオンライセンスを別途買う形になります。「AI使いたいだけなのに二段階お金がかかる」という構造で、ちょっとしんどいです。

---

## 🕸️ つまづきポイント

**価格は公開されていない**

ServiceNowは価格を公表していないので、見積もりは担当営業に問い合わせる形になります。組織規模・地域・使うアプリ・契約期間によって変わるので比較検討がしにくいのが正直なところ。

:::message alert
契約は3年が基本で、途中でライセンス数を下げるのが難しいケースがあります。
:::

**Now AssistのAssistは上限がない**

ユーザー数と違ってAssistには自然な上限がないので、社内でAI機能の利用が広がると月の請求がいきなり跳ね上がることがあるので注意が必要です。

## 🚀 まとめ

- **ロールベース**（ITSM等）: Fulfiller（ITIL） / Business Stakeholder（Approver） / Requester（無料）の3段階
- **Unrestricted**（HRSD等）: アクティブユーザー全員が課金対象。アカウント管理がそのままコスト管理になる
- **使用量課金**（ITOM・Now Assist等）: 使った分だけ請求。特にNow Assistは跳ねやすい
- **製品は別々に請求**: ITSMとITOMは独立した契約・コスト
- **Standard / Pro / Enterprise**: 各製品内のエディション。AI機能はPro以上＋アドオンが必要

コストを抑えるなら「Fulfillerが本当に必要な人だけにFulfillerを割り当てる」を徹底するのが一番手っ取り早いです。

---

### 参考

- [Understanding ServiceNow Licensing Model - ServiceNow Community](https://www.servicenow.com/community/in-other-news/understanding-servicenow-licensing-model/ba-p/3318264)
- [Here's Everything I Know About ServiceNow Licensing - ServiceNow Community](https://www.servicenow.com/community/servicenow-ai-platform-articles/here-s-everything-i-know-about-servicenow-licensing/ta-p/3512215)
- [ServiceNow License Management Help - ServiceNow Community](https://www.servicenow.com/community/itsm-forum/servicenow-license-management-help/td-p/804381)
