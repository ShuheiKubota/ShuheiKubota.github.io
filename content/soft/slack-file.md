---
title: "slack-file"
date: 2020-12-21T00:00:00+09:00
---

Slackにアップされたファイルを操作するツール(主に削除)

<!--more-->

# ダウンロード

[ダウンロード](https://github.com/shu-go/slack-file/releases)

# 用途

* 古いファイルが溜まっているので掃除したい。
* 同じ名前のファイルを定期的にアップしているが、最新のものだけ残してあとは消したい。

# 使い方

## まずはアプリの設定

```
> slack-file auth
```

ブラウザが起動して Slack の Your Apps ページに移動します。

#### アプリの作成

{{< figure src="slack-file_1.png" >}}

ここで Create New App をクリックして、新たにアプリを作成します。

{{< figure src="slack-file_2.png" >}}

既存のアプリで、後述する権限を持ったものがあれば、新たに作成する必要はありません。
その場合は該当するアプリを編集してください。

### 権限の設定

{{< figure src="slack-file_3.png" >}}

Redirect URLs に http*s*://localhost:7878 を追加します。
Save URLs も忘れずにクリックします。

{{< figure src="slack-file_4.png" >}}

User Token Scopes で Add an OAuth Scope をクリックし、
files:read, files:write の両方を追加します。

{{< figure src="slack-file_5.png" >}}

{{< figure src="slack-file_6.png" >}}

Scopes を追加したあとに、Reinstall to Workspace をクリックする必要があります。
これを忘れると、後でエラーが発生します。

{{< figure src="slack-file_7.png" >}}

アプリのページに戻って(ブラウザの戻る)…

Client ID と Client Secret を確認します。
この内容を使って、以下のコマンドを実行します。

{{< figure src="slack-file_8.png" >}}

### 認可

```
> slack-file auth {Client ID} {Client Secret}
```

※実際には {} は要りません。

すると、認可のページに遷移しますので、許可します。

{{< figure src="slack-file_9.png" >}}

slack-file.conf というファイルがカレントディレクトリーに作成されます。
この中にはアプリにアクセスするためのトークンが記録されています。

{{< figure src="slack-file_10.png" >}}

## ファイルのリストを見てみる

```
> slack-file list

とか

> slack-file list my*.log
```

古いファイルや特定のチャネルのファイルのみに絞り込むことができます。

オプションについては、以下のコマンドで確認してみてください。

```
> slack-file help list
```

## 標準エラーの場合

Windows の場合です。

```
hoge.exe 2>&1 | ts > log_ts.txt
```

## 古いファイルを削除する

### まずは確認

1日前 以前のファイルを削除してみます。

```
> slack-file delete --dry-run  --older 24h *
```

最後の `*` は、削除するファイル名をワイルドカードで指定しています。

※オプション `--dry-run` を指定すると、実際には削除されません。

### 実際に削除する

オプション `--dry-run` を外すと、実際に削除されます。

```
> slack-file delete --older 24h *
```

## 重複したファイルを1つだけ残して削除する

```
> slack-file uniq --dry-run
```

※オプション `--dry-run` を指定すると、実際には削除されません。

### uniq サブコマンドのオプション

何をもって同一のファイルとするかは、オプション `--key` で指定します。

また、どのファイルを残すかは、オプション `--sort` で指定したフィールドに基づきます。
`-Created` のように、先頭に `-` がついているものは、最後のものが優先としてみなされます。

`--dry-run` を使って確認してみてください。

```
> slack-file help uniq

command uniq - delete duplicated files

Options:
  --key      a unique key set of files (default: Name,Title)
  --sort     sort fields of each --key group (default: -Created,-Timestamp,ID)
  --exclude  do not delete if any properties not empty (default: IsStarred,IsExternal)
  --dry-run  do not delete files actually

Global Options:
  --config   (default: ./slack-file.conf)

Usage:
  # SIMULATE delete duplicated files by Name, keep newest Timestamp
  slack-file uniq --key Name --sort -Timestamp --dry-run
  # DELETE
  slack-file uniq --key Name --sort -Timestamp
```

## ファイルをダウンロードする

デフォルトでは、指定したファイル名に一致する最新のタイムスタンプのファイルがダウンロード対象になります。

```
> slack-file download my*.log > my_latest.log
```

