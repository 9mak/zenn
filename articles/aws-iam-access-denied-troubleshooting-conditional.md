---
title: "[AWS] IAM Access Deniedエラー解決ガイド #3 - 条件付きアクセス制御"
emoji: "🎯"
type: "tech"
topics: ["aws", "iam", "security", "vpc", "policy"]
published: true
publication_name: "ap_com"
published_at: 2025-01-15 12:00
---

## 🌟 はじめに

[おぐま](https://github.com/9mak)です。
本記事は「IAM Access Deniedエラー解決ガイド」シリーズの第3回です。
今回は、条件付きアクセス制御に関連するAccess Deniedエラーの解決方法について解説します。

## 📚 条件付きアクセス制御の基本

### Condition要素について

IAMポリシーのCondition要素を使用することで、きめ細かなアクセス制御が可能になります。

### 条件演算子の種類

1. 文字列演算子

- StringEquals
- StringNotEquals
- StringLike
- StringNotLike

```json
"Condition": {
    "StringEquals": {
        "aws:ResourceTag/Environment": "Production"
    },
    "StringLike": {
        "s3:prefix": ["projects/${aws:username}/*"]
    }
}
```

1. 数値演算子

- NumericEquals
- NumericNotEquals
- NumericLessThan
- NumericGreaterThan

```json
"Condition": {
    "NumericLessThan": {
        "s3:max-keys": "10"
    }
}
```

1. 日付演算子

- DateEquals
- DateNotEquals
- DateLessThan
- DateGreaterThan

```json
"Condition": {
    "DateGreaterThan": {
        "aws:CurrentTime": "2024-01-01T00:00:00Z"
    }
}
```

1. ブール演算子

- Bool

```json
"Condition": {
    "Bool": {
        "aws:MultiFactorAuthPresent": "true"
    }
}
```

### 条件キーの種類

#### 1. グローバル条件キー

全AWSサービスで使用可能な条件キー

- aws:CurrentTime
- aws:PrincipalTag
- aws:SourceIp
- aws:UserAgent
- aws:username

```json
"Condition": {
    "StringLike": {
        "aws:PrincipalTag/Department": "Engineering",
        "aws:username": "admin-*"
    }
}
```

#### 2. サービス固有の条件キー

特定のサービスでのみ使用可能な条件キー

- s3:prefix
- ec2:ResourceTag
- lambda:FunctionVersion

```json
"Condition": {
    "StringEquals": {
        "s3:RequestObjectTag/classification": "confidential",
        "ec2:ResourceTag/Project": "WebApp"
    }
}
```

### ポリシー変数の活用

ポリシー変数を使用することで、動的な値をポリシーに組み込むことができます：

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": ["s3:ListBucket", "s3:GetObject"],
            "Resource": [
                "arn:aws:s3:::company-data/${aws:username}/*",
                "arn:aws:s3:::team-data/${aws:PrincipalTag/Team}/*"
            ]
        }
    ]
}
```

よく使用される変数：

- ${aws:username}
- ${aws:userid}
- ${aws:PrincipalTag/TagKey}
- ${aws:CurrentTime}

## 💡 5つの代表的なシナリオと解決方法

### 1. タグベースのアクセス制御（ABAC）

#### エラーメッセージ例

```plaintext
User is not authorized to perform: ec2:StartInstance on resource i-1234567890abcdef0 
due to resource tag conditions
```

#### 解決手順

1. タグポリシーの確認

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "ec2:*",
            "Resource": "*",
            "Condition": {
                "StringEquals": {
                    "aws:ResourceTag/Environment": ["Production"],
                    "aws:ResourceTag/Owner": "${aws:username}"
                }
            }
        }
    ]
}
```

:::message alert
タグベースのアクセス制御は強力ですが、タグの一貫性を保つことが重要です。タグ付けのポリシーと運用ルールを明確にしましょう。
:::

2. リソースタグの確認
3. IAMユーザーのタグ確認

### 2. IP制限によるアクセス制御

#### エラーメッセージ例

```plaintext
User is not authorized to perform: s3:GetObject due to IP address restriction
```

#### 解決手順

1. IPポリシーの確認

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Deny",
            "Action": "*",
            "Resource": "*",
            "Condition": {
                "NotIpAddress": {
                    "aws:SourceIp": [
                        "203.0.113.0/24",
                        "2001:DB8::/32"
                    ]
                }
            }
        }
    ]
}
```

2. クライアントIPの確認
3. VPNやプロキシの確認

:::message alert
VPCエンドポイント経由でのアクセスの場合、SourceIpの制限は機能しません。代わりにVPCエンドポイントポリシーを使用してください。
:::

### 3. 時間帯制限

#### エラーメッセージ例

```plaintext
User is not authorized to perform action outside of allowed time window
```

#### 解決手順

1. 時間制限ポリシーの確認

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "*",
            "Resource": "*",
            "Condition": {
                "DateGreaterThan": {"aws:CurrentTime": "2024-01-01T09:00:00Z"},
                "DateLessThan": {"aws:CurrentTime": "2024-12-31T17:00:00Z"},
                "Bool": {"aws:MultiFactorAuthPresent": "true"}
            }
        }
    ]
}
```

2. タイムゾーンの確認
3. MFA認証状態の確認

### 4. VPCエンドポイントでの条件制御

#### エラーメッセージ例

```plaintext
User is not authorized to perform action through this VPC endpoint
```

#### 解決手順

1. エンドポイントポリシーの確認

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowSpecificVPCAccess",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject",
                "s3:PutObject"
            ],
            "Resource": [
                "arn:aws:s3:::my-bucket/*"
            ],
            "Condition": {
                "StringEquals": {
                    "aws:SourceVpc": "${aws:PrincipalTag/VPC}",
                    "aws:SourceVpce": "vpce-1234567890abcdef0"
                }
            }
        }
    ]
}
```

2. エンドポイントの設定確認
3. ルートテーブルの確認

### 5. 複合条件による制御

#### エラーメッセージ例

```plaintext
Access denied due to multiple condition checks
```

#### 解決手順

1. 複合条件ポリシーの確認

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
            "Resource": "arn:aws:s3:::${aws:PrincipalTag/Project}/*",
            "Condition": {
                "StringEquals": {
                    "aws:PrincipalTag/Department": "Engineering",
                    "s3:RequestObjectTag/Classification": "Internal"
                },
                "DateGreaterThan": {
                    "aws:CurrentTime": "${aws:PrincipalTag/ValidFrom}"
                },
                "Bool": {
                    "aws:MultiFactorAuthPresent": "true"
                }
            }
        }
    ]
}
```

2. 各条件の評価結果確認
3. ポリシー変数の値確認

## 📋 トラブルシューティングのベストプラクティス

1. 条件評価の確認
   - Condition要素の構文
   - 値の一致確認
   - 複数条件の論理演算

2. 環境要因の確認
   - ネットワーク設定
   - タイムゾーン設定
   - クライアント環境

3. 監査とモニタリング
   - CloudTrailログの確認
   - メトリクスの監視
   - アラートの設定

## 🎉 まとめ

条件付きアクセス制御のAccess Deniedエラーの解決には、以下の点が重要です。

1. 条件要素の正確な理解
2. 条件演算子の適切な使用
3. グローバル条件キーとサービス固有条件キーの使い分け
4. ポリシー変数の効果的な活用
5. 包括的なトラブルシューティングアプローチ

次回は、AWS IAMのトラブルシューティングツールについて詳しく解説する予定です！

## 参考リンク

- [IAM ポリシーの条件 - AWS](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/reference_policies_elements_condition.html)
- [グローバル条件キー - AWS](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/reference_policies_condition-keys.html)
- [ポリシー変数 - AWS](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/reference_policies_variables.html)
