---
title: "Route53のクエリログの見方調べてみた"
emoji: "🖊️"
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["AWS", "Route53", "DNS", "クエリログ", "ログ分析"] # 記事に関連するトピックをここに入力
published: true
publication_name: "ap_com"
published_at: 2024-04-10 12:00
---

## 🌟 はじめに

おぐまです。

今回はAWS Route53のクエリログで表示される項目とそれぞれの意味、さらに最新のログ構造についても見ていきます！
DNSクエリログを分析することで、セキュリティの向上、トラブルシューティングの効率化にもつながります。

Route53をより深く理解し、効果的に活用する一助となれば幸いです🚀

## 📖 Route53クエリログの必要性

DNSクエリログはドメインに対する全てのDNSクエリの記録です。
これを分析することでどのドメインがどれだけの頻度で問い合わせられているか、また不正なアクセスや異常なパターンがないかなど監視できます。

### クエリログの活用方法

- セキュリティ監視：不審なドメインへの問い合わせを検出
- パフォーマンス分析：使用頻度の高いドメインへの応答時間の最適化
- トラブルシューティング：解決されないDNSクエリの原因究明

## 📋 クエリログの見方と最新のログデータ構造

ここではログの基本的な見方と、最新バージョンであるVer1.1におけるログデータの構造について紹介します。

### ログデータの構造（バージョン1.1）

ログデータはJSON形式で保存され、以下のような情報が含まれます。

```json
{
  "srcaddr": "4.5.64.102", // クエリの発信元であるインスタンスのIPアドレス
  "vpc_id": "vpc-7example", // クエリが発信されたVPCのID
  "answers": [ 
      {
          "Rdata": "203.0.113.9", // クエリに応答してResolverが返した値
          "Type": "PTR", // Resolverがクエリに応答して返す値のDNSレコードタイプ 
          "Class": "IN" // クエリに対するResolverからの応答クラス
      }
  ],
  "firewall_rule_group_id": "rslvr-frg-01234567890abcdef", // クエリ内のドメイン名と一致したDNSFirewallルールグループのID
  "firewall_rule_action": "BLOCK", // クエリ内のドメイン名に一致したルールが指定しているアクション
  "query_name": "15.3.4.32.in-addr.arpa.", // クエリで指定されたドメイン名(example.com)またはサブドメイン名(www.example.com)
  "firewall_domain_list_id": "rslvr-fdl-01234567890abcdef",  // クエリ内のドメイン名に一致したルールによって使用されるドメインリスト
  "query_class": "IN", // クエリのクラス
  "srcids": { // instance, resolver_endpoint, resolver_network_interface
      "instance": "i-0d15cd0d3example" // クエリの発信元であるインスタンスのID
  },
  "rcode": "NOERROR", // DNSクエリに応答してResolverが返したDNS応答コード
  "query_type": "PTR", // リクエストで指定されたDNSレコードタイプ、またはANY
  "transport": "UDP", // DNSクエリを送信するために使用されたプロトコル
  "version": "1.100000", // クエリログ形式のバージョン番号。現在のバージョンは 1.1
  "account_id": "111122223333", // VPCを作成したAWSアカウントのID
  "srcport": "56067", // クエリの発信元であるインスタンスのポート
  "query_timestamp": "2021-02-04T17:51:55Z", // クエリが送信された日時をISO8601形式の協定世界時(UTC)
  "region": "us-east-1" // VPCを作成したAWSリージョン
}
```

**【その他】**
`resolver_endpoint`: DNSクエリをオンプレミスDNSサーバーに渡すリゾルバーエンドポイントのID

`additional_properties`: ログ配信イベントの追加情報。**is_delayed** = ログの配信に遅延がある場合

:::message
Route53クエリログの例は以下公式のログを引用しています。
:::
https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/resolver-query-logs-example-json.html

## 🎉 まとめ

AWS Route53のクエリログの最新の構造を理解し、適切に分析できることでエラー調査がしやすくなります。
今回紹介した基本的なログの見方だけでも覚えておきたいです！(願望)

## 💡補足

より詳細な情報については、AWSの公式ドキュメントを参照してください。

- [Route53クエリログのフォーマット](https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/resolver-query-logs-format.html)
