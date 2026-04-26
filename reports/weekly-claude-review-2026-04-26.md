# Claude Code 週次レビュー 2026-04-26

## 現状サマリー

### CLAUDE.md
リポジトリルートに **CLAUDE.md が存在しない**（先週から未対応）。Claude Code がプロジェクト固有のルールやコンテキストを持てない状態が継続中。

### .claude/settings.json
`.claude/` ディレクトリが引き続き存在しない。hooks・権限設定・モデル設定などが一切未構成。

### GitHub Actions（3ワークフロー）

| ワークフロー | トリガー | 目的 | 問題 |
|---|---|---|---|
| `auto_publish_true.yml` | push to develop | 記事の `published: false` を `true` に書き換え | 全ファイル対象バグ・force push・古いバージョン |
| `markdown_lint.yml` | push/PR to develop | Markdownリント | 古いバージョン・develop のみ対象 |
| `post_to_x.yml` | push to main（articles/*.md） | 新規記事をXに投稿 | 概ね良好 |

### 先週（2026-04-19）からの進捗
先週の高優先度3件（CLAUDE.md作成・auto_publish_true.ymlバグ修正・actionsバージョン更新）はいずれも未対応のまま。

---

## 改善候補

### 優先度: 高

#### 1. CLAUDE.md の新規作成（2週連続未対応）
セッション開始時に毎回読まれる `CLAUDE.md` がない。**目標: 500トークン以下**に収める（5,000トークンの CLAUDE.md はセッション開始前に毎ターン5,000トークンを消費する）。

```markdown
# Zenn記事管理リポジトリ

## ブランチ運用
- `develop`: 執筆・レビュー（published: false のまま）
- `main`: 公開済み（Zenn同期・CI が published を自動変換）

## 記事フォーマット
フロントマター必須: title, emoji, type, topics, published

## 禁止
- main への直接 push
- articles/ 以外への published キー追加
- git push --force（--force-with-lease を使う）
```

#### 2. `auto_publish_true.yml` のバグ修正（2週連続未対応）
`find articles -type f -name '*.md'` で**全ファイル**を毎回対象にしている。push ごとに無関係な記事も変更対象になり、不要なコミットが発生し続けている。

```yaml
- name: Get changed files and update published status
  run: |
    CHANGED_FILES=$(git diff --name-only HEAD~1 HEAD -- 'articles/*.md')
    for file in $CHANGED_FILES; do
      [ -f "$file" ] && sed -i 's/published: false/published: true/' "$file"
    done
```

#### 3. GitHub Actions のバージョン更新（2週連続未対応）

| ファイル | 現在 | 推奨 |
|---|---|---|
| `auto_publish_true.yml` | `actions/checkout@v2` | `actions/checkout@v4` |
| `markdown_lint.yml` | `actions/checkout@v2` | `actions/checkout@v4` |
| `markdown_lint.yml` | `actions/setup-node@v2` | `actions/setup-node@v4` |

v2 は Node.js 16 ベースで EOL 済み。SLSA サプライチェーン攻撃のリスクもある。

---

### 優先度: 中

#### 4. `.claudeignore` の作成（新規）
Claude Code がコンテキストとして読み込む不要ファイルを除外することで、トークン消費を削減できる。

```
node_modules/
.git/
*.log
reports/
```

`reports/` を除外すると、過去の週次レビューファイルが毎回読み込まれるのを防げる。

#### 5. hooks の導入（SessionStart + PostToolUse）
今週の調査で **12種類のライフサイクルイベント**が利用可能であることが判明。最低限以下を設定する。

```json
{
  "hooks": {
    "SessionStart": [
      {
        "type": "command",
        "command": "echo 'Branch: ' && git branch --show-current && echo 'Unpublished articles:' && grep -rl 'published: false' articles/ 2>/dev/null | head -5"
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "file=$(echo $CLAUDE_TOOL_INPUT | jq -r '.file_path // empty'); [[ $file == articles/*.md ]] && npx markdownlint --fix \"$file\" || true"
          }
        ]
      }
    ]
  }
}
```

**SessionStart** で現在ブランチと未公開記事一覧を注入することで、毎回の確認コストをゼロにできる。

#### 6. `async: true` hooks の活用（2026年1月リリース新機能）
重いチェック処理（リント・テスト）には `async: true` を設定し、Claude の実行をブロックしないようにする。

```json
{
  "type": "command",
  "command": "npx markdownlint articles/",
  "async": true
}
```

#### 7. `auto_publish_true.yml` の force push 廃止
```yaml
git push --set-upstream origin HEAD:develop --force
```
→ `--force-with-lease` へ変更。他のプロセスが同じブランチを更新していた場合の履歴破壊を防げる。

---

### 優先度: 低

#### 8. opusplan でモデル使い分け
計画フェーズに Opus、コード生成に Sonnet を自動切り替えする `opusplan` 設定。ある開発チームでは月次コストが $2,400 → $680（72%削減）を達成している。

#### 9. `MAX_THINKING_TOKENS` の上限設定
複雑な推論が不要なタスク（記事のフォーマット修正など）では、環境変数で thinking tokens の上限を下げることでコスト削減が可能。

```bash
MAX_THINKING_TOKENS=4000 claude
```

#### 10. markdown_lint.yml を main にも適用
現在は develop のみ。main への PR 時にもリントが走るよう拡張する。

---

## 今週のベストプラクティス

### 1. Hooks の 12イベント全貌（2026年確定版）
Claude Code は現在12種類のライフサイクルイベントをサポート。主要なもの:
- **PreToolUse**: ツール実行前（セキュリティチェック、危険操作のブロック）
- **PostToolUse**: ツール実行後（lint、フォーマット）
- **SessionStart**: セッション開始時（コンテキスト注入）
- **PreCompact**: コンテキスト圧縮前（重要情報の保存）

exit code 2 でツール実行をブロックできる。HTTP hooks でチーム全体のポリシー適用も可能。

### 2. CLAUDE.md は 500トークン以下が最適
「5,000トークンの CLAUDE.md はセッション開始前に毎ターン5,000トークンを消費する」。大きなドキュメントは Skills（`/skills`）としてオンデマンドロードし、CLAUDE.md には行動を変える情報だけを残す。

### 3. SessionStart で compaction 後もコンテキストを保持
`SessionStart` hook は compaction（コンテキスト自動圧縮）の直後にも実行されるため、長いセッションでも Claude がプロジェクトコンテキストを忘れない。

### 4. `/compact` vs `/clear` の使い分け
- `/compact`: 現在の作業を圧縮して継続（関連タスクの切り替え時）
- `/clear`: 完全にリセット（無関係な作業への切り替え時）
- `/rename` → `/clear` → `/resume` でセッションを整理しながら切り替え

### 5. `.claudeignore` でコンテキスト最適化（見落とされがちな設定）
`node_modules/` や大きなログファイルを `.claudeignore` で除外するだけで、コンテキストロードのトークン消費を大幅削減できる。多くのユーザーが見落としている設定。

---

## 総評

先週から3件の高優先度改善候補が未対応のまま残っている。特に `auto_publish_true.yml` の全ファイル対象バグは毎回の push で不要なコミットを生み出し続けており、早急な修正が必要。今週の調査で**12種類のライフサイクルイベント**と**async hooks**（2026年1月リリース）が明らかになり、hooks の活用余地がさらに広がっていることが判明した。最優先アクションは CLAUDE.md 作成（500トークン以下）と auto_publish_true.yml のバグ修正の2点。これらを対応するだけで即座に品質と効率が改善される。

---

*Sources:*
- [Best Practices for Claude Code - Claude Code Docs](https://code.claude.com/docs/en/best-practices)
- [Automate workflows with hooks - Claude Code Docs](https://code.claude.com/docs/en/hooks-guide)
- [Manage costs effectively - Claude Code Docs](https://code.claude.com/docs/en/costs)
- [Claude Code Advanced Best Practices: 11 Practical Techniques - SmartScope](https://smartscope.blog/en/generative-ai/claude/claude-code-best-practices-advanced-2026/)
- [Claude Code Hooks: Complete Guide to All 12 Lifecycle Events](https://claudefa.st/blog/tools/hooks/hooks-guide)
- [Claude Code Token Optimization: Full System Guide (2026)](https://buildtolaunch.substack.com/p/claude-code-token-optimization)
- [50 Claude Code Tips and Best Practices For Daily Use](https://www.builder.io/blog/claude-code-tips-best-practices)
- [18 Claude Code Token Management Hacks - MindStudio](https://www.mindstudio.ai/blog/claude-code-token-management-hacks)
- [10 Best Claude Code Hooks (2026) - AY Automate](https://www.ayautomate.com/blog/best-claude-code-hooks)
- [Reduce Claude Code Costs 60% With These Four Habits](https://systemprompt.io/guides/claude-code-cost-optimisation)
