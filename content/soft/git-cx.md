---
title: "git-cx"
date: 2025-01-02T00:00:00+09:00
tags:
    - "git"
---

gitのコミットメッセージを、コマンドラインで選択しながら構築していくツール

<!--more-->

[Conventional Commits](https://www.conventionalcommits.org/ja/v1.0.0/)を意識したコミットメッセージを構築するためのツールです。

[ダウンロード](https://github.com/shu-go/git-cx/releases)

# スクリーンショット

## 型の選択

![型の選択](git-cx_1.png)

## スコープの選択

![スコープの選択](git-cx_2.png)

## その他の入力

![その他の入力](git-cx_3.png)

## git log

![git log](git-cx_4.png)

# 使い方

## 設定の生成

```
git cx gen
```

[Conventional Commits](https://www.conventionalcommits.org/ja/v1.0.0/)の型を含む `git-cx` の設定をファイルとして出力します。

生成された設定を書き換えて、自身の使う複数のリポジトリー共通の設定としたり、リポジトリーごとに異なる設定にしたりすることもできます。

`git cx gen --emoji` で絵文字付きのテンプレートも生成できます。

### 生成された設定ファイル

```yaml
headerformat: '{{.type}}{{.scope_with_parens}}{{.bang}}: {{.emoji_unicode}}{{.description}}'
headerformathint: .type, .scope, .scope_with_parens, .bang(if BREAKING CHANGE), .emoji, .emoji_unicode, .description
types:
    '# comment1':
        desc: 'comment starts with #'
        emoji: ""
    '# comment2':
        desc: This default definition is from https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-commit-message-guidelines
        emoji: ""
    feat:
        desc: A new feature
        emoji: ':sparkles:'
    fix:
        desc: A bug fix
        emoji: ':bug:'
    docs:
        desc: Documentation only changes
        emoji: ':memo:'
    refactor:
        desc: A code change that neither fixes a bug nor adds a feature
        emoji: ':recycle:'
    perf:
        desc: A code change that improves performance
        emoji: ':zap:'
    test:
        desc: Adding missing tests or correcting existing tests
        emoji: ':test_tube:'
    build:
        desc: Changes that affect the build system or external dependencies
        emoji: ':package:'
    ci:
        desc: Changes to our CI configuration files and scripts
        emoji: ':hammer:'
    revert:
        desc: Reverts a previous commit
        emoji: ':rewind:'
denyemptytype: false
denyadlibtype: false
usebreakingchange: false
```

※ このサイトでは `:`sparkles`:` が :sparkles: に変換されるなど、絵文字向けの文字列が絵文字に変換されています。

## 型以外の設定

### headerformat

コミットメッセージの1行目の構成を指定することができます。

#### 例

```yaml
headerformat: '{{.type}}{{.scope_with_parens}}{{.bang}}: {{.emoji_unicode}}{{.description}}'
```

各コンポーネントは `{{.hoge}}` の形式で記述します。
`{{}}` の外にある個所は固定の文字列として扱われます。

#### コンポーネント

生成された設定ファイルの2行目にある `headerformathint` には、記述できるコンポーネントが列挙されています。
(このフィールドは、それ自身は何か設定をしているわけではありません)

```yaml {linenostart=2}
headerformathint: .type, .scope, .scope_with_parens, .bang(if BREAKING CHANGE), .emoji, .emoji_unicode, .description
```

- `.type`
    - [Conventional Commits](https://www.conventionalcommits.org/ja/v1.0.0/)の型(type)
    - 選択した型に置き換わります。
- `.scope`
    - スコープ(scope)
- `.scope_with_parens`
    - スコープ(scope) を `()` で囲んだもの
    - ただし、スコープが空欄だった場合は `()` 含めて空白に置き換わります。
- `.bang`
    - BREAKING CHANGEフッターがある場合に `!` に置き換わります。
    - ※BREAKING CHANGEフッターは、設定ファイル末尾にある `usebreakingchange` が `true` の場合にのみ入力可能です。
- `.emoji`
    - 型ごとに設定できる `emoji` の文字列に置き換わります。
    - ※上記の設定ファイル例では、:sparkles: のように絵文字に変換されていますが、本来の記述内容は `:`sparkles`:` のようになっています。
- `.emoji_unicode`
    - 型ごとに設定できる `emoji` を絵文字に変換したものに置き換わります。
    - [Emoji List](https://www.unicode.org/emoji/charts/emoji-list.html)の "CLDR Short Name" にあるスペースをアンダースコア `_` に置き換えたものを半角コロンで囲みます。
    - 例: `:`broken_heart`:` -> :broken_heart:
- `.description`
    - `git-cx` では、型、スコープについで入力された、タイトル(description)に置き換わります。

### denyemptytype

`true` を指定することで、型を必須にします。

### denyadlibtype

`true` を指定することで、設定ファイルにある型しか選択できなくします。

### usebreakingchange

`true` を指定することで、BREAKING CHANGEフッターの入力ができるようになります。

## 設定ファイルの置き場

生成された設定ファイル `.cx.yaml` を以下のいずれかの場所においておきます。

1. gitconfig ([cx] rule={PATH_FROM_REPOS_ROOT})
2. ワークツリーのルート
3. 以下のディレクトリー
   - {CONFIG_DIR}/git-cx/.cx.yaml
   - Windows: %appdata%\git-cx\.cx.yaml
   - (see https://cs.opensource.google/go/go/+/go1.17.3:src/os/file.go;l=457)
4. git-cx があるディレクトリー

---

使い勝手が良いのは、2 か 3 でしょうか。

自分のメッセージのスタイルを一貫させたい場合は3が合っているでしょう。

一方で、共同開発する場合に設定を合わせたい場合は、2のように、そのリポジトリーに設定ファイルを含めてしまうのが良いでしょう。

## スコープの候補

スコープはリポジトリー毎に内容が異なるのと、途中で増えることも想像されるため、型とは違い予め決めておく方式とはしませんでした。

入力されたスコープを記録しておき、それを候補として表示するようにしています。

ただし、予め、スコープの記録をするファイルを gitconfig で指定しておきます。

```ini
[cx]
  scopes = myscopes.yaml
```

`scopes` には、リポジトリーのルートからのパスで指定します。

このファイルには git-cx を介してコミットをした際のスコープが記録され、結果的にスコープの候補となります。


# ダウンロード

[ダウンロード](https://github.com/shu-go/git-cx/releases)


