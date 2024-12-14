---
title: "[AWS] IAM Access Deniedエラー解決ガイド #1 - 基本的なトラブルシューティング"
emoji: "🔒"
type: "tech"
topics: ["aws", "iam", "security", "kms", "lambda"]
published: false
publication_name: "ap_com"
published_at: 2024-12-25 12:00
---

## 🌟 はじめに

[おぐま](https://github.com/9mak)です。
AWSを使用していると、必ず一度は遭遇する「Access Denied」エラー。
本記事では、シリーズ第1回として基本的なAccess Deniedエラーの解決方法について解説します。

## 📚 Access Deniedエラーの基本

### エラーの正体

Access Deniedエラーは、AWSリソースへのアクセス権限が不足している場合に発生します。
主な原因は以下の通りです：

- IAMポリシーの設定不足
- リソースベースのポリシーとの競合
- 暗黙的な拒否（Deny）の存在
- クロスアカウントアクセスの設定ミス

## 💡 5つの代表的なシナリオと解決方法

### 1. Lambda関数からS3バケットへのアクセス

#### エラーメッセージ例

```plaintext
AccessDeniedException: Access Denied (Service: Amazon S3; Status Code: 403...)
```

#### 解決手順

1. IAM実行ロールの確認

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject"
            ],
            "Resource": "arn:aws:s3:::my-bucket/*"
        }
    ]
}
```

2. S3バケットポリシーの確認
3. CORS設定の確認（必要な場合）

### 2. CloudWatchログの書き込み権限

#### エラーメッセージ例

```plaintext
Unable to write logs to CloudWatch (Service: AWSLogs; Status Code: 403...)
```

#### 解決手順

1. 基本ロギング権限の付与

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:*:*:*"
        }
    ]
}
```

2. ロググループの存在確認
3. リージョン設定の確認

### 3. クロスアカウントアクセス

#### エラーメッセージ例

```plaintext
User is not authorized to perform: sts:AssumeRole on resource...
```

#### 解決手順

1. 信頼関係の設定

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::123456789012:role/calling-service-role"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
```

:::message alert
信頼関係のPrincipalにrootアカウント（arn:aws:iam::123456789012:root）を指定することは、セキュリティのベストプラクティスに反します。
代わりに、特定のIAMロールやユーザーを指定することを強く推奨します。
:::

1. アカウントIDの確認
2. アクセス許可の確認

### 4. KMSキーのアクセス制限

#### エラーメッセージ例

```plaintext
KMS AccessDeniedException: User: arn:aws:iam::123456789012:user/username 
is not authorized to perform: kms:Decrypt on resource: 
arn:aws:kms:region:123456789012:key/key-id
```

#### よくある原因

1. KMSキーポリシーの不足
2. IAMポリシーの権限不足
3. 暗号化コンテキストの不一致
4. キーの使用権限の欠如

#### 解決手順

1. KMSキーポリシーの確認と設定

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "Enable IAM User Permissions",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::123456789012:user/username"
            },
            "Action": [
                "kms:Decrypt",
                "kms:GenerateDataKey",
                "kms:DescribeKey"
            ],
            "Resource": "*"
        }
    ]
}
```

2. 暗号化コンテキストの確認

```python
# 暗号化時のコンテキスト
encryption_context = {
    'AppName': 'MyApp',
    'Environment': 'Production'
}

# 復号時は同じコンテキストが必要
decryption_context = {
    'AppName': 'MyApp',
    'Environment': 'Production'
}
```

3. 必要な権限の確認チェックリスト

- [ ] kms:Decrypt - データの復号化
- [ ] kms:GenerateDataKey - データキーの生成
- [ ] kms:DescribeKey - キー情報の取得
- [ ] kms:CreateGrant - 権限の委譲（必要な場合）

### 5. リソースベースのポリシー競合

#### エラーメッセージ例

```plaintext
User is not authorized to perform: s3:PutObject on resource due to an explicit deny
```

#### 解決手順

1. ポリシー評価の優先順位を理解する

- 明示的なDenyが最優先
- 次にリソースポリシーのDeny
- 最後にAllow

2. バケットポリシーの確認

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::123456789012:role/service-role"
            },
            "Action": "s3:PutObject",
            "Resource": "arn:aws:s3:::my-bucket/*"
        }
    ]
}
```

3. IAMポリシーとの競合確認

## 📋 トラブルシューティングのベストプラクティス

1. エラーメッセージの詳細確認

- サービス名
- アクション名
- リソースARN
- エラーコード

2. 権限の段階的な確認

- IAMポリシー
- リソースポリシー
- 暗黙的な拒否

3. 最小権限の原則の遵守

- 必要最小限の権限を付与
- 定期的な権限の見直し
- 未使用の権限の削除

## 🎉 まとめ

基本的なAccess Deniedエラーの解決には、以下の点が重要です：

1. エラーメッセージの正確な理解
2. ポリシー評価の仕組みの把握
3. 段階的なトラブルシューティング
4. 適切な権限設定の実施

次回は、組織レベルのAccess Denied対策として、SCPやパーミッションバウンダリーなどについて解説する予定です！

## 参考リンク

- [IAM のトラブルシューティング - AWS](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/troubleshoot_iam.html)
- [AWS KMS のアクセス制御 - AWS](https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/control-access.html)
- [バケットポリシーの使用 - Amazon S3](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/bucket-policies.html)
