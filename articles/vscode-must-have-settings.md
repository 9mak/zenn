---
title: "VSCodeマスト設定！開発効率を2倍にする厳選設定一覧【完全ガイド】"
emoji: "⚙️"
type: "tech"
topics: ["VSCode", "開発環境", "設定", "開発効率化", "IDE"]
published: true
publication_name: "ap_com"
published_at: 2025-01-22 12:00
---

## 🌟 はじめに

[おぐま](https://github.com/9mak)です。

Visual Studio Code (VSCode)は非常に強力なエディタですが、デフォルト設定のままでは機能を最大限に活用できていません。この記事では、開発効率を大幅に向上させる必須の設定とその設定方法を詳しく解説します。

## ⚙️ 設定画面とsettings.jsonについて

### settings.jsonファイルの場所

**Windows**:

- ユーザー設定: `%APPDATA%\Code\User\settings.json`
- (`C:\Users\ユーザー名\AppData\Roaming\Code\User\settings.json`)

**macOS**:

- ユーザー設定: `~/Library/Application Support/Code/User/settings.json`

**Linux**:

- ユーザー設定: `~/.config/Code/User/settings.json`

**ワークスペース設定**:

- プロジェクトフォルダ直下の `.vscode/settings.json`

### 設定へのアクセス方法

キーボードショートカット：

- Windows/Linux: `Ctrl + ,`
- macOS: `Cmd + ,`

メニューから：

- `ファイル > 基本設定 > 設定`
- または `Code > 基本設定 > 設定`（macOS）

コマンドパレットから：

- `Ctrl/Cmd + Shift + P`を押して`settings`と入力

### 設定方法の種類

**GUIを使用した設定**:

- 視覚的に設定を変更可能
- 設定の説明や選択肢を確認しながら変更できる
- 初心者に推奨

**settings.jsonを直接編集**:

- より細かい制御が可能
- 設定のコピー・ペーストが容易
- バージョン管理がしやすい

:::message
settings.jsonを直接編集する場合、JSONの文法に注意してください。
カンマの位置や括弧の対応関係を間違えると設定が正しく適用されません。
:::

### ユーザー設定とワークスペース設定の違い

**ユーザー設定**:

- すべてのプロジェクトに適用される
- 個人の好みや習慣に基づく設定に最適
- 例: フォントサイズ、カラーテーマ、キーボードショートカット

**ワークスペース設定**:

- 特定のプロジェクトにのみ適用
- チーム開発での共通設定に最適
- プロジェクト固有の要件に対応
- 例: インデントスタイル、リンター設定、フォーマッター設定

:::details ワークスペース設定の優先順位

1. ワークスペース設定
2. ユーザー設定
3. VSCodeのデフォルト設定

:::

## ⚙️ エディタの基本設定

### 1. オートセーブの設定

**目的**: 作業中のファイルを自動的に保存し、手動保存の手間を省く

**GUIでの設定手順**:

1. 設定画面を開く
2. 検索バーに「autosave」と入力
3. `Files: Auto Save`を選択
4. ドロップダウンから`afterDelay`を選択
5. `Files: Auto Save Delay`を`1000`に設定

```json
{
    "files.autoSave": "afterDelay",
    "files.autoSaveDelay": 1000
}
```

**効果**:

- ファイルの変更から1秒後に自動保存
- `Ctrl + S`を押す頻度が減少
- 予期せぬクラッシュ時のファイル損失を防止

### 2. エディタの表示設定

**目的**: コードの視認性とエディタの使い勝手を向上

**GUIでの設定手順**:

1. 設定画面の検索で各項目を検索
2. `Editor > Minimap: Enabled`のチェックを外す
3. `Editor > Render Whitespace`を`boundary`に設定
4. その他の表示設定を好みに応じて調整

```json
{
    "editor.minimap.enabled": false,
    "editor.renderWhitespace": "boundary",
    "editor.guides.bracketPairs": true,
    "editor.lineHeight": 1.5,
    "editor.fontSize": 14,
    "editor.fontFamily": "'Source Code Pro', Consolas, monospace"
}
```

**各設定の効果**:

- `minimap.enabled: false`: 右側のミニマップを非表示にしてスペースを確保
- `renderWhitespace: "boundary"`: スペースやタブを視覚化して意図しない空白を防止
- `guides.bracketPairs: true`: 対応する括弧を線で結んで表示
- `lineHeight: 1.5`: 行間を広げて可読性を向上
- `fontSize: 14`: 適切なフォントサイズを設定
- `fontFamily`: プログラミング用フォントを設定

### 3. インデントとフォーマット設定

**目的**: コードの一貫性と可読性を維持

**設定内容**:

```json
{
    "editor.detectIndentation": true,
    "editor.insertSpaces": true,
    "editor.tabSize": 2,
    "editor.rulers": [80, 120],
    "editor.wordWrap": "on"
}
```

**各設定の効果**:

- `detectIndentation`: プロジェクトのインデントスタイルを自動検出
- `insertSpaces`: タブの代わりにスペースを使用
- `tabSize`: インデントのスペース数
- `rulers`: コード行の長さガイドライン
- `wordWrap`: 長い行を折り返し表示

## 📁 ファイル管理関連の設定

### 1. ファイル除外設定

**目的**: 不要なファイルやフォルダを非表示にしてエクスプローラーをクリーンに保つ

**GUIでの設定手順**:

1. 設定画面で「files exclude」を検索
2. `Files: Exclude`の項目で設定を追加

```json
{
    "files.exclude": {
        "**/.git": true,
        "**/.DS_Store": true,
        "**/node_modules": true,
        "**/.idea": true
    }
}
```

**除外すべきファイル・フォルダと理由**:

- `.git`: Gitの管理ファイル（表示する必要性が低い）
- `.DS_Store`: macOSのシステムファイル（不要）
- `node_modules`: 依存パッケージ（容量が大きく、直接編集しない）
- `.idea`: IDEの設定ファイル（プロジェクトに直接関係なし）

### 2. ファイル検索設定

**目的**: 検索時に不要なファイルを除外し、検索パフォーマンスを向上

```json
{
    "search.exclude": {
        "**/node_modules": true,
        "**/bower_components": true,
        "**/dist": true,
        "**/coverage": true
    }
}
```

**検索除外の効果**:

- 検索速度の向上
- より関連性の高い検索結果
- エディタのパフォーマンス改善

## 🛠️ コーディング支援機能の設定

### 1. インテリセンスの強化

**目的**: コード補完と候補表示の挙動を最適化

```json
{
    "editor.suggestSelection": "first",
    "editor.acceptSuggestionOnEnter": "smart",
    "editor.snippetSuggestions": "top",
    "editor.wordBasedSuggestions": true
}
```

**設定の効果**:

- 関連性の高い候補を優先的に表示
- スニペットを候補の最上位に表示
- 単語ベースの候補表示を有効化

### 2. フォーマット設定

**目的**: コードの自動整形と一貫性の維持

```json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": null,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true,
        "source.organizeImports": true
    }
}
```

**設定手順と効果**:

1. `Editor: Format On Save`を有効化
   - 効果: 保存時に自動的にコードを整形

2. `Editor: Default Formatter`を設定
   - 言語ごとに適切なフォーマッターを選択可能
   - Prettierなどの拡張機能と連携

3. `Editor: Code Actions On Save`
   - ESLintの自動修正
   - importの自動整理

## 🌍 言語固有の設定

**目的**: 各プログラミング言語に適した環境をカスタマイズ

```json
{
    "[python]": {
        "editor.tabSize": 4,
        "editor.formatOnSave": true,
        "editor.defaultFormatter": "ms-python.python"
    },
    "[javascript]": {
        "editor.tabSize": 2,
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[markdown]": {
        "editor.wordWrap": "on",
        "editor.quickSuggestions": {
            "comments": true,
            "strings": true,
            "other": true
        }
    }
}
```

**言語ごとの設定方法**:

1. 設定画面で言語を選択
2. 言語固有の設定を変更
3. または、settings.jsonに直接記述

:::message alert
言語固有の設定は、対応する言語の拡張機能がインストールされている必要があります。
:::

## 🔌 拡張機能との連携設定

**よく使用される拡張機能の設定例**:

```json
{
    // Prettier設定
    "prettier.singleQuote": true,
    "prettier.trailingComma": "es5",
    
    // ESLint設定
    "eslint.validate": [
        "javascript",
        "typescript"
    ],
    
    // GitLens設定
    "gitlens.currentLine.enabled": true,
    "gitlens.hovers.currentLine.over": "line"
}
```

:::message
拡張機能の設定は、各拡張機能のドキュメントを参照することをお勧めします。
:::

## ⚡ パフォーマンス最適化設定

**目的**: VSCodeの動作を軽快に保つ

```json
{
    "files.watcherExclude": {
        "**/.git/objects/**": true,
        "**/node_modules/**": true,
        "**/tmp/**": true
    },
    "editor.accessibilitySupport": "off",
    "editor.smoothScrolling": false
}
```

**最適化のポイント**:

1. ファイルウォッチャーの除外設定
   - 大きなフォルダを監視対象から除外
   - メモリ使用量の削減

2. 不要な機能の無効化
   - アクセシビリティサポート
   - スムーズスクロール

## ⚠️ アクセシビリティに関する注意

以下の設定は、アクセシビリティ機能を必要とするユーザーは無効化しないでください：

```json
{
    "editor.accessibilitySupport": "off"  // スクリーンリーダーを使用する場合は "on" に設定
}
```

:::message alert
アクセシビリティ設定は、視覚や運動機能に制限のあるユーザーにとって重要です。
必要性を十分に検討した上で設定を変更してください。
:::

## 🎉 まとめ

VSCodeの設定を適切にカスタマイズすることで、開発効率を大幅に向上させることができます。
この記事で紹介した設定は、以下の効果が期待できます：

1. 作業効率の向上
2. コードの品質維持
3. エディタのパフォーマンス改善

:::message
設定は開発言語や個人の好みによって異なる場合があります。この記事の設定を基本として、必要に応じて調整してください。
:::

## 📝 参考リンク

- [Visual Studio Code Documentation](https://code.visualstudio.com/docs)
- [VS Code Can Do That?](https://vscodecandothat.com/)
- [VSCode Settings Sync](https://code.visualstudio.com/docs/editor/settings-sync)
