---
title: "deline"
date: 2019-03-16T00:00:00+09:00
tags:
    - "vim"
---

Vim の statusline をカスタマイズしやすくするための Vim script. 
すぐに使えるサンプル入り。

<!--more-->

Vim の statusline の定義があまりにも難解かつなので、簡単に記述するためのプラグインを作成しました。

このプラグインを入れると、最近ではよくある見た目の statusline が定義されます。

{{< figure src="ss1.png" >}}

ただし、よくある境界を三角にするのには未対応です。

位置の変更や色の変更、条件による表示/非表示、独自の要素を定義できます。

[deline](https://www.vim.org/scripts/script.php?script_id=5773)

# 紹介

## statusline の記法は分かりづらい

上にある statuline は、次のように定義されています。

※極力シンプルにするため、このプラグイン (deline) 独特の関数呼び出しなどは削除しています。<br />
※実際は1行で記述します。

```vim
%2* NORMAL %1* 
%4*%{&readonly||!(&modifiable)?'[RO] ':''}
%{&modified?'+ ':''}
%3*plugin/%1*deline.vim 
%=
%4*%{&fileformat}
%1* %3*|%1* 
%4*%{&fileencoding}
%1* %3*|%1* 
%{&filetype}
 %3*|%1* 
 %4l:%3v
```

本当はハイライト(配色)の定義やファイル名といった動的に変わるコンポーネントの定義もあるのですが、ここでは文字列リテラルにしています。
そこそこ推測はできそうですが、それでも、どの部分を変更すれば表示がどう変わるのか、分かりづらくありませんか。

## deline での定義

では、deline の提供する関数を使った場合を見てみます。

```vim
call Deline([
    \ deline#comment("mode (define User2 and change to it by hl(2))"),
    \ deline#modeHL("User2"),
    \ deline#hl(2),
    \ deline#space(),
    \ deline#mode(),
    \ deline#space(),
    \ 
    \ deline#comment("filepath and mod, readonly flags"),
    \ deline#hl(1), deline#space(),
    \ deline#hl(4),
    \ deline#readonly('[RO] ', ''),
    \ deline#modified('+ ', ''),
    \
    \ deline#comment("v-- expand(%:p:h:t) / expand(%:p:t)"),
    \ deline#comment("deline#file(':p:h:t/:p:t'),"),
    \ deline#hl(3), deline#file(':p:h:t'), "/",
    \ deline#hl(1), deline#file(':p:t'),
    \ deline#space(),
    \
    \ deline#rightalign(),
    \
    \ deline#fileformat(),
    \
    \ deline#comment("v-- separator"),
    \ deline#space(), deline#hl(3), deline#bar(), deline#hl(1), deline#space(),
    \
    \ deline#fileencoding(),
    \
    \ deline#space(), deline#hl(3), deline#bar(), deline#hl(1), deline#space(),
    \
    \ deline#filetype(),
    \
    \ deline#space(), deline#hl(3), deline#bar(), deline#hl(1), deline#space(),
    \
    \ deline#line(), ":", deline#columnv(),
    \
    \ deline#space(),
    \ ])
```

各コンポーネントは関数化されており、Vim の複雑な記法を使わずに表現できます。

## 表現を拡張することもできる

例えば、Vim の statusline の記法では動的にハイライトを変更することは困難です。
しかし、deline の関数を使えば、簡単に表現できます。

↓は、UTF-8 以外のファイルでは、エンコーディング名のハイライトを変更する例です。

```vim
    \ deline#dynamic#if("&fileencoding!='utf-8'", deline#hl(4), deline#hl(1)),
    \ deline#fileencoding(),
    \ deline#hl(1),
```

# カスタマイズ方法

個々の関数については、ヘルプを参照してください。
ここでは、具体的なカスタマイズを紹介します。

## vimrc に記述する

カスタマイズをする場合は、vimrc に記述します。

↓に、★がついているのがカスタマイズに関わる箇所です。

```vim
augroup Deline_mysetting "★お決まり
autocmd! "★お決まり
autocmd BufEnter * call Deline([ "★お決まり
            \ deline#comment(" ★ Deline の標準ではないことを視覚的に判別するためのもの(アニメーションする)"),
            \ deline#dynamic#periodic(300),
            \ deline#dynamic#cyclic(['-', '\', '|', '/', '-', '\', '|', '/', '-', '-', '+', '*', '+']),
            \ 
            \ deline#comment("mode (define User2 and change to it by hl(2))"),
            \ deline#modeHL("User2"),
            \ deline#hl(2),
            \ deline#space(),
            \ deline#mode(),
            \ deline#space(),
            \ 
            \ deline#comment("filepath and mod, readonly flags"),
            \ deline#hl(1), deline#space(),
            \ deline#hl(4),
            \ deline#readonly('[RO] ', ''),
            \ deline#modified('+ ', ''),
            \
            \ deline#comment("v-- expand(%:p:h:t) / expand(%:p:t)"),
            \ deline#comment("deline#file(':p:h:t/:p:t'),"),
            \ deline#hl(3), deline#file(':p:h:t'), "/",
            \ deline#hl(1), deline#file(':p:t'),
            \ deline#space(),
            \ deline#hl(4), deline#notsaved(2),
            \
            \ deline#rightalign(),
            \
            \ deline#comment(" ★ 幅広のときのみ、時刻と検索文字列を表示する"),
            \ deline#dynamic#if("winwidth(0) > 80", 
                \ deline#hl(1) . deline#expr("strftime('%T')") .
                \ deline#space() . deline#hl(3) . deline#bar() . deline#hl(1) . deline#space(),
                \ ""),
            \ deline#dynamic#if("winwidth(0) > 80 && !v:hlsearch", 
                \ "/" . deline#expr("getreg('/')") .
                \ deline#space() . deline#hl(3) . deline#bar() . deline#hl(1) . deline#space(),
                \ ""),
            \
            \ deline#comment("\ deline#fileformat(),"),
            \ deline#dynamic#if("&fileformat!='unix'", deline#hl(4), deline#hl(1)),
            \ deline#fileformat(),
            \ deline#hl(1),
            \
            \ deline#comment("v-- separator"),
            \ deline#space(), deline#hl(3), deline#bar(), deline#hl(1), deline#space(),
            \
            \ deline#comment("\ deline#fileencoding(),"),
            \ deline#dynamic#if("&fileencoding!='utf-8'", deline#hl(4), deline#hl(1)),
            \ deline#fileencoding(),
            \ deline#hl(1),
            \
            \ deline#space(), deline#hl(3), deline#bar(), deline#hl(1), deline#space(),
            \
            \ deline#filetype(),
            \
            \ deline#space(), deline#hl(3), deline#bar(), deline#hl(1), deline#space(),
            \
            \ deline#line(), ":", deline#columnv(),
            \
            \ deline#space(),
            \ ])
augroup END "★お決まり
```

autocmd は、プラグインと vimrc のロード順の関係上、関数定義がされた後で呼び出すために入れています。
GUI 版を使う場合は、**g**vimrc に `call Deline(...)` の部分だけを記述すれば OK です。

## 自分で定義したハイライトを使う

`deline#hl("MyHighlight")`

## 条件に応じた文字列を出力する



# より詳細な説明

## 関数の種類

### 通常の関数 deline#xxx()

deline が提供している関数の内容については、付属のドキュメントを参照していただければと思います。

`deline#xxx()` というのは、その殆どが**文字列を返す関数**です。

### 動的な関数 deline#dynamic#xxx()

他方、`deline#dynamic#xxx()` という関数もあります。
これは、Vim が statusline を評価するタイミングで statusline の表現に変換されるというものです。
利用者が新たに定義をすることも可能です。

非 dynamic な関数が単純に文字列を返すものであるのに比べて、dynamic な関数は「文字列を返す関数を返す」関数です。

### 使い分け

deline が提供する関数の中には、`deline#if()` や `deline#dynamic#if()` のように、dynamic なものと非 dynamic なものの両方がある場合があります。

どちらを使うべきかを説明します。

#### dynamic 関数

`if({expr}, {t}, {f})` の {t} もしくは、{f} に対して、どのような物を渡すかによって、dynamic 版を使うか非 dynamic 版を使うかが分かれます。



## 評価の流れ

この内容はあまり理解していなくても大丈夫です。
ただ、**dynamic 関数から dynamic 関数を呼び出すことはできない**ことに注意してください。

流れとしては、↓のような感じです。

1. Deline() に関数呼び出しの結果を配列として渡す。
   → この時点で、文字列リテラルはさておき、非 dynamic な関数の一部は文字列リテラルとして statusline 向けの文字列 (%f など) を返している。
   → それ以外の deline が提供する関数は、`#{func()}` といった関数呼び出しを行うための文字列を返している。
2. (カーソル移動などがあり) Vim で statusline を再描画する。そのために statusline に記述されているものが評価される
3. 流れ 2 を受け、`#{func()}` のような関数呼び出しを含んでいると、その関数を呼び出す。
   → 非 dynamic なものは、この時点で statuline に表示するための文字列を返す。
   → dynamic なものは、deline に対して「あとで返すべき文字列を返す」関数を返す。また同時に、dynamic 関数を後で呼び出すための記述を埋め込むよう指示する。
4. (dynamic 関数が含まれる場合のみ) dynamic 関数を statuline に埋め込み、再度 statusline の再描画を Vim に行わせる。
   → 流れ 2 に戻るが、実は流れ 3 の部分では、無限ループにならないように、時間でスロットリングしている。


# ダウンロード

[www.vim.org](https://www.vim.org/scripts/script.php?script_id=5773)
