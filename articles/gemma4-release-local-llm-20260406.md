---
title: "Gemma 4がリリース！ローカルLLM勢に嬉しい話"
emoji: "💎"
type: "tech"
topics: ["gemma", "llm", "ollama", "localllm", "google"]
published: true
publication_name: "ap_com"
published_at: "2026-04-06 12:00"
---

## 🚀 はじめに

[おぐま](https://github.com/9mak)です。

Google が 2026年4月2日に **Gemma 4** をリリースしました。Apache 2.0 ライセンスで使えるオープンモデルで、ローカルで動かしている人にとってかなり嬉しい内容になっています。「また(新しいモデル)かよ、、」と思う方もいるかもしれませんが、今回は個人開発者・ローカルLLM勢的に注目ポイントが多いので紹介します。

## 📰 何が発表された？

Gemma 4 は Gemini 3 と同じ研究をベースにした、Google の最新オープンモデルファミリーです。ラインナップは次のとおりです。

| モデル | パラメータ | 用途 |
|--------|-----------|------|
| E2B | 2B（エッジ向け） | スマホ・軽量デバイス |
| E4B | 4B（エッジ向け） | 約 5GB〜 で動く |
| 26B MoE | 26B（実稼働 3.8B） | ローカル中級者向け |
| 31B Dense | 31B | 高スペック環境向け |

MoE（Mixture of Experts）とは、複数の小さな専門モデルを組み合わせたアーキテクチャです。全体のパラメータ数は 26B ありますが、推論のたびに必要な部分だけを呼び出すので、実際に動くのは 3.8B 相当。見た目ほど重くないのがポイントです。

主なスペックはこのあたりです。

- **コンテキストウィンドウ**: E2B/E4B は 128K、26B/31B は 256K
- **マルチモーダル**: テキスト・画像・音声をネイティブで処理
- **多言語対応**: 140以上の言語
- **ライセンス**: Apache 2.0（商用利用 OK）

## 🛠️ ローカルで動かすには

### Ollama を使う場合

Ollama はリリース直後から対応済みです。バージョン 0.20 以上が必要なので、古いバージョンを使っている方はアップデートを忘れずに。

```bash
# エッジ向け（4-bit 量子化で約 5GB）
ollama pull gemma4:e4b

# MoE 版（20GB+ RAM）
ollama pull gemma4:26b
```

Ollama では `モデル名:タグ` の形式で量子化フォーマットを指定できます。タグを省略するとデフォルト（Q4_K_M）が使われるので、迷ったらそのまま pull して OK です。

:::details 量子化フォーマットの選び方

タグにフォーマット名を付けると量子化の精度を変えられます（例: `gemma4:e4b-q8_0`）。

- **Q4_K_M**（デフォルト）: 速度・品質・サイズのバランスが良い
- **Q8_0**: 精度を重視したいとき。その分 VRAM を多く使う
- **NVFP4**: NVIDIA GPU 向け。4-bit 精度で 8-bit とほぼ同精度を維持

:::

### メモリ目安

| モデル | 必要メモリ |
|--------|----------|
| E4B | 約 5GB（Q4_K_M 時） |
| 26B MoE | 20GB+ RAM |
| 31B Dense | 24GB+ VRAM |

E4B は約 5GB で動くので、普通の MacBook や安めの Linux マシンでも問題ありません。Ollama 以外にも Hugging Face / vLLM / llama.cpp でも使えます。

### インストール不要で試したいなら

- **[Google AI Studio](https://aistudio.google.com)**（ブラウザ）: 26B MoE・31B Dense が使えます
- **Google AI Edge Gallery**（iOS / Android）: E2B・E4B をスマホ上でオンデバイス動作

:::message
**iPhone でも動きます。**
[Google AI Edge Gallery（App Store）](https://apps.apple.com/us/app/google-ai-edge-gallery/id6749645337) をインストールするだけで、E4B が完全オフラインで動きます。クラウドへのデータ送信なし、API キー不要です。推論速度もかなり速くて驚きました。
Android は [Google Play](https://play.google.com/store/apps/details?id=com.google.ai.edge.gallery) から。
:::

## 🔍 どういう意味がある？

**Apache 2.0 ライセンス**
商用プロダクトに組み込んでも問題ありません。個人開発でサービスを作る方にとってはかなり重要で、ここが制限されていると使いにくいです。

**MoE で軽くなった 26B**
26B と聞くと重そうですが、実際の推論で動くのは 3.8B 相当です。品質は高くて重さは抑えられているバランスの良いモデルです。

**256K コンテキスト（26B/31B）**
長いドキュメントをそのまま入力する使い方がしやすくなりました。RAG なしでも対応できる場面が増えそうです。

## 💭 個人的な感想

E4B が約 5GB で動くのは素直にありがたいですね。
M シリーズ Mac であれば基本的に RAM 16GB 以上あるので、実質ほぼ誰でも動かせる計算になります。

Google AI Edge Gallery で iPhone にインストールして動かしてみましたが、推論速度がかなり速くて正直驚きました。
「スマホで LLM を動かす」のがここまで実用的になっているとは思っていませんでした。

マルチモーダルが使えるのも今回の目玉で、画像を渡して説明させたり音声を処理したりがローカルで完結するのは、個人開発での選択肢がかなり広がる感じがします。

## 🎯 まとめ

Gemma シリーズはリリースごとに実用性が上がっていて、今回は特にローカル環境での動作の軽さと Apache 2.0 での商用利用が大きなポイントです。E4B から試してみると、「ローカル LLM ってここまで使えるのか」という体験ができると思います。

`ollama pull gemma4:e4b` で即試せるので、まず動かしてみるのがおすすめです。

---

### 参考

- [Gemma 4: Byte for byte, the most capable open models - Google Blog](https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/)
- [gemma4 - Ollama Library](https://ollama.com/library/gemma4)
