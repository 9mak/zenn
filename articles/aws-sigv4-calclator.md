---
title: "AWS SigV4 計算ツールの紹介：API認証の裏側を理解しよう"
emoji: "🔐"
type: "tech"
topics: ["AWS", "認証", "API", "Python", "セキュリティ"]
published: false
publication_name: "ap_com"
published_at: 2024-10-09 12:00
---

## 🌟 ニュース概要

おぐまです。

AWS Signature Version 4（SigV4）の計算を行うPythonスクリプトを作成し、GitHubで公開しました。

https://github.com/9mak/aws_sigv4_calculator

このツールを使えば、AWS APIリクエストの認証プロセスを深く理解できると思います。

ServiceNowからAWSのAPIをREST実行したかったんですが、SDKやCLI以外のAPI実行ではSigv4の署名計算を自分で行う必要があるので仕組みの理解も併せて署名計算のコード書いてみました。

AWSのSDKやCLIを使えない特殊な環境での開発や、AWS認証プロセスの詳細な理解が必要な場面で役立ちます。

https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/create-signed-request.html

:::message
後にServiceNowのREST API実行時のAWS Sigv4署名計算はめちゃくちゃ簡単にできることを知りました。
これからやる方は👇を参考にしてみてください。
:::
https://docs.servicenow.com/ja-JP/bundle/washingtondc-platform-security/page/product/credentials/task/configure-an-amazon-signature-based-custom-algorithm.html

## ✅ 主なポイント

- AWS SigV4の計算プロセスを可視化
- IAM ListUsers APIへのサンプルリクエスト機能
- デバッグ情報の出力機能

## 🔍 詳細分析

AWS SigV4は、AWSのAPIリクエストに認証情報を追加するための署名プロトコルです。
通常、AWSのSDKやCLIを使用する場合、この署名プロセスは裏側で自動的に行われます。

しかし、カスタム実装が必要な場合やプロセスの詳細を理解したい場合には手動で署名を計算する必要があります。

このツールは以下の手順でSigV4署名を計算します：

1. リクエストの詳細情報に基づいて正規リクエストを作成
2. AWS認証情報を使用して署名を計算
3. 計算した署名を認証ヘッダーとしてリクエストに追加

さらに、このツールはIAM ListUsers APIへのサンプルリクエストを送信しレスポンスを表示します。

## 🎉 まとめ

AWS SigV4 計算ツールを使うことで、AWS APIリクエストの認証プロセスを深く理解できます。

また、このツールはAWS API利用や、AWS認証プロセスの学習にも活用できます。

## 💡 補足

**補足1**
このツールはデモンストレーション目的で作成されています。
本番環境では、AWSの公式SDKやCLIの使用をおすすめします。

**補足2**
今回紹介したツールでは簡易的な検証を目的としているためAWSの認証情報をハードコードしてもらうようになっていますが、本番利用時は**セキュリティ上の理由からAWSの認証情報をコード内にハードコーディングすることは避けてください**。
環境変数やAWS認証情報プロバイダーを使用しましょう。

興味のある方は、ぜひリポジトリをチェックしてみてください。AWS認証の仕組みを理解する良い機会になるはずです！
