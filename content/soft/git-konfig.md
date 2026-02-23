---
title: "git-konfig"
date: 2021-10-24T00:00:00+09:00
tags:
    - "git"
---

gitconfigをエクスポート/インポートするツール

<!--more-->

個人的には、主に alias を gist に上げたりするのに使っています。

PATH の通っている場所に置くことで、`git konfig export` のように使うことができます。

# ダウンロード

[ダウンロード](https://github.com/shu-go/git-konfig/releases)

## 更新履歴
* 0.2.2 (2022-01-28)
    - list コマンドを追加
* 0.1.0 (2021-10-24)
    - 新規

# 使い方

## 一覧

`git konfig list` で system, global, local(, worktree)の内容を一覧表示します。

例

```
core.autocrlf
        input   worktree
        input   local
        false   global
        false   system
core.bare
        false   worktree
        false   local
```

スコープによって値が違うものは赤文字で出力されます。

`--diff` オプションを指定すると、スコープごとに値が異なる項目のみを出力します。

## エクスポート

```
> git konfig export
alias.adp=add -p
alias.adu=add -u
alias.ci=commit
alias.di=diff
alias.logg=log --graph
alias.st=status
```

`git config --list` 相当です。
後述するように、`--global` などを指定することもできます。

出力された内容をファイルや gist などに保存しておくのが良いでしょう。

### alias 以外

`--all` をつけることで、core.xxx や user.xxx も同時にエクスポートできます。

他にも、`--section` (`-s`) でこれらのセクションを指定できます。

```
> git konfig export --all
(snip)

> git konfig export -s alias -s user -s core
(snip)
```

## インポート

※予め gitconfig を何らかの方法でバックアップしておくことをおすすめします。

`git konfig export` でエクスポートした内容をまとめてインポートできます。

```
> git konfig export > my.txt

> git konfig import < my.txt
```

### 手入力

インポートする内容は標準入力から読み取っているため、1行ずつ手入力することもできます。

```
> git konfig import
alias.ci=commit


```

※空行を2つおくと、内容の終端とみなされます。

上の例では alias を設定していますが、別のセクションの設定をすることもできます。

`git config --add KEY VALUE` 相当です。


### alias 専用モード

`--alias` をつけると、行頭の `alias.` が不要になります。

```
> git konfig import --alias
ci=commit
```

### 削除

= の右辺を空白にすることで、その設定を削除できます。

```
> git konfig import
alias.ci=commit

alias.ci=
```

### 設定ファイルの指定

`git config` でも指定できる、4つのオプションがあります。

* `--system`
* `--global`
* `--local`
* `--worktree`

なお、export においては、`--system --global --local` がデフォルトの読み込み元です。
(git-konfig がなにかしているということではなく、単純に `git config` の挙動)

また、import においては、`--local` がデフォルトの書き込み先です。

そのため、特定の設定のみを操作したい場合は、明示的にオプションを指定してください。

### インポート内容のコメント

インポート内容の中に含まれるコメントは無視されます。
コメントは、行頭に `#` もしくは `//` を置いたものです。

コメントはエクスポート時に書き込まれることはないのですが、ユーザーが自由にメモをしておける機能として付加機能として用意しています。

