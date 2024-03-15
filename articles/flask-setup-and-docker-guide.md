---
title: "FlaskとDockerのさわりだけやってみた"
emoji: "🚀"
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["Flask", "Docker", "Web開発", "Python", "コンテナ化"] # 記事に関連するトピックをここに入力
published: true
publication_name: "ap_com"
published_at: 2024−04−03 12:00
---

## 🌟 はじめに

おぐまです。

Pythonの軽量WebフレームワークであるFlaskで公式Quickスタート^[https://flask.palletsprojects.com/en/3.0.x/quickstart/]の初めのWebアプリケーション開発の部分と、Dockerを使ってコンテナ化してみました。将来的にはより複雑なアプリケーションの開発やデプロイメントに活かしていきます！

## 👷‍♂️ 事前準備

- **必要なツールやライブラリ**: Python、Flask、Docker
- **基本的な知識要件やスキルセット**: Pythonプログラミング、基本的なWeb開発の理解、コンテナの基礎知識

### 💻 開発環境

- Python 3.9
- Flask 2.0.1
- Docker 20.10.7

## 📝 やったこと

### 👉 Flaskアプリの初期構築

まず、シンプルなFlaskアプリを作成してみます。

1. **プロジェクトディレクトリの準備**:

  ```sh
  python3 -m venv quick_flask
  cd quick_flask
  source bin/activate
  ```

2. **Flaskのインストール**:

  ```sh
  pip install Flask
  ```

3. **アプリケーションのコード**:
  `app.py`ファイルを作成し、以下のコードを記述します。

  ```python
  from flask import Flask

  app = Flask(__name__)

  @app.route("/")
  def hello_world():
      return "<p>Hello, World!</p>"
  ```

1. **アプリケーションの実行**:

  ```sh
  flask run
  ```

  ブラウザを開いて `http://127.0.0.1:5000/` にアクセスし、"Hello, World!" が表示されることを確認します。

### 👉 Dockerを使ったアプリのコンテナ化

次に、作成したFlaskアプリをDockerコンテナ内で実行します。

1. **Dockerfileの作成**:
  プロジェクトルート(今回はquick_flaskディレクトリ直下)に `Dockerfile` を作成し、以下の内容を記述します。

  ```Dockerfile
  FROM python:3.9-slim
  WORKDIR /app
  COPY . /app
  RUN pip install Flask
  EXPOSE 5000
  CMD ["flask", "run", "--host=0.0.0.0"]
  ```

2. **Dockerイメージのビルド**:

  ```sh
  docker build -t quick_flask .
  ```

3. **Dockerコンテナの実行**:

  ```sh
  docker run -p 5000:5000 quick_flask
  ```

  再びブラウザで `http://127.0.0.1:5000/` にアクセスし、コンテナ内でアプリが実行されていることを確認します。

:::message alert
Macbookの方で以下のエラーになる場合

```sh
docker: Error response from daemon: Ports are not available: exposing port TCP 0.0.0.0:5000 -> 0.0.0.0:0: listen tcp 0.0.0.0:5000: bind: address already in use.
```

既にこのポートが使われているよっていうエラーなので`lsof -i tcp:5000`でプロセスを確認します。
確認すると`COMMAND`部分に`ControlCe`というのがあります。

これはMakbookの以下設定が有効になっている場合、5000番ポートが利用されるらしいので一旦無効化してから`docker run`してみてください。
![port_used](/images/flask-setup-and-docker-guide/port_used.png)
:::

## 🎉 まとめ

Flaskを使った簡単なWebアプリケーションの開発から始め、Dockerを使用してそのアプリケーションをコンテナ化やってみました。
めちゃくちゃ簡単、、とおもったら1つ躓きましたがそれぞれドキュメント読み始めて20分くらいでできました！

FlaskもDockerもなんとなく理解したので応用でなんか作ってみたいと思います。

## 💡 補足

- 関連資料やさらなる情報が必要な場合は、以下を参照してください
  - [Flask公式ドキュメント](https://flask.palletsprojects.com/)
  - [Docker公式ドキュメント](https://docs.docker.com/)

https://qiita.com/rune187/items/3f92baec61458e4e5949
https://github.com/9mak/playground/tree/main/python/quick_flask
