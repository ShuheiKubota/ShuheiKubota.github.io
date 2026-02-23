---
title: "faker"
date: 2022-01-16T00:00:00+09:00
---

自分なりのコマンドを作成できるコマンドラインツール

<!--more-->

# 紹介

長いコマンドラインを登録して、短いコマンドを作り出すことができます。

```
f --add {ショートカット名} コマンドライン...
f --add vl verylongcommand -do something

f vl
```

この実行ファイルを別名でコピーすることで、また別のショートカットを登録することもできます。

```
copy f.exe g.exe

g --add vl veryverylonglongcommand -do anything
```

# ダウンロード

[ダウンロード](https://github.com/shu-go/faker/releases)

[旧バージョン](https://github.com/shu-go/f/releases)

## 更新履歴

* 0.1.1 (2022-01-16)
    - 前身である f をもとに新規作成
    - サブコマンドを定義できるようにした

# 使い方

## 登録

```
f --add gitinit git init
f --add goinit go mod init
```

※変更も `--add` で行います。

## 登録されたコマンドの実行

```
f gitinit
```

## サブコマンド

`--add` に `cmdA.cmdB` のようにピリオドで区切ったコマンド列を渡すことで、
サブコマンドを定義することができます。

```
# 登録

f --add m.n notepad

# 実行

f m n
```

サブコマンドのグループ自体も実行することも可能です。

```
# 登録

f --add m calc

# 実行

f m
f m n
```

## 引数

コマンドの実行時に引数を渡すこともできます。

(上のサブコマンドの例からの続き)

```
f m n hoge.txt
```

## 削除

```
f --remove gitinit
```

## 登録されたコマンドの一覧

```
f
```

## 登録が記録されているファイルの在処

1. 実行ファイルと同じ場所にある JSON ファイル
   - f.json
   - 実行ファイル名を変えた場合は、f の部分もそちらに読み替えてください。
2. OS標準(?)の設定ファイル置き場
   - {CONFIG_DIR}/faker/f.json
   - Windows: %appdata%\faker\f.json
   - 他のOSの場合は、https://cs.opensource.google/go/go/+/go1.17.3:src/os/file.go;l=457 を参照してください。

1, 2 どちらにもファイルがない場合は、1 の方に登録内容を記録します。

## パイプ

```
f --add clip cmd /c echo "|" clip

f clip abc
```

f に渡した引数は最初のコマンド(上の例では `cmd /c echo`)に渡されます。


# 例

```
vim:    gvim.exe [--remote-tab-silent]
ginit:  git [init]
up:     go [get -u]
bench:  go [test ./... -bench . -benchmem]
minit:  go [mod init]
test:   go [test ./...]
tidy:   go [mod tidy]
build:  go [build]
  upx:  cmd [/c go build -trimpath -ldflags -s -ldflags -w && upx --lzma *.exe]
l:      lazygit []
```
