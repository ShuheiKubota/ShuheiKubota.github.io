---
title: "footrest"
date: 2022-06-06T00:00:00+09:00
tags:
    - "go"
---

DBMS に接続して REST API 化するアプリ

<!--more-->

Go 言語には DB に接続するためのパッケージとして `database/sql` が用意されています。
それで接続可能な DBMS について、REST API の機能を提供するのが footrest です。

接続できる DBMS を自身で追加・カスタマイズすることもできますが、配布物では以下の DBMS に対して接続できるようにしています。

* SQLite
* SQL Server
* Oracle

受け付ける HTTP メソッドは以下のとおりです。

* GET
* POST
* PUT
* DELETE

# ダウンロード

[ダウンロード](https://github.com/shu-go/footrest/releases)

# 使い方

`footrest gen` で生成した JSON 形式の設定ファイルに接続情報を記載し、`footrest {設定ファイル}` で REST API サーバーを立ち上げます。

## 設定ファイル雛形の生成

```
footrest gen
```

ファイル `footrest.json` が作成されます。

このファイルに、接続情報や REST API サーバーとしての設定を記述します。

## 雛形の解説

```json
{
  "Format": {                        <-- 後述
    "QueryOK": "{\"result\": [%]}",
    "ExecOK": "{\"result\": %}",
    "Error": "{\"error\": %}"
  },
  "Params": {                        <-- 後述
    "Select": "select",
    "Where": "where",
    "Order": "order",
    "Rows": "rows",
    "Page": "page"
  },
  "Timeout": 5000,   <-- (DB) 接続のタイムアウト。ミリ秒
  "Addr": ":12345",  <-- (REST API) host:port の形式で記載
  "Root": "/",       <-- (REST API) ルートとなる URL パス
  "DBType": "",      <-- (DB) Go の sql.Open() 関数の引数 driverName に相当するドライバー名(将来的には位置づけ変わるかも)
  "Connection": "",  <-- (DB) sql.Open() 関数の引数 dataSourceName に相当する接続文字列
  "ShiftJIS": false, <-- (DB) オマケ機能。DB のエンコーディングが SJIS の場合に true
  "Debug": false     <-- 例外やクエリの出力をコンソールに出力したい場合は true
}
```

### DBType と Connection

例えばですが、SQLite のファイル test.db を REST API 化したい場合は以下のようになります。

```json
  "DBType": "sqlite",
  "Connection": "./test.db",
```

## アクセスしてみる

### その前に

上記のように、予め DB を作っておいてください。

### アクセス

[http://localhost:12345/{テーブル名}](http://localhost:12345/TABLE) にアクセスします。

{テーブル名} のところにはテーブルやビューなどのオブジェクトを指定します。

レスポンスボディに JSON 形式で結果が格納されます。

```json
{"result": [
  {"ID": 2,"Text1": "piyo","Number1": 234,"Blob1": null,"Real1": 2.2},
  {"ID": 4,"Text1": null,"Number1": 456,"Blob1": null,"Real1": 4.4}
]}
```


## 条件を指定する

WHERE句に相当する条件は、`http://localhost:12345/TABLE?COL=VALUE` のように指定します。

複数ある場合は、`http://localhost:12345/TABLE?COL=VALUE&COL2=VALUE2`  のようにします。

### >= などの条件を指定する

`COL=VALUE` ではなく、`COL=>=VALUE` とします。

つまり、**`COL` `=` 比較演算子 `VALUE`** です。

!= に相当するのは、! です。`COL=!VALUE` となります。

あまりこの方法にバリエーションはないのですが、他には `COL=%VALUE` で `WHERE COL LIKE 'VALUE' となります。SQL の % 演算子は好きな場所につけてください。

## S式で細かい条件を指定する

`where` という特殊なクエリパラメーターに S式を渡すことで、より細かく WHERE 句を制御できます。

`?where=(and (>= .id 2) (like .text1 aaa%))`

約束事として、このような S式での指定の場合は、カラムの前にはピリオド (`.`) をつけます。

## カラムを選択する

SELECT 句に相当することをしたい場合、クエリパラメーター `select` を指定します。

`?select=col1,col2` で、`col1` と `col2` のみを結果セットに含めます。

## 並び順を指定する

`?order=text1,-id` とすると、カラム `text1` の昇順、`id` の**降順**で並び替えます。

## ページネーション

クエリパラメーター `rows`, `page` を両方指定することで、ページネーションを行えます。

`rows` には1ページあたりの件数を、`page` には何ページ目の結果を返すかを指定します。


## POST (SQL の INSERT 文相当)

上で説明したクエリパラメーター等は使えません。

リクエストボディに JSON 形式で挿入したいカラム名と値を渡します。

```
POST http://localhost:12345/table1
content-type: application/json

{
    "Text1": "hoge"
}
```

↓レスポンス

```
HTTP/1.1 200 OK
Content-Type: text/plain; charset=UTF-8
Vary: Origin
Date: Tue, 07 Jun 2022 13:02:02 GMT
Content-Length: 13
Connection: close

{
  "result": 1
}
```

---

オブジェクトの配列を渡せば、複数レコードを INSERT できます。

```
POST http://localhost:12345/table1
content-type: application/json

[
{
    "Text1": "hoge"
},
{
    "Text1": "hogehoge"
}
]
```

↓レスポンス

```
HTTP/1.1 200 OK
Content-Type: text/plain; charset=UTF-8
Vary: Origin
Date: Tue, 07 Jun 2022 13:03:22 GMT
Content-Length: 13
Connection: close

{
  "result": 2
}
```

## PUT (SQL の UPDATE 文相当)

UPDATE 対象となるレコードは、クエリパラメーターにカラム名を指定する方式、ならびに `where` パラメーターで絞り込むことができます。

あとは、POST 同様、JSON オブジェクトとして更新したいカラムとその値を渡します。

## DELETE (SQL の DELETE 文相当)

対象となるレコードは、クエリパラメーターにカラム名を指定する方式、ならびに `where` パラメーターで絞り込むことができます。

## 免責

セキュリティ面の検証等は行っていません。
公開サービス用途、または商用、セキュリティへの配慮が必要な場面では使わないでください。

SQLいんじぇくしょんやらでれくとりーとらばーさるとかのぜいじゃくせいがあるかもしれませんよ、ということに気をつけてください。
