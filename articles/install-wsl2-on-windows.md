---
title: "[Windows] 新しくPC買ったのでWSL2を導入してみる"
emoji: "🐧"
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["WSL2", "Windows", "Linux", "開発環境"] # 記事に関連するトピックをここに入力
published: false
publication_name: "ap_com"
published_at: 2024-09-29 13:00
---

## 🌟 はじめに

おぐまです。

WindowsでLinux環境を使いたいけど、仮想マシンは重いし面倒...そんな悩みを抱えている方に朗報です！この記事では、Windows 10と11に**WSL2**（Windows Subsystem for Linux 2）を導入する方法と、インストールの確認方法について詳しく解説します🌜

WSL2を使えば、Windowsの快適さとLinuxの開発環境の両方を手に入れられます。このチュートリアルを通じて、クリーンで効率的な開発環境を構築しましょう。

## 🐧 WSLとは

WSL（Windows Subsystem for Linux）は、**Windows上でLinuxのコマンドラインツールやGUIアプリケーションを直接実行できる**ようにする機能です。
WSL2は、WSLの改良版でより本格的なLinux環境をWindows上で実現します。

WSL2では、本物のLinuxカーネル（Linuxの中核部分）を使用しているため、より多くのLinuxソフトウェアが動作し性能も向上しています。
つまり、WindowsパソコンでLinuxの機能をより完全により高速に使えるようになっています👍

https://docs.microsoft.com/ja-jp/windows/wsl/about
https://docs.microsoft.com/ja-jp/windows/wsl/compare-versions

## 👷‍♂️ 事前準備

WSL2を導入する前に、以下の点を確認しておきましょう：

- Windows 10（バージョン2004以降）またはWindows 11
- 管理者権限を持つアカウント
- インターネット接続

### 💻 開発環境

- Windows 10/11
- PowerShell（管理者権限で実行）

## 📖 導入ガイド

### 👉 ステップ1: WSLの有効化

1. 管理者権限でPowerShellを開きます
2. 以下のコマンドを実行してWSLを有効化します：

```powershell
wsl --install
```

3. インストールが完了したら、ユーザー名とパスワードの設定を求められます。これらを設定してください。

:::message
既定では、インストールされる Linux ディストリビューションは Ubuntu です！
1. 利用可能なLinuxディストリビューションを確認するには、以下のコマンドを実行します：

```powershell
wsl --list --online
```
![コマンド実行結果](/images/install-wsl2-on-windows/wsl-list.png)

2. 好みのディストリビューションを選択してインストールします。例えば、Debianをインストールする場合：

```powershell
wsl --install -d Debian
```
:::

### 👉 ステップ2: WSL2を既定のバージョンに設定

1. 再度管理者権限でPowerShellを開きます
2. 以下のコマンドを実行してWSL2を既定のバージョンに設定します：

```powershell
wsl --set-default-version 2
```

![コマンド実行結果](/images/install-wsl2-on-windows/wsl-set-default-version2.png)

WSL2を既定のバージョンに設定することで、新しくインストールするLinuxシステムが自動的にWSL2を使用するようになります。

### 👉 ステップ3: インストールの確認

1. PowerShellで以下のコマンドを実行して、インストールされたディストリビューションを確認します：

```powershell
wsl --list --verbose
```

![コマンド実行結果](/images/install-wsl2-on-windows/wsl-list-verbose.png)

2. 出力に選択したディストリビューション（例：Ubuntu）が表示され、バージョンが2になっていることを確認しましょう

### 💡 ヒントとトラブルシューティング

- WSLのインストールに問題がある場合は、Windows Updateを実行して最新の状態にしてください
- 仮想化が有効になっていない場合は、BIOSの設定で有効にする必要があります。以下の手順で行いましょう：

1. PCを再起動し、起動時にBIOS設定画面に入ります（通常、F2、Del、またはF12キーを押します）
2. BIOS設定画面で、「Advanced」や「Configuration」などのメニューを探します
3. 「Virtualization Technology」、「Intel VT-x」、または「AMD-V」という項目を探し、有効（Enabled）に設定します
4. 変更を保存してBIOS設定を終了し、PCを再起動します

https://support.microsoft.com/ja-jp/windows/windows-10-での-仮想化の有効化-c5e6851a-7713-1e35-f233-b3e8dce87c94

## 🎉 まとめ

これで、Windows 10/11にWSL2を導入し、選択したLinuxディストリビューションをインストールすることができました。
次のステップとして、VSCodeのRemote Development拡張機能を使ってWSL2と連携させたり、DockerやNode.jsなどの開発ツールをWSL2内にインストールしてみるのもおすすめです。

WSL2を使うことで、Windowsをクリーンに保ちながら、標準的なLinux開発環境を手に入れることができます。
これにより、Windowsに直接開発ツールをインストールすることによる予期せぬエラーを回避しより安定した開発環境を構築できるでしょう。