---
title: "Pythonデコレーターで実現する効率的な共通処理のコード化"
emoji: "🚀"
type: "tech"
topics: ["Python", "Decorator", "共通処理"]
published: true
publication_name: "ap_com"
published_at: 2025-04-09 12:00
---

## 🌟 はじめに

[おぐま](https://github.com/9mak)です。  
本記事では、Pythonのデコレーターによって日常的に利用する共通処理（ロギング、実行時間の測定、キャッシュ、エラーハンドリング）をどのように効率的にコード化できるかを実験的に検証していきます。
デコレーターは関数の前後で処理を挿入できるため、個々の関数に同じコードを繰り返し記述する手間を省くとともにコード全体の可読性と保守性を高めます。

## 👷‍♂️ 事前準備

### 必要なもの

- Python3.x（3.9以上を推奨）
- 基本的なPythonの知識
- `functools`, `time`, `logging` などの標準ライブラリ

### 💻 開発環境

| ツール/環境 | バージョン |
| --- | --- |
| Python | 3.9+ |

## 📝 やったこと

ここでは、以下の4つの共通処理をデコレーターとして実装しました。

### 👉 ステップ1: ロギングのデコレーター

関数呼び出し時の引数や戻り値を自動でログ出力するデコレーターです。コード例は以下の通りです。

```python
import functools
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def log_function_call(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        logger.info(f"{func.__name__} called with args: {args}, kwargs: {kwargs}")
        result = func(*args, **kwargs)
        logger.info(f"{func.__name__} returned {result}")
        return result
    return wrapper

@log_function_call
def add(a, b):
    return a + b

# 呼び出し例
result = add(5, 7)
print("add関数の結果:", result)
```

:::details コードの詳細説明
このデコレーターは関数の呼び出し前後にログを出力することで呼び出し状況や戻り値を記録します。
`functools.wraps`を利用することで、元の関数の名前やドキュメントが失われないようにしています。
:::

### 👉 ステップ2: 実行時間測定のデコレーター

関数の実行時間を計測して、パフォーマンスのボトルネックを把握するためのデコレーターです。

```python
import time
import functools

def measure_execution_time(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        execution_time = time.time() - start_time
        print(f"{func.__name__} executed in {execution_time:.4f} seconds")
        return result
    return wrapper

@measure_execution_time
def compute_sum(n):
    return sum(range(n))

# 呼び出し例
total = compute_sum(1000000)
print("compute_sumの結果:", total)
```

:::details コードの詳細説明
このデコレーターは関数の実行前の時刻と実行後の時刻を比較し、その差から経過時間を測定します。
パフォーマンスチューニングの際に重宝します。
:::

### 👉 ステップ3: キャッシュのデコレーター

計算結果をキャッシュして、同じ引数による再計算を防ぐために標準ライブラリの`functools.lru_cache`を利用しています。

```python
import functools

@functools.lru_cache(maxsize=128)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# 呼び出し例
print("fibonacci(10):", fibonacci(10))
```

:::details コードの詳細説明
`lru_cache`は、関数の呼び出し結果を内部キャッシュに保存することで同一引数での再計算を防ぎ、特に再帰的な計算などで大幅なパフォーマンス改善を実現します。
:::

### 👉 ステップ4: エラーハンドリングのデコレーター

関数実行中に例外が発生した場合に、それをキャッチしてエラーメッセージを出力するデコレーターです。

```python
import functools

def handle_exceptions(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            print(f"Error in {func.__name__}: {e}")
            return None
    return wrapper

@handle_exceptions
def divide(a, b):
    return a / b

# 呼び出し例
print("divide(10, 2):", divide(10, 2))
print("divide(10, 0):", divide(10, 0))
```

:::details コードの詳細説明
このデコレーターはtry-except構文を用いて関数内で発生した例外をキャッチし、エラー発生時には適切なメッセージを出力して処理を継続できるようにしています。
:::

## 🎨 実行結果

各デコレーターを適用した場合の実行結果例は以下の通りです。

```plaintext
INFO:__main__:add called with args: (5, 7), kwargs: {}
INFO:__main__:add returned 12
add関数の結果: 12

compute_sum executed in 0.0050 seconds
compute_sumの結果: 499999500000

fibonacci(10): 55

divide(10, 2): 5.0
Error in divide: division by zero
divide(10, 0): None
```

## 🤔 考察

デコレーターを活用すると複数の関数に同じ前後処理を容易に適用できるため、共通処理のコード重複を避けられます。  
・**ロギング**：関数呼び出しのトレースが自動的に行われ、デバッグや監視に役立ちます。  
・**実行時間測定**：パフォーマンス解析のための計測がシンプルに実装できます。  
・**キャッシュ**：計算済み結果の保存で、重複計算を回避し高速化を実現します。  
・**エラーハンドリング**：例外発生時の安全なエラーメッセージ出力が可能です。

> 重要な気づき：共通処理をデコレーターに分離することで各関数の本来のロジックがシンプルになり、保守性と再利用性が大幅に向上することが再確認できました。

## 🎉 まとめ

今回の記事では、Pythonのデコレーターを用いてロギング、実行時間計測、キャッシュ、エラーハンドリングといった共通処理を効率的にコード化する方法を解説しました。  

これらのデコレーターは、実際のプロジェクトにおいてコードの保守性の向上やデバッグ、パフォーマンス改善に大いに役立つと思います。
今後の開発で積極的に活用してみてください。

:::message alert
各デコレーターの実装例は基本的なものです。
プロジェクトの要件に応じて、より複雑な処理やエラーチェックを追加することを検討してください。
:::

## 💡 補足

:::details トラブルシューティング

- **問題**: デコレーターを適用した際に元の関数名やドキュメントが失われる  
  **解決策**: `functools.wraps`を必ず使用する
- **問題**: ロギング出力が確認できない  
  **解決策**: `logging.basicConfig`で適切なログレベルが設定されているか確認する

:::
