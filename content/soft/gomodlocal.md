---
title: "gomodlocal"
date: 2022-02-13T00:00:00+09:00
tags:
    - "go"
---

go.mod の replace ディレクティブを操作するツール

<!--more-->

パッケージをローカルで開発している場合など、ローカルで変更した内容を push する前に別の参照されてるパッケージで動作確認したい時があると思います。

例えば、適当なパッケージに another_pkg のローカルでの変更を組み込みたい場合、`go mod edit -replace github.com/my/another_pkg=../another_pkg` とします。

ただ、ちょっと記述量が長いのと、そのせいでコマンドを忘れてしまう事があるため、短縮するようなコマンドを作成しました。

付加価値として、パッケージのローカルパスがリモートでのパスと同様の構造になっている場合、パッケージ名だけを指定すれば良くしています。

---

例えば、`github.com/shu-go/gli` は `github.com/shu-go/cliparser` に依存しています。

一方で、ローカルでは以下のようにパッケージを管理しています。
```
src/
  github.com/
    shu-go/
      gli/
        :
      cliparser/
```

このとき、パッケージ `gli` ディレクトリー内で `gomodlocal cliparser` とすると、自動的に(明示しなくても) `go mod edit -replace github.com/shu-go/cliparser=../cliparser` したかのように `go.mod` を編集します。

# ダウンロード

[ダウンロード](https://github.com/shu-go/gomodlocal/releases)

## 更新履歴
* 0.4.2 (2022-02-13)
    - `gomodlocal [package]` を `gomodlocal replace [package]` と同様の動作とする
* 過去のことは忘れた☆

# 使い方

## replace する

```
gomodlocal another_pkg
または
gomodlocal replace another_pkg
gomodlocal r another_pkg
```

## replace やめる

```
gomodlocal drop another_pkg
gomodlocal d another_pkg
```

