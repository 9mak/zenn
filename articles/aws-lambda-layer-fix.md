---
title: "AWS Lambda Layer追加時の注意点とエラー対策"
emoji: "🛠️"
type: "tech"
topics: ["AWS", "Lambda", "Layer", "Docker", "WSL"]
published: true
publication_name: "ap_com"
published_at: "2024-12-04 12:00"
---

[おぐま](https://github.com/9mak)です。

Lambda Layerを追加する際には、開発環境と実行環境の違いやランタイムの互換性など、様々な点に注意が必要です。これらを適切に管理しないとimportの段階でLambda関数が正常に動作しないなど、出鼻くじかれてきついです笑

## 🤔 問題の原因

Lambda Layer追加時に発生する主な問題の原因は以下の通りです。

1. 開発環境とLambda実行環境の違い
2. ランタイムやバージョンの不一致
3. アーキテクチャの不一致（x86_64 vs arm64）
4. レイヤーのサイズ制限違反
5. 依存関係の競合
6. ネイティブバイナリの互換性問題

:::message
今回は、**1. 開発環境とLambda実行環境の違い**で発生するエラーの対策について解説します。
:::

## 🕵️ 解決策

AWS LambdaはLinuxベースの環境で動作するため、WindowsでLayerのzipファイルを作成しLambdaにLayerを追加しようとするとエラーになることがあります。WindowsとLinuxの環境の違いによる問題を回避するため、Linux環境でLayerを作成します。

:::message
Layerのzipファイルを作成した後はLambdaコンソールでLayerの追加、関連付けを行ってください
:::

### 👉 ステップ1: Dockerを使用してLambda Layerをビルドする方法

Lambda環境に似せたDockerイメージを使用してLayerをビルドします。

1. **Dockerをインストールし、起動します。**

2. **プロジェクトディレクトリに移動します。**  
   `requirements.txt`が存在し、インストールするパッケージが正しく記載されていることを確認します。

   ```bash
   cd your_project_directory
   ```

3. **以下のコマンドを実行して、必要なライブラリをインストールします：**

   ```bash
   docker run --rm --volume $(pwd):/var/task \
   lambci/lambda:build-python3.12 \
   pip install -r requirements.txt -t python/lib/python3.12/site-packages/
   ```

   このコマンドの解説：
   - `--rm`: コンテナ終了後に自動的に削除します。
   - `--volume $(pwd):/var/task`: 現在のディレクトリをコンテナ内の`/var/task`にマウントします。
   - `lambci/lambda:build-python3.12`: Lambda環境に似せたDockerイメージを使用します。（LambdaのPythonバージョンに注意して、対応しているイメージを使用）
   - `pip install -r requirements.txt -t python/lib/python3.12/site-packages/`: `requirements.txt`に記載されたパッケージを指定ディレクトリにインストールします。

4. **Layerをzip形式で圧縮します：**

   ```bash
   zip -r layer.zip python
   ```

   - zipファイル内のディレクトリ構造が正しいことを確認するため、作成されたzipファイルの中身をチェックします。`python/lib/python3.12/site-packages/`の構成になっているかを確認してください。

---

### 👉 ステップ2: WSL (Windows Subsystem for Linux) を使用してLambda Layerを作成する方法

WSLを使用すると、WindowsユーザーがLinux環境でLambda Layerを作成できます。
WSL2の設定については以下参考にお願いします
https://zenn.dev/ap_com/articles/install-wsl2-on-windows

1. **WSLをインストールし、起動します。**

   - Windowsの設定から、WSLを有効にしてUbuntuなどのLinuxディストリビューションをインストールします。

2. **必要なツールをインストールします：**

   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install python3-pip python3-venv zip -y
   ```

   - `zip` コマンドもインストールする必要があるため、これを追加しました。

3. **プロジェクトディレクトリを作成し、仮想環境を設定します：**

   ```bash
   mkdir lambda_layer && cd lambda_layer
   python3 -m venv venv
   source venv/bin/activate
   ```

   - `requirements.txt`が存在すること、仮想環境が正しく作成されていることを確認します。

4. **必要なパッケージをインストールします：**

   ```bash
   pip install -r requirements.txt -t python/lib/python3.12/site-packages/
   ```

   - インストール先ディレクトリがLambdaのバージョン（例: Python 3.12）に対応していることを確認します。LambdaのPythonランタイムに合わせたバージョンに修正が必要な場合があります（現在Python 3.12が利用可能なため、必要に応じてバージョンを更新してください）。

5. **Layerをzip形式で圧縮します：**

   ```bash
   zip -r layer.zip python
   ```

   - 作成された`layer.zip`ファイルの中身を確認し、ディレクトリ構造が `python/lib/python3.12/site-packages/` になっていることを確認します。

#### 確認点

- `requirements.txt`が適切に準備されていること。
- PythonランタイムバージョンがLambdaでサポートされているか確認すること。
- `zip`コマンドを忘れずにインストールすること。
- zipファイルのディレクトリ構造が正しいか確認すること（特に`python/lib/pythonX.X/site-packages/`）。

---

### 👉 ステップ3: EC2インスタンスを使用してLambda Layerを作成する方法

EC2インスタンスを使用してLayerを作成する方法も有効です。

1. **Amazon Linux 2のEC2インスタンスを起動します。**

   - EC2インスタンスを作成し、必要に応じてセキュリティグループなどの設定を行います。

2. **インスタンスに接続し、必要なパッケージをインストールします：**

   ```bash
   sudo yum update -y
   sudo yum install python3-pip zip -y
   ```

   - `zip`コマンドも必要なので追加しました。

3. **プロジェクトディレクトリを作成し、必要なパッケージをインストールします：**

   ```bash
   mkdir lambda_layer && cd lambda_layer
   pip3 install -r requirements.txt -t python/lib/python3.12/site-packages/
   ```

   - PythonランタイムバージョンがLambdaに対応しているか確認します。LambdaのPythonバージョンに合わせて、バージョンを変更する必要がある場合があります（例：Python 3.12がサポートされているかを確認）。

4. **Layerをzip形式で圧縮します：**

   ```bash
   zip -r layer.zip python
   ```

   - 作成された`layer.zip`ファイルの中身を確認し、ディレクトリ構造が `python/lib/python3.12/site-packages/` になっていることを確認します。

5. **AWS CLIを使用してLayerをアップロードします：**

   ```bash
   aws lambda publish-layer-version \
       --layer-name my-layer \
       --description "My custom layer" \
       --zip-file fileb://layer.zip \
       --compatible-runtimes python3.12
   ```

   - AWS CLIの設定（`aws configure`）が済んでいるか確認します。必要なアクセスキーやリージョンが正しく設定されているかをチェックしてください。
   - Lambdaランタイムのバージョンも、適切なPythonバージョンに合わせて更新する必要があります（現在Python 3.12が利用可能なため、適宜変更を検討）。

6. **Layerの確認**:

   - Layerが正常にアップロードされたかAWSコンソールで確認し、必要に応じてLambda関数にアタッチします。

#### 確認点

- `zip`コマンドのインストールが必要なので追加しました。
- PythonランタイムバージョンがLambdaでサポートされているか確認（例：Python 3.12対応の有無）。
- `requirements.txt`ファイルが適切に準備されていること。
- AWS CLIが正しく設定されていること（`aws configure`）。
- zipファイルのディレクトリ構造が正しいことを確認（`python/lib/pythonX.X/site-packages/`）。

---

### 👉 ステップ4: Lambda自体でpip installからLayerを追加する方法

この方法では、Lambda関数内で直接パッケージをインストールし、Layerとして追加します。

1. **以下のPythonコードをLambda関数として作成します：**

```python
import subprocess
import zipfile
import boto3
import os
import json

def lambda_handler(event, context):
    # 必要なパッケージをインストール
    subprocess.check_call(['/var/lang/bin/python3', '-m', 'pip', 'install', '-t', '/tmp/python', 'requests', 'beautifulsoup4'])
    
    # インストールしたパッケージをZIPファイルにまとめる
    with zipfile.ZipFile('/tmp/layer.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk('/tmp/python'):
            for file in files:
                zipf.write(os.path.join(root, file), 
                          os.path.relpath(os.path.join(root, file), '/tmp/python'))
    
    # Layerを作成
    lambda_client = boto3.client('lambda')
    with open('/tmp/layer.zip', 'rb') as zip_file:
        response = lambda_client.publish_layer_version(
            LayerName='MyCustomLayer',
            Description='Layer created within Lambda',
            Content={
                'ZipFile': zip_file.read()
            },
            CompatibleRuntimes=['python3.11', 'python3.12'],
            CompatibleArchitectures=['x86_64']
        )
    
    # 作成したLayerをこの関数に追加
    layer_arn = response['LayerVersionArn']
    current_function = context.function_name
    
    lambda_client.update_function_configuration(
        FunctionName=current_function,
        Layers=[layer_arn]
    )
    
    return {
        'statusCode': 200,
        'body': json.dumps('Layer created and added to the function')
    }
```

### 重要なポイント

- **インストールパッケージ**: `requests` と `beautifulsoup4` が指定されていますが、必要なパッケージが他にもあれば `subprocess.check_call` の引数に追加してください。
- **Lambdaの制限**: `/tmp`ディレクトリはLambdaの実行時にのみ使用でき、容量は512MBまでの制限があります。パッケージのサイズが大きすぎないか確認しましょう。
- **Pythonバージョン**: `python3.11` および `python3.12` に対応していますが、実際のLambda環境に応じてバージョンを適切に選んでください。

2. **この関数に必要な権限（Layer作成、関数更新）を付与します。**

   - **IAMロール設定**: Lambda関数に必要な権限を付与します。具体的には、`lambda:PublishLayerVersion` および `lambda:UpdateFunctionConfiguration` の権限を持つロールが必要です。以下のようにIAMロールを設定します。

   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Effect": "Allow",
               "Action": [
                   "lambda:PublishLayerVersion",
                   "lambda:UpdateFunctionConfiguration"
               ],
               "Resource": "*"
           }
       ]
   }
   ```

   - IAMロールの設定に注意し、必要な権限を正しく付与します。

3. **関数を実行すると、Layerが作成され、自動的に関数に追加されます。**

   - 関数を実行後、Lambdaコンソールで作成されたLayerが正しく追加されたことを確認します。

### 確認点

1. **IAMロールの権限付与**: 必要な権限（`PublishLayerVersion`と`UpdateFunctionConfiguration`）を持つIAMロールがLambdaにアタッチされているか確認します。
2. **/tmpディレクトリの制限**: `/tmp`ディレクトリの容量が512MBのため、インストールするパッケージのサイズがこれを超えないか注意が必要です。
3. **Pythonランタイムの互換性**: 関数のランタイムバージョン（`python3.11`や`python3.12`）が適切か確認します。Lambdaの設定によって異なる場合があるので、環境に合わせて変更してください。
4. **セキュリティの考慮**: Lambdaで外部ライブラリをインストールする場合、必要なパッケージのみを指定し、不必要なライブラリが含まれないように注意します。
5. **Layerの確認**: Layerが正しく作成され、関数に追加されたことをLambdaコンソールで確認します。

:::message alert
この方法はランタイムとかバージョン合わせてるのにエラーに出続けて、`Lambdaと同じ環境に合わせるならLambdaでやっちゃえ！`と思い付きでしたがこれでも解決できました。

Cloud9が使えないのでしんどいです🥹
:::

## 🎉 結論

Lambda Layerの作成と追加時には、開発環境とLambda実行環境の違いに注意する必要があります。
Docker、WSL、EC2インスタンス、Lambda内でのLayer作成など自身のモチベーションによってどれかで対応してみてください。

| 方法 | メリット | デメリット |
|------|----------|------------|
| Docker | 環境の再現性が高い | Dockerの知識が必要 |
| WSL | Windows上で簡単に利用可能 | WSLのセットアップが必要 |
| EC2 | Lambda環境に最も近い | コストがかかる |
| Lambda内でのLayer作成 | 完全なLambda互換性 | 実行時間とコストが増加 |

個人的には、開発環境としてはWSLを使用し、CI/CDパイプラインではDockerを使用するのが最適だと考えています。
ただ思い付きのLambda内でのLayer作成もこれからLambda作るってなったとき最初に実行しちゃえばいいので結構楽なんじゃないかと思ってます。

---

参考文献：
https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/troubleshooting-deployment.html
https://qiita.com/nakamurahiro/items/706aa8eaf7fc15a9996b
https://qiita.com/Nana_777/items/3c6a45e04b75390ef7d8
https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/best-practices.html
