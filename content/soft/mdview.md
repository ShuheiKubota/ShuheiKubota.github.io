---
title: "mdview"
date: 2026-11-21T00:00:00+09:00
---

Go 言語で書いた Markdown ビューア

<!--more-->

# 紹介

![スクリーンショット](mdview.png)

mdview は、Go 言語で書いた Windows, macOS, Linux 用の Markdown ビューアです。  
(私はもっぱら Windows しか使っていないので、macOS, Linux での動作確認はできていませんが…)

主な特徴は以下の通りです。

- シングルバイナリー
- タブと入れ子ペイン、複数ウィンドウ（タブをウィンドウ外へドラッグ）
- ファイル一覧（ディレクトリー毎）と見出しアウトラインのサイドバー
- ファイル変更の自動再読み込みと差分表示（初回読み込み時 / 基準時点との比較）
- less / lv ライクなキー操作、通常・正規表現検索
- GitHub emoji、Mermaid（pele）、Callouts、フロントマター、シンタックスハイライト
- ライト / ダーク / システム配色、フォント・ズーム・本文幅、ユーザー CSS

# ダウンロード

[ダウンロード](https://github.com/shu-go/mdview/releases)

# 使い方

基本的な使い方は [GitHub の README](https://github.com/shu-go/mdview/blob/main/README_ja.md) を見ていただくのが良いかと思います。

ここでは、各機能を掘り下げて解説していこうと思います。

## ファイルの開き方

- 普通の開き方
  - 拡張子 md に mdview を関連付けしてダブルクリックする。
  - コマンドラインから `mdview ファイル` で開く。
  - mdview 上で `Ctrl+o` で開く、もしくはファイルを D&D する。
- 踏み込んだ開き方
  - コマンドラインから `mdview フォルダー` で開く。
  - mdview 上で `Ctrl+Shift+o` でフォルダーを開く、もしくはフォルダーを D&D する。

フォルダーを開くことで、再帰的に md ファイルを複数一気に開くことができます。

変更監視をフォルダーについてもしているため、後からできたファイルも自動的に読み込まれます。

また、一旦ファイルの内容を表示すると、以降に発生した変更との差分表示ができるようになります。

#### FILES

ファイルやフォルダーを開くと、サイドバー(`Ctrl+B` で表示切り替え) にファイルが一覧表示されます。

![FILESに開いたファイルが一覧表示されている](mdview1_files.png)

## キーバインディング

移動は、less や lv の要領で操作します。(大雑把に言うと Vim のように`j` や `k` でスクロールします)
もちろん、方向キーや `PageUp`/`PageDown` のような一般的なスクロール操作も可能です。

キーバインディングは、`F1` で確認できますが、
一部の基本操作を簡単に紹介しておきます。

|操作|キー|
|--|--|
|タブを閉じる| `q` |
|上下移動| `j`, `k` |
|少しスクロール| `d`, `u` |
|スクロール| `Space`, `b` |
|先頭、末尾| `g`, `G` |
|Markdown見出し間の移動 | `}`, `{` |
|差分への移動| `]`, `[` |
|検索開始| `/`, `?` |
|前後の検索位置| `n`, `N` |
|タブの切り替え| `t`, `T` |
|サイドバーの表示切り替え| `Ctrl+b` |
|設定| `Ctrl+,` ※カンマ |
|アプリ終了| `Ctrl+q` |


## 変更監視と差分表示

ファイルを開いた後でその内容に変更があると、初期状態では自動的に差分が表示されます。

![変更箇所が差分表示される](mdview2_diff.png)

差分の表示のされかたは調整が必要な部分であり、将来的にはこのスクリーンショットのような表示ではなくなるかもしれません。

> [!warning]
> 差分表示は結構無理をしているので、時折、Markdown としておかしな表示になることがあります。  
> 表示が崩れた場合は慌てずに off の通常表示に切り替えてみましょう。

### 差分表示の切り替え

どの時点からの差分表示とするかを選択できるようになっています。

![ツールバーにあるDiffモード](mdview3_diffmodes.png)

|モード|説明|
|--|--|
|Diff: baseline | ファイル内容を読み込んだとき、もしくは最後に `Baseline` ボタンを押したときとの差分 |
|Diff: first load | ファイル内容を読み込んだときとの差分 |
|Diff: off | 差分表示しない |

`D` (`Shift+d` と表記するべきか悩む…) で、差分表示か、それとも純粋に現在のファイル内容を表示するかを切り替えられます。
これは、最後に選んだ off 以外のモードと off 都の切り替えを行います。

起動時にどの差分表示モードとするかは、設定できます。 (`Ctrl+,` ←カンマ)

### 差分への移動

`]` で次の差分に、`[` で前の差分に移動します。

## タブの操作

タブの切り替えは、おおよブラウザーで行えるような操作ができるようになっています。

タブをドラッグアンドドロップすることで並び替えをしたり、ウィンドウ外にドロップすることで別ウィンドウに独立させたりすることができます。

また、内容が表示されている領域にドロップすることで、その位置により左右に並べたり上下に並べたりすることができます。

## 全ファイル検索

GREPのように、現在開いているファイルを対象として、ファイルを横断して検索することができます。

## エディターで開く

設定にエディターを設定しておくことで、ファイルをエディターで開くことができます。

## 見た目のカスタマイズ

CSS を使って見た目をカスタマイズできます。

設定から "Export template..." をクリックすることで CSS ファイルが出力されますので、それを編集後、同じく設定でそのファイルを指定します。

試しに、薄いピンク色に全体を変えてみた例をば…

![タイトルバーを除く全体がピンクになった](mdview4_pink.png)

```CSS
/* ==========================================================================
   Test customisation: light pink theme (delete this block to revert)
   ========================================================================== */

:root,
[data-theme="light"] {
  --mdv-color-bg: #fff7fa;
  --mdv-color-fg: #4a2a36;
  --mdv-color-muted: #9a6b7c;
  --mdv-color-border: #f3cddb;
  --mdv-color-accent: #e0608f;
  --mdv-color-link: #d14b7e;
  --mdv-color-chrome-bg: #fde8ef;
  --mdv-color-chrome-fg: #6b3a4c;
  --mdv-color-hover: rgba(224, 96, 143, 0.10);
  --mdv-color-selected: rgba(224, 96, 143, 0.18);
  --mdv-color-code-bg: #fdf0f4;
  --mdv-color-inline-code-bg: rgba(224, 96, 143, 0.12);
  --mdv-color-quote: #a06d80;
  --mdv-color-table-stripe: #fdf0f4;
  --mdv-color-task-done: #e0608f;
  --mdv-callout-note: #c75b8a;

  --pele-fg: #4a2a36;
  --pele-line: #b5607f;
  --pele-surface: #fde8ef;
  --pele-surface-alt: #f9d7e3;
  --pele-border: #e5a3bb;
  --pele-accent: #e0608f;
}

[data-theme="dark"] {
  --mdv-color-bg: #2a1d23;
  --mdv-color-fg: #f6e4eb;
  --mdv-color-muted: #c49aab;
  --mdv-color-border: #5a3a47;
  --mdv-color-accent: #f08cb3;
  --mdv-color-link: #ff9cc2;
  --mdv-color-chrome-bg: #34232b;
  --mdv-color-chrome-fg: #f0d3de;
  --mdv-color-code-bg: #34232b;
  --mdv-color-table-stripe: #31212a;
  --mdv-color-task-done: #f08cb3;
}

.mdv-content h1,
.mdv-content h2 {
  color: var(--mdv-color-accent);
  border-bottom-color: var(--mdv-color-border);
}
```

変更したい部分についてだけスタイルを変更することができます。

<!-- vim: set et ft=markdown sts=2 sw=2 ts=2 :  -->
