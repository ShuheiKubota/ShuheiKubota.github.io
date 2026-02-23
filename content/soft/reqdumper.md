---
title: "reqdumper"
date: 2022-06-06T00:00:00+09:00
---

受け取った HTTP リクエストの内容を出力するだけの HTTP サーバー

<!--more-->

ヘッダーやらボディやら、アップロードしたファイルの確認やらをすることができます。

APIを利用するクライアントを作るときの動作確認用途で作りました。

# ダウンロード

[ダウンロード](https://github.com/shu-go/reqdumper/releases)

# 使い方

```
reqdumper

```

ブラウザーやAPIクライアントから [http://localhost:12345/](http://localhost:12345/) にアクセスします。

すると、↓このようなログが出力されます。

```json
{
  "Timestamp": "2022-06-06T22:38:22.2368803+09:00",
  "URI": "/",
  "Protocol": "HTTP/1.1",
  "Method": "POST",
  "RemoteAddr": "127.0.0.1:55112",
  "Header": {
    "Accept-Encoding": "gzip, deflate",
    "Connection": "close",
    "Content-Length": "50",
    "Content-Type": "application/json",
    "User-Agent": "vscode-restclient"
  },
  "QueryParam": {},
  "FormParam": {},
  "File": {},
  "Body": "{\r\n    \"name\": \"hoge\",\r\n    \"value\": \"HOGEHOGE\"\r\n}",
  "Trailer": {}
}
```

↑の出力例は、`reqdumper --lf jsonindent` をした場合の出力です。

デフォルト (`--lf json`) は1行で出力され見ずらいので、改行・インデント込みのフォーマットでの出力例をお見せしました。

## ログフォーマット

オプション `--logformat` もしくは `--lf` にフォーマットを指定します。

例: `reqdumper --lf markdown`

指定できるフォーマットは、以下の4つです。

* `json` (default)
* `jsonindent`
* `text`
* `markdown`

ログは、アクセスがあったタイミングで標準出力に出力されます。

注意なのが、`json`, `jsonindent` を指定した場合であっても、特にカンマ等での連結はされません。
つまり、↓のような出力になります。

```
{ ... }
{ ... }
```

JSONの配列になったりもしません。
そういう意味では `json` 系のフォーマットは微妙かもしれません。
jq で加工すれば配列にすることもできますが、ちょっと面倒です。

個人的には `markdown` がおすすめです。

```markdown
## 2022-06-06T22:37:35.2989094+09:00

### Request

POST / HTTP/1.1

#### Remote Address

`127.0.0.1:55105`

### Headers

| name | value |
|------|-------|
| `Accept-Encoding` | `gzip, deflate` |
| `Connection` | `close` |
| `Content-Length` | `50` |
| `Content-Type` | `application/json` |
| `User-Agent` | `vscode-restclient` |

### Body

{
    "name": "hoge",
    "value": "HOGEHOGE"
}
```

### --no-md-use-codequote

LogFormatとして `markdown` を指定した場合、デフォルトでは各ヘッダーの名前や値、ボディーがバックティック (`) で囲まれます。

オプション `--no-md-use-codequote` を指定することで、その挙動を抑止します。

例: `reqdumper --lf markdown --no-md-use-codequote`
 
## Body と FormParam と File

Go言語の話になって恐縮ですが、http.Request.ParseForm() もしくは http.Request.ParseMultipartForm() に成功した場合は FormParam や File に値が入ります。
この場合、Body には値が入りません。

上記の ParseXXX() に失敗した場合は Body に値が入ります。

## ファイルの扱い

ファイルの中身はログとしては出力されません。
ログとは別にファイルとして出力されます。

オプション `--fileformat` に出力ファイル名のフォーマットを指定します。

デフォルトは、`file/{uri_asdir}/{filename}_{year}{month}{day}_{hour}{minute}{second}{nano}{ext}` です。

| 表記 | 説明 |
|------|------|
| {year}{month}{day} | 日付 |
| {hour}{minute}{second}{nanosecond}{nano} | 時刻 |
| {uri}{url} | URI の各要素を _ で区切ったもの |
| {uri_asdir}{url_asdir} | URI の各要素ごとのディレクトリー |
| {paramname} | ファイルのパラメーター名 |
| {filename} | ファイル名から拡張子を抜いたもの |
| {ext} | . から始まる拡張子 |
