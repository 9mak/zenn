---
title: "Fragment の使い分け：React.Fragment と Fragment はどちらを使うべきか？"
emoji: "🚀"
type: "tech"
topics: ["React", "JSX", "Fragment", "key"]
published: true
publication_name: "ap_com"
published_at: 2025-04-23 12:00
---

## 🌟 はじめに

[おぐま](https://github.com/9mak)です。
React のコンポーネントで複数要素を返すとき、不要な DOM ノードが生成されないように「Fragment」を利用します。
今回は通常の `<React.Fragment> ... </React.Fragment>` と、 `<Fragment> ... </Fragment>` の違い、また key 属性との組み合わせについて詳しく解説します。

## 📝 Fragment と key の組み合わせ

React では複数要素をラップするために Fragment を使用しますが、ループ処理などでグループごとに一意の識別子が必要な場合、key 属性を渡す必要があります。
ショートハンド記法（`<> ... </>`）はとてもシンプルですが、key を含む属性が設定できないため**key を利用する場合は必ずフルシンタックスが必要**です。

例えば、次のコードはリスト内で複数の要素をグループ化する際の Fragment の正しい使い方です。

```jsx
import React from 'react';

function ItemList({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <React.Fragment key={item.id}>
          <li>{item.title}</li>
          <li>{item.description}</li>
        </React.Fragment>
      ))}
    </ul>
  );
}
```

この場合、`<React.Fragment>` に key 属性を付与することで、React が各グループ（ここでは `<li>` のセット）を正しく識別でき、効率的な差分更新を実現します。

## 🤔 `<React.Fragment>` と `<Fragment>` の違い

### フルシンタックス vs. インポートして使う記法

React では、まず次のように Fragment をインポートしてから使用する方法が可能です。

```jsx
import { Fragment } from 'react';

function Example() {
  return (
    <Fragment>
      <h1>Hello</h1>
      <p>World!</p>
    </Fragment>
  );
}
```

この場合、記述は `<Fragment> ... </Fragment>` となり機能的には `<React.Fragment> ... </React.Fragment>` と全く同じです。
どちらも内部では同じコンポーネントを参照しています。

### ショートハンド記法との使い分け

- **ショートハンド (`<> ... </>`)**
  - 非常に簡潔でコードが見やすい
  - key や他の属性を渡すことはできないため、シンプルな用途に限定される

- **フルシンタックス (`<React.Fragment> ... </React.Fragment>` または `<Fragment> ... </Fragment>`)**
  - key などの属性を設定可能
  - インポートして `<Fragment>` とだけ記述する場合も、機能面に違いはなく最新の書き方として利用可能

つまり、特別な属性（たとえば key）が必要なケースではショートハンドではなくフルシンタックスで記述する必要があります。
また、`<React.Fragment>` と書くか`import { Fragment } from 'react';` して `<Fragment>` とだけ書くかは好みの問題であり、どちらも現在の React で推奨される標準的な記法です。

## 🤔 考察

- **使い分けのポイント**
  ・属性（key など）が必要な場合はショートハンド (`<> ... </>`) は使えず、フルシンタックスが必須です。
  ・`<React.Fragment>` と `<Fragment>` の両記法は、どちらも最新の React に対応しておりどちらを使っても問題ありません。
- **パフォーマンスと保守性**
  Fragment を利用することで、余計な DOM ノードを生成せずに済みコンポーネントの再レンダリングに必要な差分検出が効率的に行われます。
- **記述の簡潔さ**
  インポートして `<Fragment>` と記述する方法はよりシンプルでコードの可読性を向上させる傾向がありますが、プロジェクトのスタイルに合わせてどちらを使っても良いでしょう。

## 🎉 まとめ

React で複数要素をグループ化する際、余計な DOM ノードの生成を防ぐための Fragment は非常に有用です。

Fragment に key 属性を渡す必要がある場合は、ショートハンド記法は使用できません。
結局`<React.Fragment>` と `<Fragment>`のどちらを使うかは、プロジェクトのコーディングスタイルや好みに合わせて行くのがよさそうです。
