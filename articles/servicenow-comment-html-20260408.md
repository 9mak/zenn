---
title: "ServiceNowのコメントでHTMLを送信する方法"
emoji: "💬"
type: "tech"
topics: ["servicenow", "html", "javascript", "restapi"]
published: true
publication_name: "ap_com"
published_at: "2026-04-08 12:00"
---

## 🚀 はじめに

[おぐま](https://github.com/9mak)です。

ServiceNowのWork NotesやAdditional CommentsにHTMLを埋め込んで、太字・リスト・テーブルなどリッチな表示にする方法を紹介します。GlideRecordによるサーバーサイドスクリプトとREST API（Table API）の両方のやり方をまとめました。

:::message
所要時間: 約15分
前提知識: ServiceNowの基本操作、JavaScriptの基礎
:::

## 🛠 準備

| 項目 | 内容 |
| --- | --- |
| ServiceNowインスタンス | 管理者権限推奨 |
| 対象テーブル | incident、sc_req_item など journal フィールドを持つもの |
| システムプロパティ | `glide.ui.security.allow_codetag` が `true` であること |

まず、インスタンスの設定を確認します。フィルターナビゲータで `sys_properties.list` を開き、`glide.ui.security.allow_codetag` を検索してください。値が `true` になっていれば準備OKです。

:::message alert
`glide.ui.security.allow_codetag` はデフォルトで `true` ですが、セキュリティハードニングが適用されたインスタンスでは `false` になっている場合があります。その場合はこの方法は使えません。
:::

## 👀 実際にやってみる

### HTMLを埋め込む仕組み：`[code]` タグ

journal フィールド（Work Notes / Additional Comments）は通常、`<` や `>` を自動的にエスケープするため、HTMLタグとして認識されません。`[code]...[/code]` で囲むことでこのエスケープをバイパスして、HTMLとして描画されます。

```
[code]<strong>これは太字</strong>[/code]
```

対応しているHTMLタグの例は以下のとおりです。

| タグ | 用途 |
| --- | --- |
| `<strong>`, `<b>` | 太字 |
| `<em>`, `<i>` | 斜体 |
| `<h3>` など | 見出し |
| `<ul>`, `<ol>`, `<li>` | リスト |
| `<a href="">` | リンク |
| `<pre>`, `<code>` | コードブロック |
| `<table>`, `<tr>`, `<td>` | 表 |

スタイルはServiceNow側のCSSに依存するため、インラインスタイルが無視されることがあります。

実際に Work Notes に入力した状態がこちら。`[code]` タグごとそのまま書きます。

![Work NotesにHTMLを入力した状態](/images/servicenow-worknotes-input.png)

---

### GlideRecordで書き込む（サーバーサイドスクリプト）

Business RuleやScript Includeなどサーバーサイドから書き込む場合はこちらです。

```javascript:Business Rule / Background Script
var gr = new GlideRecord('incident');
gr.get('sys_id', 'ターゲットレコードのsys_id');

// Work Notes（エージェントのみ見える）
gr.work_notes = '[code]<h3>対応内容</h3><ul><li>設定変更: 完了</li><li>テスト: 確認済み</li></ul>[/code]';

// Additional Comments（顧客にも見える）
gr.comments = '[code]<strong>対応が完了しました。</strong><br/>詳細は添付ファイルをご確認ください。[/code]';

gr.update();
```

`setValue()` ではなく直接代入の方が journal フィールドには確実です。複数の `[code]` ブロックを混在させることもできます。

```javascript
gr.work_notes = '通常のテキスト [code]<strong>強調部分</strong>[/code] また通常のテキスト';
```

---

### REST API（Table API）で書き込む

外部システムや自動化フローから書き込む場合は Table API を使います。

```
PATCH https://{instance}.service-now.com/api/now/table/incident/{sys_id}
Content-Type: application/json
Authorization: Basic ... または Bearer token
```

```json
{
  "work_notes": "[code]<h3>対応完了</h3><ul><li>設定変更: 完了</li><li>テスト: 確認済み</li></ul>[/code]"
}
```

顧客向けコメントを送る場合は `comments` フィールドを使います。

```json
{
  "comments": "[code]<strong>お問い合わせありがとうございます。</strong><br/>ご確認の上、ご返信ください。[/code]"
}
```

:::details Work Notesを読み取る場合
Work NotesはREST APIで通常のフィールドとして取得できません。`sys_journal_field` テーブルに別途格納されているため、以下のように取得します。

```
GET https://{instance}.service-now.com/api/now/table/sys_journal_field
    ?sysparm_query=element=work_notes^element_id={sys_id}
    &sysparm_fields=value,sys_created_on,sys_created_by
```
:::

## ✅ 動作確認

1. 対象レコードを開き、Work NotesまたはAdditional Commentsを確認する
2. HTMLタグが描画されていれば成功
3. タグがそのまま文字列として表示される場合は `glide.ui.security.allow_codetag` の値を確認する

Postした後、Activitiesセクションに以下のようにHTMLがレンダリングされて表示されます。

![HTMLがレンダリングされたWork Notes](/images/servicenow-worknotes-rendered.png)

## 🎯 まとめ

- journal フィールドへのHTML埋め込みは `[code]...[/code]` タグで囲むだけ
- GlideRecordでもREST API（Table API）でも同じ記法が使える
- `glide.ui.security.allow_codetag = true` が前提条件
- セキュリティハードニング済みのインスタンスでは使えないケースがある


## 📚 参考

- [Render journal field entries as HTML（公式ドキュメント）](https://docs.servicenow.com/en-US/bundle/vancouver-platform-administration/page/administer/field-administration/task/render-journal-field-entries-as-html.html)
- [Restrict the CODE tag in journal fields（公式ドキュメント・Xanadu版）](https://www.servicenow.com/docs/bundle/xanadu-platform-administration/page/administer/field-administration/task/t_RestrictTheCODETagInJrnalFlds.html)
- [HTML sanitizer（公式ドキュメント・Utah版）](https://docs.servicenow.com/en-US/bundle/utah-platform-security/page/administer/security/concept/c_HTMLSanitizer.html)
- [Formatting within Journal fields using HTML & code（Community Blog）](https://www.servicenow.com/community/in-other-news/formatting-within-journal-fields-using-html-code/ba-p/2286203)
- [ServiceNow Table API: Working With Comments and Work Notes（Tim Dietrich）](https://timdietrich.me/blog/servicenow-table-api-comments-work-notes/)
