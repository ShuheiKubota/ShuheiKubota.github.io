---
title: "mdview"
date: 2026-11-21T00:00:00+09:00
---

Markdown ビューア。タブや分割表示、差分表示、less/lv ライクキーバインディング付き。

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

### FILES

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
|Diff: baseline | ファイル内容を読み込んだとき、もしくは最後に基準を更新した (右の更新アイコンを押した) ときとの差分 |
|Diff: first load | ファイル内容を読み込んだときとの差分 |
|Diff: off | 差分表示しない |

`D` (`Shift+d` と表記するべきか悩む…) で、差分表示か、それとも純粋に現在のファイル内容を表示するかを切り替えられます。
これは、最後に選んだ off 以外のモードと off との切り替えを行います。

起動時にどの差分表示モードとするかは、設定できます。 (`Ctrl+,` ※カンマ)

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

### ピンク調にしてみる

試しに、薄いピンク色に全体を変えてみた例をば…

![全体がピンクになった](mdview4_pink.png)

{{< details コード >}}
```CSS
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
{{< /details >}}

変更したい部分についてだけスタイルを変更することができます。

### 背景画像を設定する

![背景にアプリロゴをタイル状に配置](mdview5_background.png)

{{< details コード >}}
```css
/* ==========================================================================
   tile.css — ドキュメントビューの背景に画像をタイル状に敷き詰める
   --------------------------------------------------------------------------
   設定 > 外観 > Custom CSS にこのファイルを指定して使う。
   組み込みスタイルの後に読み込まれるので、変更するルールだけを書いている。

   画像のパスについて:
     カスタム CSS は <style> として埋め込まれるため、url("background.png")
     のような相対パスは CSS ファイルの場所ではなくアプリのページを基準に
     解決されてしまう。ローカルファイルは /_mdv/file?p=<絶対パス> 経由で
     読み込む（パスは URL エンコード。/ 区切りでもよい）。
     画像を別の場所に置く場合は --mdv-tile-image を書き換えること。

   30% の不透明度:
     画像の上に背景色を 70% 重ねている。結果は「背景色の上に画像を
     不透明度 30% で描いた」場合と同じになり、ライト/ダークの両テーマで
     そのまま使える。
   ========================================================================== */

:root {
  --mdv-tile-image: url("/_mdv/file?p=c:/abs/path/to/background.png");
  --mdv-tile-opacity: 30%;
}

.mdv-doc {
  background:
    linear-gradient(
      color-mix(in srgb, var(--mdv-color-bg) calc(100% - var(--mdv-tile-opacity)), transparent),
      color-mix(in srgb, var(--mdv-color-bg) calc(100% - var(--mdv-tile-opacity)), transparent)
    ),
    var(--mdv-tile-image) repeat,
    var(--mdv-color-bg);
}
```
{{< /details >}}

### やたらと集中力を奪ってくるやつ

アニメーションの例として。

![うわぁ](mdview6_focus.png)

{{< details コード >}}
```css
/* ---------- keyframes: everything moves ---------- */
@keyframes mdv-focus-rain {
  to { background-position: 200% center; }
}
@keyframes mdv-focus-pulse {
  0%, 100% { box-shadow: inset 0 3px 0 #ff2d78, 0 0 6px rgba(255, 45, 120, 0.9); }
  50%      { box-shadow: inset 0 3px 0 #2de1ff, 0 0 18px rgba(45, 225, 255, 0.9); }
}
@keyframes mdv-focus-blink {
  0%, 49%  { opacity: 1; }
  50%, 100%{ opacity: 0.25; }
}
@keyframes mdv-focus-spin { to { transform: rotate(360deg); } }
@keyframes mdv-focus-shake {
  0%, 92%, 100% { transform: translateX(0); }
  94% { transform: translateX(-2px) rotate(-0.5deg); }
  96% { transform: translateX(2px) rotate(0.5deg); }
  98% { transform: translateX(-1px); }
}
@keyframes mdv-focus-scan {
  from { background-position-y: 0; }
  to   { background-position-y: 4px; }
}

/* ---------- palette: maximum saturation, both themes ---------- */
[data-theme="light"],
[data-theme="dark"] {
  color-scheme: dark; /* neon is better on dark, so force it */

  --mdv-color-bg: #120826;
  --mdv-color-fg: #f5f3ff;
  --mdv-color-muted: #c4b5fd;
  --mdv-color-border: #7c3aed;

  --mdv-color-accent: #ff2d78;
  --mdv-color-accent-fg: #ffffff;
  --mdv-color-link: #2de1ff;

  --mdv-color-chrome-bg: #1b0f3a;
  --mdv-color-chrome-fg: #e9d5ff;
  --mdv-color-hover: rgba(255, 45, 120, 0.25);
  --mdv-color-selected: rgba(45, 225, 255, 0.3);

  --mdv-color-code-bg: #1e1040;
  --mdv-color-inline-code-bg: rgba(255, 45, 120, 0.3);

  --mdv-color-quote: #c4b5fd;
  --mdv-color-table-stripe: #241247;

  --mdv-color-diff-ins-bg: rgba(62, 255, 148, 0.25);
  --mdv-color-diff-ins-bar: #3eff94;
  --mdv-color-diff-del-bg: rgba(255, 45, 120, 0.3);
  --mdv-color-diff-del-bar: #ff2d78;
  --mdv-color-diff-mod-bar: #ffd60a;
  --mdv-color-diff-word-ins-bg: rgba(62, 255, 148, 0.4);
  --mdv-color-diff-word-del-bg: rgba(255, 45, 120, 0.45);

  --mdv-color-search-hit: rgba(255, 214, 10, 0.65);
  --mdv-color-search-current: #ff2d78;
  --mdv-color-drop: rgba(45, 225, 255, 0.35);

  --mdv-color-task-done: #3eff94;
  --mdv-color-task-border: #c4b5fd;

  --mdv-callout-note: #2de1ff;
  --mdv-callout-tip: #3eff94;
  --mdv-callout-important: #c084fc;
  --mdv-callout-warning: #ffd60a;
  --mdv-callout-caution: #ff5714;

  --pele-fg: #f5f3ff;
  --pele-muted: #c4b5fd;
  --pele-line: #c084fc;
  --pele-surface: #1e1040;
  --pele-surface-alt: #2a1657;
  --pele-border: #c084fc;
  --pele-accent: #ff2d78;

  --mdv-radius: 10px;
}

/* ---------- the whole window breathes in rainbow light ---------- */
.mdv-app {
  background: linear-gradient(120deg, #120826, #3b0f6e, #0e4c5c, #7a1049, #120826);
  background-size: 300% 300%;
  animation: mdv-focus-rain 8s linear infinite;
}

/* toolbar: a neon strip that never sits still */
.mdv-toolbar {
  border-bottom: 2px solid transparent;
  border-image: linear-gradient(90deg, #ff2d78, #ffd60a, #3eff94, #2de1ff, #c084fc) 1;
}

/* ---------- tabs: pulsing neon chips ---------- */
.mdv-pane-tab {
  border-right-color: rgba(255, 45, 120, 0.6);
}
.mdv-pane-tab.is-active {
  animation: mdv-focus-pulse 1.2s ease-in-out infinite;
  color: #ffffff !important;
}

/* the active pane's title bar shakes every so often — a gentle nudge */
.mdv-pane-header .mdv-pane-actions {
  animation: mdv-focus-shake 6s ease-in-out infinite;
}

/* ---------- links scream in cyan and blink on hover ---------- */
.mdv-content a {
  color: var(--mdv-color-link);
  text-shadow: 0 0 8px rgba(45, 225, 255, 0.9);
}
.mdv-content a:hover {
  animation: mdv-focus-blink 0.7s steps(1) infinite;
}

/* ---------- headings glow ---------- */
.mdv-content h1, .mdv-content h2, .mdv-content h3 {
  color: transparent;
  background-image: linear-gradient(90deg, #ff2d78, #ffd60a, #2de1ff);
  -webkit-background-clip: text;
  background-clip: text;
}

/* ---------- code blocks: CRT scanlines ---------- */
.mdv-content pre {
  position: relative;
  border: 1px solid rgba(255, 45, 120, 0.6);
  box-shadow: 0 0 12px rgba(255, 45, 120, 0.35), inset 0 0 18px rgba(45, 225, 255, 0.08);
}
.mdv-content pre::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(180deg, transparent 0 2px, rgba(0, 0, 0, 0.25) 2px 4px);
  animation: mdv-focus-scan 0.6s linear infinite;
}

/* ---------- callouts radiate their color ---------- */
.mdv-content blockquote {
  box-shadow: -3px 0 0 currentColor, 0 0 14px rgba(255, 255, 255, 0.12);
}

/* ---------- status bar marquee-ish shimmer ---------- */
.mdv-statusbar {
  background-image: linear-gradient(90deg, #ff2d78, #ffd60a, #3eff94, #2de1ff, #c084fc);
  background-size: 200% auto;
  animation: mdv-focus-rain 3s linear infinite;
}

/* ---------- selection is a strobe ---------- */
::selection {
  background: #ffd60a;
  color: #120826;
}

/* ==========================================================================
   hover animations — whatever the pointer rests on, it comes alive
   ========================================================================== */

@keyframes mdv-focus-shine {
  from { background-position: 200% center; }
  to   { background-position: -100% center; }
}
@keyframes mdv-focus-pop {
  0%, 100% { transform: translateY(0) scale(1); }
  50%      { transform: translateY(-2px) scale(1.06); }
}
@keyframes mdv-focus-ring {
  from { box-shadow: 0 0 4px rgba(45, 225, 255, 0.8), inset 0 0 4px rgba(255, 45, 120, 0.6); }
  to   { box-shadow: 0 0 16px rgba(45, 225, 255, 1),   inset 0 0 10px rgba(255, 45, 120, 0.9); }
}

/* shared recipe: a neon sheen sweeping across the element */
.mdv-pane-tab:hover,
.mdv-toolbar-button:hover,
.mdv-window-button:hover,
.mdv-sidebar-files-item:hover,
.mdv-sidebar-outline-item:hover,
.mdv-sidebar-search-file:hover,
.mdv-menu-item:hover,
.mdv-statusbar-button:hover,
.mdv-button:hover,
.mdv-code-copy:hover {
  background-image: linear-gradient(105deg, transparent 30%, rgba(255, 255, 255, 0.45) 50%, transparent 70%) !important;
  background-size: 250% auto;
  background-repeat: no-repeat;
  animation: mdv-focus-shine 1s linear infinite;
}

/* buttons and tabs: pop up and down while glowing */
.mdv-pane-tab:hover,
.mdv-toolbar-button:hover,
.mdv-window-button:hover,
.mdv-statusbar-button:hover,
.mdv-pane-action:hover,
.mdv-button:hover {
  animation: mdv-focus-shine 1s linear infinite, mdv-focus-pop 0.8s ease-in-out infinite;
}

/* sidebar items and menu entries: a breathing neon ring */
.mdv-sidebar-files-item:hover,
.mdv-sidebar-outline-item:hover,
.mdv-menu-item:hover {
  animation: mdv-focus-shine 1s linear infinite, mdv-focus-ring 0.7s ease-in-out infinite alternate;
}

/* the active tab is already pulsing — give it an extra kick on hover */
.mdv-pane-tab.is-active:hover {
  animation: mdv-focus-pulse 0.5s ease-in-out infinite, mdv-focus-pop 0.8s ease-in-out infinite;
}

/* search matches in the sidebar glow-sweep like a scanner beam */
.mdv-sidebar-search-hit:hover,
.mdv-search-toggle:hover,
.mdv-search-button:hover {
  animation: mdv-focus-shine 0.7s linear infinite, mdv-focus-ring 0.6s ease-in-out infinite alternate;
}

/* headings react too: shimmer + slight lift */
.mdv-content h1:hover, .mdv-content h2:hover, .mdv-content h3:hover {
  animation: mdv-focus-shine 1.2s linear infinite, mdv-focus-pop 0.9s ease-in-out infinite;
}

/* ---------- scrollbars: rainbow neon rails ---------- */
@keyframes mdv-focus-rail {
  to { background-position-y: 200%; }
}

* {
  scrollbar-width: auto; /* Firefox: show the full (colored) bar, not thin */
  scrollbar-color: #ff2d78 #1b0f3a;
}

::-webkit-scrollbar {
  width: 14px;
  height: 14px;
}

::-webkit-scrollbar-track {
  background: #1b0f3a;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.6);
}

/* thumb: a slow rainbow flowing along its length */
::-webkit-scrollbar-thumb {
  border-radius: 7px;
  background-image: linear-gradient(180deg, #ff2d78, #ffd60a, #3eff94, #2de1ff, #c084fc, #ff2d78);
  background-size: 100% 200%;
  border: 3px solid #1b0f3a; /* keep a dark gap so the track shows through */
  box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.4);
  animation: mdv-focus-rail 4s linear infinite;
}

/* hover it and it ignites */
::-webkit-scrollbar-thumb:hover {
  box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.6), 0 0 12px #ff2d78;
}

/* drag it and it goes full strobe */
::-webkit-scrollbar-thumb:active {
  background-size: 100% 400%;
  animation-duration: 0.8s;
  box-shadow: inset 0 0 8px rgba(255, 255, 255, 0.8), 0 0 18px #2de1ff;
}

/* the little corner where two scrollbars meet */
::-webkit-scrollbar-corner {
  background: linear-gradient(135deg, #1b0f3a 50%, #c084fc 50%);
}

/* respect users who opt out of motion */
@media (prefers-reduced-motion: reduce) {
  ::-webkit-scrollbar-thumb,
  .mdv-app *,
  .mdv-pane-tab:hover,
  .mdv-toolbar-button:hover,
  .mdv-window-button:hover,
  .mdv-sidebar-files-item:hover,
  .mdv-sidebar-outline-item:hover,
  .mdv-menu-item:hover,
  .mdv-statusbar-button:hover,
  .mdv-pane-action:hover,
  .mdv-content h1:hover,
  .mdv-content h2:hover,
  .mdv-content h3:hover {
    animation: none !important;
  }
}
```
{{< /details >}}

<!-- vim: set et ft=markdown sts=2 sw=2 ts=2 :  -->
