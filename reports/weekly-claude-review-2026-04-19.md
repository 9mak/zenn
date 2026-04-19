# Claude Code 週次レビュー 2026-04-19

## 現状サマリー

### CLAUDE.md
リポジトリルートに **CLAUDE.md が存在しない**。Claude Code がプロジェクト固有のルールやコンテキストを持てない状態。

### .claude/settings.json
`.claude/` ディレクトリ自体が存在しない。hooks・権限設定・モデル設定などが一切未構成。

### GitHub Actions（3ワークフロー）

| ワークフロー | トリガー | 目的 |
|---|---|---|
| `auto_publish_true.yml` | push to develop | 記事の `published: false` を `true` に書き換え |
| `markdown_lint.yml` | push/PR to develop | Markdownリント |
| `post_to_x.yml` | push to main（articles/*.md） | 新規記事をXに投稿 |

---

## 改善候補

### 優先度: 高

#### 1. CLAUDE.md の新規作成（欠如）
Claude Code セッション開始時に毎回読まれる `CLAUDE.md` がない。以下を含む最小限の CLAUDE.md を作成することで、プロジェクトルールの徹底とトークン節約が両立できる。

```markdown
# このリポジトリについて
Zenn の記事・本を管理するリポジトリ。

## ブランチ運用
- `develop`: 執筆・レビュー
- `main`: 公開済み（Zenn と同期）

## 記事フォーマット
- フロントマター必須: title, emoji, type, topics, published
- published は develop では false のまま（CI が自動変換）

## 禁止事項
- main への直接 push 禁止
- articles/ 以外の md ファイルへの `published` キー追加禁止
```

#### 2. `auto_publish_true.yml` のバグ修正（ロジック誤り）
現在は `find articles -type f -name '*.md'` で**全ファイル**を対象にしている。push ごとに全記事が変更扱いになり、意図しないコミットが発生する。

**修正案:**
```yaml
- name: Get changed files and update published status
  run: |
    CHANGED_FILES=$(git diff --name-only HEAD~1 HEAD -- 'articles/*.md')
    for file in $CHANGED_FILES; do
      [ -f "$file" ] && sed -i 's/published: false/published: true/' "$file"
    done
```

#### 3. GitHub Actions のバージョン更新（セキュリティリスク）
`auto_publish_true.yml` と `markdown_lint.yml` が旧バージョンを使用中。

| ファイル | 現在 | 推奨 |
|---|---|---|
| `auto_publish_true.yml` | `actions/checkout@v2` | `actions/checkout@v4` |
| `markdown_lint.yml` | `actions/checkout@v2` | `actions/checkout@v4` |
| `markdown_lint.yml` | `actions/setup-node@v2` | `actions/setup-node@v4` |

---

### 優先度: 中

#### 4. `auto_publish_true.yml` の force push 廃止
```yaml
git push --set-upstream origin HEAD:develop --force
```
`--force` は履歴を破壊するリスクがある。`--force-with-lease` への変更、または通常 push への変更を推奨。

#### 5. .claude/settings.json と hooks の導入
現在 hooks が未設定。以下の hooks を追加すると品質が向上する。

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx markdownlint --fix \"${file}\""
          }
        ]
      }
    ]
  }
}
```

- **PostToolUse（Write）**: ファイル書き込み後に自動 lint・フォーマット
- **PreToolUse（Bash）**: 危険なコマンド（rm -rf、force push）の事前チェック

#### 6. markdown_lint.yml を main ブランチにも適用
現在は develop のみ。main への PR 時にもリントが走るよう修正すると、公開前の品質チェックが強化される。

```yaml
on:
  push:
    branches:
      - develop
      - main
  pull_request:
    branches:
      - develop
      - main
```

---

### 優先度: 低

#### 7. トークンコスト削減: CLAUDE.md の肥大化防止
CLAUDE.md はセッション開始時に毎回読み込まれるため、記述量がそのままトークンコストに直結する。以下の原則を守る:
- 説明的・理想論的な文章を避ける
- Claude の**行動を変える**情報のみ記載
- 将来的には Skills（`/skills` コマンド）で領域別知識をオンデマンドロードする

#### 8. モデル選択の最適化（opusplan）
複雑な設計・計画フェーズには Opus、コード生成には Sonnet を使い分ける `opusplan` 設定が有効。計画フェーズのみ高精度モデルを使うことでコスト削減と品質維持を両立できる。

#### 9. post_to_x.yml にエラーハンドリング追加
現在はスクリプトが失敗してもワークフロー全体が止まらない可能性がある。`set -e` の追加を検討。

---

## 今週のベストプラクティス

### 1. Hooks の活用（2026年主流）
Claude Code の hooks は `PreToolUse` / `PostToolUse` が全体の80%を占める。`SessionStart` hook でプロジェクトコンテキストを注入すると、毎回の指示が不要になる。

```json
{
  "hooks": {
    "SessionStart": [
      {
        "type": "command",
        "command": "cat .claude/context.md"
      }
    ]
  }
}
```

### 2. サブエージェントでのコンテキスト汚染防止
テスト実行・ログ解析など出力が大きいタスクはサブエージェントに委譲。メインコンテキストにはサマリーのみが返るため、トークン消費を大幅に削減できる。

### 3. /cost コマンドで週次レビュー
`/cost` でセッションごとのトークン消費を確認。月次ではなく週次で確認することで、コスト増加のパターンを早期発見できる。

### 4. Plan Mode（計画と実装の分離）
`/plan` でリサーチ・設計フェーズを分離してから実装に移ると、誤った方向への実装による無駄なトークン消費を防げる。

---

## 総評

このリポジトリは Zenn 記事管理として基本的な GitHub Actions を備えているが、**Claude Code との統合がゼロ**の状態。CLAUDE.md と `.claude/settings.json` を新規作成し、最低限のプロジェクトコンテキストと hooks を設定することが最優先。また `auto_publish_true.yml` の全ファイル対象バグと古い actions バージョンは早期修正が必要。これらを対応するだけでも Claude Code の作業品質とコスト効率が大幅に改善される。

---

*Sources:*
- [Best Practices for Claude Code - Claude Code Docs](https://code.claude.com/docs/en/best-practices)
- [Automate workflows with hooks - Claude Code Docs](https://code.claude.com/docs/en/hooks-guide)
- [Manage costs effectively - Claude Code Docs](https://code.claude.com/docs/en/costs)
- [50 Claude Code Tips and Best Practices For Daily Use](https://www.builder.io/blog/claude-code-tips-best-practices)
- [Claude Code Token Optimization: Full System Guide (2026)](https://buildtolaunch.substack.com/p/claude-code-token-optimization)
