---
title: "Pythonデコレーター入門：概要から具体例まで"  
emoji: "📖"  
type: "tech"  
topics: ["Python", "Decorator", "プログラミング"]  
published: false  
publication_name: "ap_com"  
published_at: 2025-04-02 12:00  
---

## 🌟 はじめに

[おぐま](https://github.com/9mak)です。  
本記事ではPythonのデコレーターについて基本的な概念から具体的なコード例、実行順序の詳細な説明および実行結果を通してその仕組みや活用方法を詳しく解説します。
実際の利用例を確認することでデコレーターの理解がより一層深まるでしょう。

:::message
このチュートリアルは、Pythonの基本が理解できている中級者向けです。所要時間は約10分程度です。
:::

## 👷‍♂️ 事前準備

以下の環境とツールをご用意ください。

### 💻 開発環境

| 項目                 | 要件           |
| -------------------- | -------------- |
| Python               | 3.8以上        |
| テキストエディタ/IDE | VSCode（推奨） |

## 📖 ステップバイステップ

### 👉 ステップ1: Pythonデコレーターの基本を理解する

デコレーターは、関数やメソッドの挙動を変更・拡張するための「ラッパー関数」です。  
元の関数のコードを修正することなく、共通処理（例: ログ出力、実行時間の計測）を追加できるためコードの再利用性や保守性が向上します。

**実行順序:**  

- デコレーターが適用された時点で対象関数がラップされ、関数呼び出し時にラッパー関数内の処理が実行されます。  
- 例えば、以下の例では、関数呼び出し時に`null_decorator`によりそのままの処理が行われます。

```python
def null_decorator(func):
    # 何も変更せず、元の関数をそのまま返す
    return func

@null_decorator
def greet(name):
    return f"こんにちは、{name}さん！"

print(greet("太郎"))
# 出力: こんにちは、太郎さん！
```

### 👉 ステップ2: シンプルなデコレーターの作成

次は、関数の実行前後にメッセージを表示するデコレーターを実装します。

**実行順序と期待されるレスポンス:**  

1. `say_hello("花子")`が呼び出されるとまず`wrapper`関数が実行され「関数実行前」が表示されます。  
2. その後、元の`say_hello`が実行され、「こんにちは、花子さん！」が表示されます。  
3. 最後に「関数実行後」が表示されます。

```python
def print_decorator(func):
    def wrapper(*args, **kwargs):
        print("関数実行前")  # 前処理
        result = func(*args, **kwargs)  # 元の関数を実行
        print("関数実行後")  # 後処理
        return result
    return wrapper

@print_decorator
def say_hello(name):
    print(f"こんにちは、{name}さん！")

say_hello("花子")
# 出力:
# 関数実行前
# こんにちは、花子さん！
# 関数実行後
```

### 👉 ステップ3: 実行時間を計測するデコレーター

関数の実行時間を計測するためのデコレーターも有用です。

**実行順序と期待されるレスポンス:**  

1. `sample_task(1)`が実行されると、`timer_decorator`の`wrapper`が開始され、`start_time`に現在時刻を記録します。  
2. 次に`sleep`関数で1秒待機した後、"処理完了"が返されます。  
3. 関数終了後、`end_time`を記録し、差分を計算して実行時間を表示します。

```python
import time

def timer_decorator(func):
    def wrapper(*args, **kwargs):
        start_time = time.time()  # 実行前の時刻を記録
        result = func(*args, **kwargs)  # 関数実行
        end_time = time.time()  # 実行後の時刻を記録
        print(f"{func.__name__}の実行時間: {end_time - start_time:.4f}秒")
        return result
    return wrapper

@timer_decorator
def sample_task(duration):
    time.sleep(duration)
    return "処理完了"

print(sample_task(1))
# 出力例:
# sample_taskの実行時間: 1.0012秒
# 処理完了
```

### 👉 ステップ4: 複数のデコレーターを適用する

複数のデコレーターをスタックして適用する場合、適用順序に注意が必要です。  
以下の例では、まず大文字変換デコレーター、次に文字列分割デコレーターが適用されます。

**実行順序と期待されるレスポンス:**  

1. `say_hi`が最初に`uppercase_decorator`により大文字に変換され、"HELLO WORLD"となります。  
2. 次に`split_decorator`が適用され、文字列がスペースで分割されて`['HELLO', 'WORLD']`となります。

```python
def uppercase_decorator(func):
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)  # "hello world"を取得
        return result.upper()  # 大文字に変換
    return wrapper

def split_decorator(func):
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)  # 大文字変換済みの文字列を受け取る
        return result.split()  # スペースで分割
    return wrapper

@split_decorator
@uppercase_decorator
def say_hi():
    return "hello world"

print(say_hi())
# 出力:
# ['HELLO', 'WORLD']
```

## ⚠️ 補足・注意事項

:::message

- **名称についての慣習**  
  - **内部関数の名称:**  
    デコレーター内の「ラッパー関数」の名称としてよく使われるのは `wrapper` です。これはあくまで一般的な慣習であり、必ずしも `wrapper` という名前でなければならないわけではありません。  
  - **元の関数を受け取る引数:**  
    ラッパー関数内で呼び出される元の関数は、一般的に `func` や `wrapped` といった名称が用いられますが、こちらも任意の名称で問題ありません。重要なのはコードの意味が明確になるように名前を選ぶことです。  
  - **引数の命名:**  
    可変長引数は `*args` と `**kwargs` を使うのが慣例ですが、これも固定のルールではなく、異なる名前を用いることも可能です。ただし、多くの開発者がこれらの名称に慣れているため、チームやプロジェクト内で統一性を持たせることが望ましいです。

:::

:::message alert

- **ドキュメンテーションの保持:**  
  複数のデコレーターを使う場合、元の関数の名前やドキュメントが失われることがあります。その際は、`functools.wraps` を利用して元の関数の情報を維持してください。

- **デバッグ時の注意:**  
  デコレーターのスタックが深くなると処理の流れが複雑になる可能性があります。各デコレーターがどのように関数に影響を与えているか、十分に把握することが重要です。

- **実行順序:**  
  複数のデコレーターを適用する際には、記述の順序が実行順序に直接影響します。意図した動作になるよう、適用順序をしっかり確認してください。

- **パフォーマンス:**  
  不必要なラッパーを積み重ねると、オーバーヘッドが発生する可能性があります。必要な処理だけを実装するよう心がけましょう。

:::

## 🎉 まとめ

本記事では、Pythonデコレーターの基本的な概念から具体例、実行される際の順序とレスポンスについて詳細に解説しました。  
この記事が、Pythonデコレーターの理解と実践にお役立ていただけることを願っています。

1回学んだことでも使わないとやっぱり忘れちゃいますね。。
