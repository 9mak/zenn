---
title: "ServiceNow PDI構築ガイド【2026年Zurich版】"
emoji: "🏗️"
type: "tech"
topics: ["servicenow", "pdi", "初心者", "環境構築", "zurich"]
published: true
publication_name: "ap_com"
published_at: 2026-03-26 12:00
---

## 🚀 はじめに

[おぐま](https://github.com/9mak)です。

ServiceNowの学習や開発をはじめるには、まず自分専用の開発環境「PDI（Personal Developer Instance）」を手に入れる必要があります。
この記事では、2026年3月時点の手順を実際の画面を見ながら解説します。

:::message
所要時間: 約10〜15分（インスタンス起動まで）
前提知識: 特になし。ブラウザとメールアドレスがあればOK
:::

## PDIってなに？

PDIはServiceNow社が開発者向けに無料提供している、個人用のServiceNow環境です。

- 本番環境に触れずに自由に開発・実験できる
- 認定試験の学習にも使える
- 1アカウントにつき1つまで

## 実際にやってみる

### Step 1: アカウント作成 → サインイン

[developer.servicenow.com](https://developer.servicenow.com) にアクセスして、右上の「Sign In」をクリック。

アカウントがない場合は「新しいユーザー？ ServiceNow ID を取得する」から登録できます。

ログインすると右上に **「Request instance」** ボタンが表示されます。

![ログイン後のダッシュボード](/images/servicenow-pdi-setup-guide-20260322/01-dashboard.png)

### Step 2: インスタンスを申請する

「Request instance」をクリックすると、バージョン選択ダイアログが開きます。

![Request an Instanceダイアログ](/images/servicenow-pdi-setup-guide-20260322/02-request-dialog.png)

2026年3月時点では以下のバージョンが選べます：

| バージョン | 状況 |
| --- | --- |
| Australia | Latest release（**NO INSTANCES AVAILABLE**） |
| **Zurich** | **取得推奨・Build Agent対応** |
| Yokohama | 前世代 |
| Xanadu | 2世代前 |

:::message alert
Australiaが「Latest release」と表示されていますが、2026年3月時点では「NO INSTANCES AVAILABLE」で取得できません。**Zurichを選びましょう。**
:::

画面下部に「Build Agent is currently available on Zurich instances.」と表示されているとおり、Zurichを選ぶのが現時点のベストです。

**Zurichを選択すると「Request」ボタンが緑になります。**

![Zurich選択後](/images/servicenow-pdi-setup-guide-20260322/03-zurich-selected.png)

「Request」を押して次へ。

### Step 3: セットアップを待つ

リクエスト後は右上に「Setting up instance...」と表示されて、インスタンスが作られます。

![Setting up instance...](/images/servicenow-pdi-setup-guide-20260322/04-setting-up.png)

数分待つと完了します。

### Step 4: 完了を確認する

セットアップが終わると、右上のボタンが「Manage my instance」に変わり、ポップアップが表示されます。

![完了ポップアップ](/images/servicenow-pdi-setup-guide-20260322/05-ready.png)

「Manage my instance」をクリックすると、インスタンスの詳細が確認できます。

![Manage my instanceページ](/images/servicenow-pdi-setup-guide-20260322/06-manage-instance.png)

ここで確認できる情報：

| 項目 | 内容 |
| --- | --- |
| Status | Online（起動中） |
| Instance URL | `https://dev******.service-now.com/` |
| User name | admin |
| Current password | （表示して確認） |
| User role | Admin |

Build Agent・ServiceNow Studio・App engine studioがすべて **✓ Installed** になっているのも確認できます。

### Step 5: PDIにログインする

Instance URLをクリックするとPDIに入れます。初回は「Work your way」というチュートリアル（6ステップ）が表示されます。スキップして構いません。

![PDI内部の初回チュートリアル](/images/servicenow-pdi-setup-guide-20260322/07-pdi-inside.png)

## ⚠️ 知っておくべき休眠ルール

PDIには2種類の「止まる」があります。この違いを知らないとデータが消えて焦ります。

| 種別 | 条件 | データ | インスタンス |
| --- | --- | --- | --- |
| **Hibernation（休眠）** | 6時間操作なし | 保持される | そのまま使える |
| **Reclaim（回収）** | 10日間開発作業なし | 失われる | **回収され、再申請が必要** |

**ログインしてレコードを見たりデータを入力するだけでは「活動あり」とみなされません。** スクリプトや設定の変更など、**Update Setに記録される操作**が必要です。

Reclaimカウンターをリセットする操作の例：

- スクリプト（Script Include・Business Rule）を編集する
- テーブルやフィールドを作成・変更する
- アプリケーションを作成する

逆にリセットされない操作：インシデント作成・データ入力など

週に1回、何かしら設定を触る習慣をつけておくと安心です。

## 🎯 まとめ

- [developer.servicenow.com](https://developer.servicenow.com) でアカウント作成 → Request instance でPDI取得
- 2026年3月時点は **Zurich** を選ぶ（Australiaは取得不可）
- 完了後は「Manage my instance」ページでURL・パスワードを確認
- Reclaimに注意。10日間開発作業がないとインスタンスが回収され、再申請が必要になる

次は取得したPDIで何を作るかですね。
Flow DesignerやBusiness Ruleなど、触ってみたい機能から試してみてください。

## 📎 参考

https://developer.servicenow.com

https://nowlearning.servicenow.com
