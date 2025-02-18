---
title: "ちょっと前の自分に教えたいAnsibleのPlaybookの書き方"
emoji: "🧑‍🚀"
type: "tech"
topics: ["Ansible", "Playbook", "自動化"]
published: true
publication_name: "ap_com"
published_at: 2025-04-16 12:00
---

## 🌟 はじめに

こんにちは、[おぐま](https://github.com/9mak)です。  
今回の記事では、かつて自分が躓いたAnsibleのPlaybookの書き方について基本から実践的なテクニックまでを振り返りながら解説します。
Ansible Playbookを活用することで、サーバ管理や自動化タスクがより効率的に実現できるようになります。

:::message
このチュートリアルは初級〜中級レベルの読者を対象としています。所要時間は約15分です。
:::

## 👷‍♂️ 事前準備

まずは、この記事を読み進める前にAnsibleとYAMLの基本知識があるとより理解しやすくなります。  
Ansibleの環境構築やPlaybookの実行方法を把握しておくと、内容をスムーズに学習できます。

### 💻 開発環境

| 項目                | 要件                                |
| ------------------- | ----------------------------------- |
| Ansible             | 2.9以上（最新版推奨）               |
| テキストエディタ/IDE | VSCode（推奨、その他エディタでも可） |
| OS                  | Linux, macOS, またはWSL環境           |

AnsibleはPythonベースのツールですので、以下のようにインストール可能です。

```bash
pip install ansible
```

## 📖 ステップバイステップ

ここからは、実際にAnsible Playbookを書くための手順を具体例とともに解説します。

### 👉 ステップ1: 基本的なPlaybookの作成

まずは、シンプルなHello Worldを出力するPlaybookから始めましょう。  
最も基本的なPlaybookは「対象ホスト」と「tasks」セクションのみで構成されます。以下のコードは、localhostに対してデバッグメッセージを出力する例です。

```yaml
---
- hosts: localhost
  tasks:
    - name: Hello Ansible
      debug:
        msg: "Hello, Ansible World!"
```

この例では、  
・`hosts: localhost` は実行対象のホストを示し、  
・`tasks` セクションに記述されたタスクは上から順に実行されます。

### 👉 ステップ2: 変数の活用と条件分岐

Playbook内では、変数を定義することで柔軟にタスクの実行条件を制御できます。  
以下の例では、変数`user`と`create_file`を定義し、条件に応じてファイルを作成するタスクを実行しています。

```yaml
---
- hosts: all
  vars:
    user: "sammy"
    create_file: true
  tasks:
    - name: 条件が真の場合にファイル作成
      file:
        path: "/home/{{ user }}/example.txt"
        state: touch
      when: create_file
```

ここでは、`when`句を利用して、`create_file`が`true`の場合にのみファイル作成タスクが実行されます。

### 👉 ステップ3: ハンドラの活用

ハンドラはタスクの変更を検知して実行される特別な処理です。  
たとえば設定ファイルを更新した後にサービスを再起動する場合、以下のようにハンドラを定義します。

```yaml
---
- hosts: webservers
  tasks:
    - name: 設定ファイルを更新
      template:
        src: config.j2
        dest: /etc/myapp/config.conf
      notify: Restart myapp

  handlers:
    - name: Restart myapp
      service:
        name: myapp
        state: restarted
```

この例では、`notify`によってタスクが変更された際にハンドラ`Restart myapp`が呼び出され、サービスが再起動されます。

### 👉 ステップ4: 複数タスクの整理と実践例

複雑な自動化タスクでは、複数のタスクを整理して記述することが重要です。  
以下は、Webサーバ上でNginxをインストールするシンプルなPlaybookの例です。

```yaml
---
- name: Nginxのインストール
  hosts: webservers
  become: yes
  tasks:
    - name: Nginxのインストール
      yum:
        name: nginx
        state: present
```

ここでは、`become: yes`によって管理者権限でタスクが実行され、`yum`モジュールでNginxのインストールを行っています。

## 🔧 Ansibleのモジュールの理解

Ansibleのモジュールは、各タスクを実行するための再利用可能なスクリプトで、システムの状態管理やサービス操作、ファイル管理など幅広い機能を提供します。
たとえば、以下のような代表的なモジュールがあります。

| モジュール名 | 役割                         | 例                                      |
| ------------ | ---------------------------- | --------------------------------------- |
| apt          | Debian/Ubuntu向けのパッケージ管理   | `nginx`の最新バージョンのインストール       |
| yum          | RHEL/CentOS向けのパッケージ管理      | `httpd`のインストールまたは更新           |
| service      | サービスの再起動や停止             | Dockerサービスの再起動                   |
| file         | ファイルやディレクトリの管理        | 特定のパーミッションでディレクトリ作成       |
| copy         | ファイル転送                   | ローカルからリモートへのファイルコピー       |

これらのモジュールは、各タスクの目的に応じた引数を取り実行結果をJSON形式で返す仕様となっており、冪等性（idempotency）を意識して設計されています。

## 💡 ヒントとトラブルシューティング

Ansible Playbookを書く上での注意点をいくつか挙げます。

- **インデントの統一**  
  YAMLはスペースによるインデントが重要です。
  一般的にはスペース2個または4個で統一しましょう。

- **タスク名の明確化**  
  各タスクに適切な`name`を付与することで、実行ログが読みやすくなりトラブルシューティングが容易になります。

- **エラーメッセージの確認**  
  Playbook実行時は`ansible-playbook -v playbook.yml`のように`-v`オプションで詳細ログを出力し、エラー原因を特定してください。

:::message alert
もしエラーが発生した場合は、YAMLのインデントや構文、各タスクのパラメータが正しく設定されているかをまず確認してください。
:::

## 🎉 まとめ

この記事では、Ansible Playbookの基本構造から実際に活用できるテクニックまでを解説しました。

自動化スクリプトのメンテナンス性向上につながるこれらの知識は、日々のインフラ管理に大きく寄与します。
今回の内容を実践することでよりスマートなIT運用を実現してください！
