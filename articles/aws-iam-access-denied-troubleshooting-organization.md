---
title: "[AWS] IAM Access Deniedエラー解決ガイド #2 - 組織レベルのアクセス制御"
emoji: "🏢"
type: "tech"
topics: ["aws", "iam", "scp", "organizations", "security"]
published: false
publication_name: "ap_com"
published_at: 2025-01-01 12:00
---

## 🌟 はじめに

[おぐま](https://github.com/9mak)です。
本記事は「IAM Access Deniedエラー解決ガイド」シリーズの第2回です。
今回は、組織レベルでのアクセス制御に関連するAccess Deniedエラーの解決方法について解説します。

## 📚 組織レベルのアクセス制御の基本

### アクセス制御の階層

AWS Organizationsを使用する環境では、以下の階層でアクセス制御が行われます：

1. SCP（Service Control Policy）
2. パーミッションバウンダリー
3. IAMポリシー
4. リソースベースのポリシー

## 💡 5つの代表的なシナリオと解決方法

### 1. SCP（Service Control Policy）による制限

#### エラーメッセージ例

```plaintext
User is not authorized to perform: ec2:StartInstance because an explicit deny 
in a service control policy
```

#### よくある原因

1. リージョン制限のSCP
2. サービス制限のSCP
3. タグベースの制限
4. 予算関連の制限

#### 解決手順

1. 適用されているSCPの確認

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "DenyAllOutsideJP",
            "Effect": "Deny",
            "Action": "*",
            "Resource": "*",
            "Condition": {
                "StringNotEquals": {
                    "aws:RequestedRegion": ["ap-northeast-1"]
                }
            }
        }
    ]
}
```

:::message alert
SCPは組織の管理者権限が必要です。変更する際は、組織のセキュリティポリシーに従って慎重に行ってください。
:::

2. SCP階層の確認

- 組織ルート
- OU（Organizational Unit）
- アカウントレベル

3. 回避策の検討

- 許可されたリージョンでの実行
- 必要なタグの付与
- 予算制限の確認

### 2. パーミッションバウンダリーによる制限

#### エラーメッセージ例

```plaintext
User: arn:aws:iam::123456789012:user/username is not authorized to perform: 
iam:CreateRole because this would violate the permissions boundary
```

#### 解決手順

1. パーミッションバウンダリーの確認

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:*",
                "cloudwatch:*"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Deny",
            "Action": [
                "iam:*",
                "organizations:*"
            ],
            "Resource": "*"
        }
    ]
}
```

2. 境界の制限事項確認

- 許可されているサービス
- 拒否されているアクション
- リソース制限

3. 必要に応じた境界の見直し

### 3. AWS SSO（IAM Identity Center）関連

#### エラーメッセージ例

```plaintext
User is not authorized to access AWS account with SSO
```

#### 解決手順

1. アクセス権限セットの確認

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ec2:Describe*",
                "ec2:List*"
            ],
            "Resource": "*"
        }
    ]
}
```

2. グループ割り当ての確認

- ユーザーのグループメンバーシップ
- グループの権限セット
- アカウントへのアクセス設定

3. セッション設定の確認

- セッション期間
- MFAの要件
- IPアドレス制限

### 4. AWS RAM（Resource Access Manager）関連

#### エラーメッセージ例

```plaintext
Access denied: Resource sharing permission not found for resource: resource-arn
```

#### 解決手順

1. リソース共有設定の確認

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::123456789012:root"
            },
            "Action": [
                "ram:AcceptResourceShareInvitation",
                "ram:RejectResourceShareInvitation"
            ],
            "Resource": "*"
        }
    ]
}
```

2. 共有設定の要件確認

- 組織内共有の有効化
- アカウント間の信頼関係
- リソースタイプの制限

3. 共有オプションの設定

- 外部共有の許可
- 組織内共有の制限
- タグベースの共有制限

### 5. リソース所有権の問題

#### エラーメッセージ例

```plaintext
User is not authorized to perform: ec2:AttachVolume on resource: 
volume-id belonging to account: 123456789012
```

#### 解決手順

1. リソース所有権の確認

- リソースの所有アカウント
- クロスアカウント権限
- 組織内の権限委譲

2. クロスアカウントアクセスの設定

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::123456789012:role/cross-account-role"
            },
            "Action": [
                "ec2:AttachVolume",
                "ec2:DetachVolume"
            ],
            "Resource": "*"
        }
    ]
}
```

:::message alert
クロスアカウントアクセスを設定する際は、最小権限の原則に従い必要最小限の権限のみを付与してください。
:::

## 📋 トラブルシューティングのベストプラクティス

1. 権限の階層的な確認

- SCPレベル
- パーミッションバウンダリーレベル
- IAMポリシーレベル
- リソースポリシーレベル

2. 組織設定の確認

- 組織の機能設定
- OUの構造
- 共有設定

3. セキュリティベストプラクティス

- 最小権限の原則
- 定期的な権限レビュー
- 監査ログの確認

## 🎉 まとめ

組織レベルのAccess Deniedエラーの解決には、以下の点が重要です：

1. 権限の階層構造の理解
2. 各制御メカニズムの特徴把握
3. セキュリティベストプラクティスの遵守
4. 適切な権限設定の実装

次回は、条件付きアクセス制御に関連するAccess Deniedエラーについて解説する予定です！

## 参考リンク

- [AWS Organizations のSCP - AWS](https://docs.aws.amazon.com/ja_jp/organizations/latest/userguide/orgs_manage_policies_scps.html)
- [IAM パーミッションバウンダリー - AWS](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/access_policies_boundaries.html)
- [AWS IAM Identity Center - AWS](https://docs.aws.amazon.com/ja_jp/singlesignon/latest/userguide/what-is.html)
