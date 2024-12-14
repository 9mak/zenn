---
title: "[AWS] IAM Access Deniedエラー解決ガイド #4 - トラブルシューティングツール解説"
emoji: "🔧"
type: "tech"
topics: ["aws", "iam", "security", "cloudtrail", "aws-config"]
published: false
publication_name: "ap_com"
published_at: 2025-01-15 12:00
---

## 🌟 はじめに

[おぐま](https://github.com/9mak)です。
「IAM Access Deniedエラー解決ガイド」シリーズの最終回として、AWS IAMのトラブルシューティングに使用できる各種ツールについて解説します。

## 📚 トラブルシューティングツールの概要

AWS IAMのトラブルシューティングには、以下の主要なツールが利用できます：

1. IAM Policy Simulator
2. IAM Access Analyzer
3. CloudTrail
4. AWS Config
5. CloudWatch Logs Insights

## 💡 主要ツールと活用方法

### 1. IAM Policy Simulator

#### 概要

ポリシーの効果をテストできるツールです。実際の環境に影響を与えることなく、権限の検証が可能です。

#### 使用方法

1. AWSマネジメントコンソールでのアクセス

```plaintext
IAM > Access Analyzer > Policy Simulator
```

2. AWS CLIでの実行

```bash
aws iam simulate-principal-policy \
    --policy-source-arn arn:aws:iam::123456789012:user/test-user \
    --action-names s3:PutObject \
    --resource-arns arn:aws:s3:::my-bucket/*
```

#### 主なユースケース

- 新しいポリシーのテスト
- 既存のポリシーの確認
- 権限の範囲の検証

:::message alert
Policy Simulatorは、リソースベースのポリシーとの相互作用や一部の条件付きチェックには制限があります。
:::

### 2. IAM Access Analyzer

#### 概要

セキュリティの問題を自動的に特定し、詳細な分析を提供するツールです。

#### 主な機能

1. ポリシーの生成と検証
2. 外部アクセスの分析
3. 未使用のアクセス権限の分析

#### 未使用のアクセス分析

1. 最終アクセス情報の確認

```json
{
    "ActionLastUsed": [
        {
            "ActionName": "s3:PutObject",
            "LastUsedDate": "2024-11-01T10:00:00Z",
            "LastUsedRegion": "ap-northeast-1"
        },
        {
            "ActionName": "s3:GetObject",
            "LastUsedDate": "2024-12-01T15:30:00Z",
            "LastUsedRegion": "ap-northeast-1"
        },
        {
            "ActionName": "s3:ListBucket",
            "LastUsedDate": null,
            "LastUsedRegion": null
        }
    ]
}
```

2. AWS CLIでの分析

```bash
aws iam generate-service-last-accessed-details \
    --arn arn:aws:iam::123456789012:role/example-role
```

3. 推奨ポリシーの生成

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject"
            ],
            "Resource": "arn:aws:s3:::my-bucket/*"
        }
    ]
}
```

#### ベストプラクティス

1. 定期的なアクセスレビュー
   - 90日以上未使用の権限の特定
   - 不要な権限の削除
   - アクセスパターンの分析

2. セキュリティ強化
   - 最小権限の原則の適用
   - 使用頻度に基づく権限の最適化
   - リスク評価の実施

### 3. CloudTrail

#### 概要

AWSアカウントのアクティビティを記録し、監査するためのサービスです。

#### 主な調査項目

1. イベントの詳細確認

```json
{
    "eventVersion": "1.08",
    "userIdentity": {
        "type": "IAMUser",
        "principalId": "AIDAXXXXXXXXXXXXXXXX",
        "arn": "arn:aws:iam::123456789012:user/test-user",
        "accountId": "123456789012",
        "userName": "test-user"
    },
    "eventTime": "2024-12-25T12:00:00Z",
    "eventSource": "s3.amazonaws.com",
    "eventName": "PutObject",
    "errorCode": "AccessDenied",
    "errorMessage": "Access Denied"
}
```

2. CloudWatch Logs Insightsでの分析

```sql
fields @timestamp, @message
| filter errorCode = 'AccessDenied'
| stats count(*) by eventName, userIdentity.userName
| sort count(*) desc
| limit 20
```

### 4. AWS Config

#### 概要

AWSリソースの設定を評価、監査、および評価するためのサービスです。

#### 主な設定ルール

1. IAM関連ルール

```json
{
    "ConfigRuleName": "iam-policy-compliance",
    "Description": "Checks IAM policies for compliance",
    "Scope": {
        "ComplianceResourceTypes": [
            "AWS::IAM::Policy",
            "AWS::IAM::Role",
            "AWS::IAM::User"
        ]
    },
    "Source": {
        "Owner": "AWS",
        "SourceIdentifier": "IAM_POLICY_BLACKLISTED_CHECK"
    }
}
```

2. 自動修復アクション

```json
{
    "AutomationAssumeRole": "arn:aws:iam::123456789012:role/AutomationRole",
    "Parameters": {
        "AutomationActionName": "AWS-DisableIAMUser",
        "UserName": "non-compliant-user"
    }
}
```

### 5. CloudWatch Logs Insights

#### 高度なクエリ例

1. エラーパターンの分析

```sql
fields @timestamp, userIdentity.userName, eventName, errorMessage
| filter errorCode = "AccessDenied"
| stats 
    count(*) as errorCount,
    earliest(@timestamp) as firstSeen,
    latest(@timestamp) as lastSeen
by userIdentity.userName, eventName
| sort errorCount desc
```

2. 時系列トレンド分析

```sql
fields @timestamp, eventName
| filter errorCode = "AccessDenied"
| stats 
    count(*) as errorCount,
    count_distinct(userIdentity.userName) as uniqueUsers
by bin(1h)
| sort @timestamp desc
```

## 📋 包括的なトラブルシューティング戦略

1. 予防的アプローチ
   - IAM Access Analyzerの定期的な実行
   - 未使用権限の定期的なレビュー
   - アクセスパターンの分析

2. 問題発生時の対応
   - CloudTrailログの即時確認
   - Policy Simulatorでの検証
   - アクセス分析の実施

3. 継続的な改善
   - ポリシーの最適化
   - モニタリングの強化
   - 自動化の導入

## 🎉 まとめ

効果的なIAMトラブルシューティングには、以下の要素が重要です：

1. 適切なツールの選択と活用
   - IAM Policy Simulator
   - IAM Access Analyzer
   - CloudTrail
   - AWS Config
   - CloudWatch Logs Insights

2. 体系的なアプローチ
   - 予防的な監視
   - 迅速な問題特定
   - 効果的な解決

3. 継続的な改善
   - 定期的なレビュー
   - ベストプラクティスの適用
   - 自動化の推進

このシリーズを通じて、AWS IAMのAccess Deniedエラーに関する理解が深まり、より効果的なトラブルシューティングが可能になれば幸いです。

## 参考リンク

- [IAM Policy Simulator - AWS](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/access_policies_testing-policies.html)
- [IAM Access Analyzer - AWS](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/what-is-access-analyzer.html)
- [AWS CloudTrail - AWS](https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/cloudtrail-user-guide.html)
- [AWS Config - AWS](https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/WhatIsConfig.html)
