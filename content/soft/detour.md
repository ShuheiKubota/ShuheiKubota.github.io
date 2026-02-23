---
title: "detour"
date: 2020-05-05T00:00:00+09:00
---

Windows のショートカット先を書き換える CLI アプリ

<!--more-->

# ダウンロード

Windows 版のみの配布です。

[ダウンロード](https://github.com/shu-go/detour/releases)

v1.x 以降、ルールの指定方法が変更になっています。


# 書き換えルールをファイルに保存

## ひな形の生成

```sh
$ detour gen myrules.json
```

生成されたルール(JSONファイル)は以下のようなものです。

```json
{
  "Rules": [
    {
      "name": "C: -> D:",
      "old": "C:",
      "new": "D:"
    },
    {
      "name": "detour -> shortcut",
      "old": "detour",
      "new": "shortcut"
    },
    {
      "old": "\\bg.",
      "new": "go",
      "regexp": true
    }
  ]
}
```

* 大文字小文字は無視されます。
* old がないものはコメント扱いされます。
* 上にあるルールから先に適用されていきます。

# 実行

```sh
$ detour -v --rule-set myrules.json ./subdir/**/*
```

上記の myrules.json のルールを、subdir 以下、再帰的に書き換えをしていきます。

# 制限:URLショートカットは対象外

今のところ、URLショートカットは対象外です。
