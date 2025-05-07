---
title: "CSSのベストプラクティスを勉強した話"
emoji: "📖"
type: "tech"
topics: ["CSS", "フロントエンド", "設計", "ベストプラクティス"]
published: false
publication_name: "ap_com"
published_at: 2025-05-07 12:00
---

## 🌟 はじめに

[おぐま](https://github.com/9mak)です。
Cursorを使いこなせないままWebサイト作ったら表は動くものの裏側はかなり残念な形になりました。
これから修正するにあたってCSSのベストプラクティスと主要な設計手法について調べたのでまとめます。

CSSは一見シンプルですが、規模が大きくなるにつれて管理が難しくなりがちです。
適切な設計手法を採用することで、保守性が高く拡張性のあるCSSを書くことができるようになります(自戒)

## 👷‍♂️ 事前準備

この記事を理解するためには、基本的なHTML/CSSの知識が必要です。

## 📖 ステップバイステップ

### 👉 ステップ1: CSSの基本的なベストプラクティスを理解する

CSSを効率的に管理するためには、いくつかの基本的なベストプラクティスを押さえておくことが重要です。

1. **スタイルシートを整理する**: 役割ごとにCSSファイルを分割し、管理しやすくします（例：`base.css`, `layout.css`, `components.css`）。

2. **スタイルの適切な定義場所**:
   - **推奨**: 外部CSSファイル（`.css`）を使用する - メンテナンス性とキャッシュの効率性が高い
   - **避けるべき**: インラインスタイル（`style=""`属性）- 再利用性がなく、メンテナンスが困難
   - **限定的に使用**: `<style>`タグ - 特定のページに固有のスタイルのみに使用

3. **スタイルシートの圧縮**: 本番環境ではCSSファイルを圧縮して配信します。

   ```bash
   # npm経由でcssminを使用する例
   $ npm install cssmin -g
   $ cssmin input.css > output.min.css
   
   # または、Gulpやwebpackなどのビルドツールを使用
   # webpack.config.js の例
   module.exports = {
     optimization: {
       minimize: true
     }
   };
   ```

4. **命名規則を統一する**: チーム内でクラス名の命名規則を統一することで可読性を向上させます。

```css
/* 悪い例 */
.header { background: #333; }
.MENU_NAV { margin-top: 20px; }
.btn1 { background: blue; }
.btn2 { background: red; }

/* 良い例 */
.header { background: #333; }
.header-nav { margin-top: 20px; }
.btn { /* 共通のボタンスタイル */ }
.btn--primary { background: blue; }
.btn--danger { background: red; }
```

:::details コードの説明

- 悪い例では、大文字小文字が混在し、連番によるクラス名（btn1, btn2）を使用しており、スタイルの目的が不明確です。
- 良い例では、一貫した命名規則（ハイフン区切り）を使用し、ボタンの基本スタイルを共通化した上で、目的に応じた修飾クラスを追加しています。これにより、コードの再利用性と可読性が向上します。

:::

5. **セレクタの詳細度を意識する**: 過度に詳細なセレクタは避け、必要最小限の詳細度に留めます。

```css
/* 悪い例 - 詳細度が高すぎる */
body .content article section h2.title { color: blue; }

/* 良い例 - 必要最小限の詳細度 */
.article-title { color: blue; }
```

6. **コメントを適切に活用する**: 複雑な部分や重要な決定事項には、わかりやすいコメントを残しましょう。

```css
/* ヘッダーエリア */
.header { /* スタイル */ }

/* 
 * レスポンシブナビゲーション
 * 768px以下でハンバーガーメニューに切り替わります
 */
.nav { /* スタイル */ }
```

### 👉 ステップ2: 主要なCSS設計手法を理解する

CSSの設計手法には様々なものがありますが、主要なものは以下の5つです。
それぞれの特徴を理解し、プロジェクトに適した手法を選択しましょう。

#### BEM (Block, Element, Modifier)

BEMは、Block（ブロック）、Element（要素）、Modifier（修飾子）の3つの概念に基づいた命名規則です。

```html
<div class="card">
  <h2 class="card__title">タイトル</h2>
  <p class="card__text card__text--highlighted">ハイライトされたテキスト</p>
</div>
```

```css
.card { /* ブロックのスタイル */ }
.card__title { /* 要素のスタイル */ }
.card__text { /* 要素のスタイル */ }
.card__text--highlighted { /* 修飾されたスタイル */ }
```

BEMの主な目的は以下の3点です：

1. 長期間メンテナンスできる設計
2. チームのスケーラビリティ
3. コードの再利用性

#### FLOCSS (Foundation, Layout, Object CSS)

FLOCSSは日本人が提唱したCSS設計手法で、サイトを構成要素ごとにレイヤー分けする方法です。

FLOCSSは大きく3つのレイヤーに分かれています：

1. **Foundation**: リセットCSSや変数など、サイト全体の基礎となるスタイル
2. **Layout**: ヘッダーやフッターなど、サイトの大枠となるレイアウト部分
3. **Object**: 再利用可能なコンポーネントや特定のプロジェクト向けのスタイル

Objectレイヤーはさらに3つに分かれます：

- **Component**: ボタンや見出しなど、再利用可能な最小単位のパーツ
- **Project**: 特定のプロジェクトに固有のスタイル
- **Utility**: 微調整のための小さなスタイル

```scss
// Foundation
@import "foundation/reset";
@import "foundation/base";

// Layout
@import "layout/header";
@import "layout/footer";

// Object/Component
@import "object/component/button";
@import "object/component/heading";

// Object/Project
@import "object/project/top";
@import "object/project/news";

// Object/Utility
@import "object/utility/margin";
@import "object/utility/text";
```

#### OOCSS (Object Oriented CSS)

OOCSSはオブジェクト指向の考え方をCSSに適用した設計手法です。主な原則は次の2つです：

1. **構造と見た目を分離する**: コンテンツの構造とデザインを別々のクラスで定義します
2. **コンテナとコンテンツを分離する**: 親要素に依存しない再利用可能なスタイルを作ります

```html
<!-- 構造と見た目の分離 -->
<button class="btn btn-primary">送信</button>
<button class="btn btn-secondary">キャンセル</button>
```

```css
/* 構造 (btn) */
.btn {
  padding: 10px 15px;
  border-radius: 4px;
  font-weight: bold;
}

/* 見た目 (btn-primary, btn-secondary) */
.btn-primary {
  background-color: blue;
  color: white;
}

.btn-secondary {
  background-color: gray;
  color: black;
}
```

#### SMACSS (Scalable and Modular Architecture for CSS)

SMACSSはCSSを5つのカテゴリに分類する設計手法です：

1. **ベース**: 要素の初期スタイル
2. **レイアウト**: サイトの構造を定義
3. **モジュール**: 再利用可能なコンポーネント
4. **状態**: 要素の状態変化を表現
5. **テーマ**: サイトのテーマに関するスタイル

```css
/* ベース */
body, p, h1, h2, h3 { margin: 0; padding: 0; }

/* レイアウト */
.l-header { height: 80px; }
.l-sidebar { width: 250px; float: left; }

/* モジュール */
.btn { /* ボタンのスタイル */ }
.card { /* カードのスタイル */ }

/* 状態 */
.is-active { /* アクティブ状態 */ }
.is-hidden { /* 非表示状態 */ }

/* テーマ */
.theme-dark .btn { /* ダークテーマのボタン */ }
```

#### MCSS (Multilayer CSS)

MCSSはモジュールをレイヤーごとに分離する設計手法です。5つのレイヤーで構成されています：

1. **Foundation**: リセットCSSなど
2. **Base**: 再利用可能な抽象的なモジュール
3. **Project**: プロジェクト固有のモジュール
4. **Cosmetic**: 色やマージンなどの微調整
5. **Context**: ブラウザやデバイス別の対応

```css
/* Foundation */
@import "reset.css";

/* Base */
.module { /* ベースモジュール */ }
.module_list { /* モジュールの子要素 */ }

/* Project */
.project-module { /* プロジェクト固有のモジュール */ }

/* Cosmetic */
.color_red { color: red; }
.margin-t_L { margin-top: 30px; }

/* Context */
.ie9 .module { /* IE9向けの対応 */ }
@media screen and (max-width: 980px) { /* レスポンシブ対応 */ }
```

## 💡 ヒントとトラブルシューティング

CSSの設計において、よくある問題とその解決策を紹介します。

:::message alert
よくある問題：CSSの肥大化と管理の難しさ

解決策：

1. CSSプリプロセッサ（Sass, Lessなど）を活用して変数やミックスインを使用する
2. リファクタリングを定期的に行い、使われていないCSSを削除する
3. スタイルシートを小さな単位に分割して管理する
:::

### CSS変数を活用する

CSS変数（カスタムプロパティ）を使うと、コードの一貫性と保守性が向上します。

```css
:root {
  --color-primary: #1b65b1;
  --color-secondary: #2287bd;
  --font-size: 16px;
  --line-height: 1.5;
}

.button {
  background-color: var(--color-primary);
  font-size: var(--font-size);
  line-height: var(--line-height);
}
```

### パフォーマンス最適化

CSSのパフォーマンスを向上させるためのヒント：

1. 不要なセレクタを削除する
2. ネストが深すぎるセレクタを避ける
3. CSSファイルを圧縮する
4. Critical CSSを活用する
5. メディアクエリを最適化する

```bash
# CSSの圧縮例（Node.js環境）
$ npm install -g clean-css-cli
$ cleancss -o styles.min.css styles.css
```

## 🎉 まとめ

この記事では、CSSのベストプラクティスと主要な設計手法について学びました。
個人的にBEMが気持ちいいのでBEMしていきます。

---

**参考リンク：**

1. [CSSベストプラクティス14選（初心者向け）｜Kinsta®](https://kinsta.com/jp/blog/css-best-practices/)
2. [CSS設計とは？設計手法はどれがいいのかまとめてみた | ブログ](https://depart-inc.com/blog/css-design/)
3. [BEMによるフロントエンドの設計 | 第1回 基本概念とルール](https://www.codegrid.net/articles/bem-basic-1/)
4. [【付録・CSS設計7】設計手法：SMACSSの紹介【WPテーマ作成】](https://shinoarchive.com/contents/3941/)
5. [【CSS設計】FLOCSS(フロックス)で保守性の高い記述を極める！](https://tane-be.co.jp/knowledge/web-design/2270/)
6. [CSS設計手法の『MCSS』の使い方 | cly7796.net](https://cly7796.net/blog/css/about-mcss/)
