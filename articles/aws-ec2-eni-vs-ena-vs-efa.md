---
title: "[勉強ログ]AWS EC2 ENI vs ENA vs EFA"
emoji: "👊"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["AWS","EC2"]
published: true
publication_name: "ap_com"
---

どうも！

[AWS Certified SysOps Administrator - Associate(SOA)](https://aws.amazon.com/jp/certification/certified-sysops-admin-associate/)の資格試験に2回落ちて立ち直れない28歳です。

立ち直れないのでZennで記事書きながら勉強して隠密再受験しようと思ってます😩

基本的に[Udemyのコース](https://www.udemy.com/share/101XFw3@JbpJaY5drC3-tkjgXdXy9Vx3uxfxvdYIhs_3D_ESMpSyG3MknOEjPlp6qc2nTCtD/)に沿って、気持ち改め資格試験のためだけの勉強ではなく、ちゃんと身につけて業務に活かすための勉強をしようと思います。  
普段AWS触っている身として聞いたことないわ！とかすぐ忘れそうだな、っていうのを残していければいいと思いますよろしくお願いしますというところでさっそく。

## ENIとENAとEFA

EC2では、Elastic Network Interface (ENI)、Enhanced Network Adapter (ENA)、Elastic Fabric Adapter (EFA) という3つのネットワーク機能が提供されています。

ENI、ENA、EFAはすべて、EC2インスタンスにアタッチする"機能"であり、それぞれが独立した"サービス"ではないです。

### 特徴

それぞれの特徴まとめました。

|  機能 | 特徴 |
|:----------------:|:------------|
| ENI | すべてのEC2インスタンスで基本的なネットワーク接続を提供。複数のENIをアタッチすることで、ネットワーク分離やサブネット間のルーティングなども可能。 |
| ENA | 特定のインスタンスタイプで使える。より高いネットワークパフォーマンスを提供。大量のネットワークトラフィックや大規模な分散コンピューティングタスクに向いてる。 |
| EFA | 特定のインスタンスタイプで使える。非常に高いネットワークパフォーマンスを提供。高性能コンピューティング（HPC）や機械学習ワークロードに最適。 |

:::message
とりあえずENI👉ENA👉EFAの順番ですごいって理解。
:::

### 注意点

それぞれの注意点まとめました。

|  機能 | 注意点 |
|:----------------:|:------------|
| ENI | アタッチできるENIの数はインスタンスタイプによりけり。|
| ENA | 特定のEC2インスタンスタイプでのみ使える。ENAを有効にするためには、インスタンスやAMI（Amazon Machine Image）がENAサポートを有効にしている必要がある。|
| EFA | 特定のEC2インスタンスタイプでのみ使える。EFAを使用するためには、専用のEFA用のOSイメージが必要で、その上で特定のドライバとライブラリをインストールする必要がある。|

:::message
ENI👉ENA👉EFAの順番で設定するのがめんどくさいっぽい。
:::

### ネットワークパフォーマンスについて

ネットワークパフォーマンスが高いってなんとなくはわかるけど具体的に何が何でどんな時か調べました。

| 項目 | 説明 | パフォーマンスが高い時 |
|---|---|---|
| 帯域幅 | ネットワークが一度に転送できるデータ量 | 高(多) |
| スループット | ネットワークが一定時間に転送できるデータ量 | 高(多) |
| レイテンシ | データがネットワークを通過する際にかかる時間 | 低(短) |
| ジッター | データの到着時間のばらつき | 低(少) |
| 損失率 | ネットワークを通過する際に失われたデータの割合 | 低(少) |

:::message
ネットワークパフォーマンスが高い場合、ネットワークは一度に多くのデータを転送でき、データの到着時間も短く、データの損失も少ないってことですな。
:::

## ENIの設定と確認方法

### ENI - 設定方法

※ENIをアタッチするEC2がある前提

1. AWSマネジメントコンソールからEC2ダッシュボードを開きます。
2. 左側のパネルから「ネットワークとセキュリティ」セクションの「ネットワークインターフェース」を選択します。
3. 「ネットワークインターフェースの作成」ボタンをクリックします。
4. 必要な詳細（サブネット、セキュリティグループなど）を入力し、「作成」をクリックします。
5. 「ネットワークインターフェース」ページに戻り、作成したENIを右クリックして「アクション」>「インスタンスに接続」を選択します。
6. 接続するインスタンスを選択し、「接続」をクリックします。

### ENI - 確認方法

1. AWSマネジメントコンソールからEC2ダッシュボードを開きます。
2. 左側のパネルから「インスタンス」を選択します。
3. 対象のインスタンスを選択し、下部の「詳細」タブを開きます。
4. 「ネットワークインターフェース」セクションを確認し、アタッチされたENIとその詳細を確認します。

## ENAの設定と確認方法

### ENA - 設定方法

1. インスタンスがENAをサポートしているかを確認します。これはAWS公式ドキュメンテーションから確認できます。
2. AWS CLIまたはSDKを使用して、インスタンスまたはAMIがENAをサポートするように設定します。たとえば、以下のAWS CLIコマンドを使用できます。

```sh
aws ec2 modify-instance-attribute --instance-id instance_id --ena-support
```

ここで`instance_id`は対象のインスタンスIDに置き換えます。
ちなみにEC2インスタンスが"stopped"じゃないとコマンド打ってもエラーになるので停止できないけど確認したいって時は、EC2インスタンスに接続してから以下コマンドを打つと黄色枠のように"ena"と表示されます。
![ena_enable](/images/aws-ec2-eni-vs-ena-vs-efa/ena_enable.png)

### ENA - 確認方法

ENAのサポートは、AWS CLIまたはSDKを使用して確認できます。たとえば、以下のAWS CLIコマンドを使用できます。

```sh
aws ec2 describe-instances --instance-ids instance_id --query "Reservations[].Instances[].EnaSupport"
```

ここで`instance_id`は対象のインスタンスIDに置き換えます。

:::message
自環境でENAサポート有効化されているEC2のインスタンスIDに対して上記コマンド打ったら"true"とだけ出ました。そっけないw
:::

また、EC2インスタンス起動時の画面でも確認できました！
![ena_true](/images/aws-ec2-eni-vs-ena-vs-efa/ena_true.png)

## EFAの設定と確認方法

### EFA - 設定方法

1. EFAをサポートするインスタンスタイプを使用してインスタンスを作成します。
2. インスタンスを作成するときに、ネットワークインターフェースの「Elastic Fabric Adapter」オプションを有効にします。
3. 必要な場合は、EFA用のセキュリティグループを作成します。
4. インスタンスが起動したら、EFA用の特定のドライバとライブラリをインストールします。

### EFA - 確認方法

EFAの設定は、インスタンスのOSから確認できます。以下のコマンドを実行すると、EFAインターフェースが存在するかどうかを確認できます。

```sh
ls -l /sys/class/infiniband/
```

このコマンドは、EFAインターフェースが存在するときに出力を生成します。

## まとめ

AWS EC2におけるENI、ENA、EFAの3つのネットワーク機能について詳しく解説しました。
が、マイナーすぎてENAとかEFAは試験でなそうです😇

それでもEC2のパフォーマンス拡張の手段の一つとして覚えました！
次はEC2のプレイスメントグループやります。
