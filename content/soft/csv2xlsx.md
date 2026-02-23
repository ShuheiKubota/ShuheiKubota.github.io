---
title: "csv2xlsx"
date: 2022-12-20T00:00:00+09:00
---

CSVファイルをXLSXファイルに変換するツール

<!--more-->

# ダウンロード

[ダウンロード](https://github.com/shu-go/csv2xlsx/releases)

# 用途


Excel で CSV ファイルを開いてしまうと、Excel が CSV の値を勝手に解釈して、値やセルの表示形式を変換してしまいます。

例えば、0 から始まるコードが数値に変換されたり、"1-2" が "1月2日" に変換されたりします。
そのまま保存してしまうと、もともとの値が壊れる・意図していない形式で表示される、という弊害があるわけです。

`csv2xlsx` を使うと、基本は自動認識をしつつも、あまり無茶苦茶な変換をせずに Excel ブックに変換できます。

* 勝手に数字で構成されたコード項目を数値に変換してほしくない。
* YYYYMMDD 形式で出力された日付を、Excel の日付として認識させてほしい。
* 複数の CSV ファイルを 1 つの Excel ブックにまとめたい。

なお、既に同名のツールがあります。
ですが、全て文字列になる挙動が気になったことなどもあり、個人的にはもう少し使い勝手にこだわりたかったので、新たに自作することにしました。

# 主な機能

* CSV セルの値に応じた自動変換 (無効化も可能 `--no-guess` →すべて文字列になる)
    * 日付、時刻、数値への自動的な変換
    * 0 から始まる項目は文字列
* 上記の自動変換以外にも、見出しとなるセル (`--header`) の値をキーとした、変換ヒントを指定可能
    * --columns [`SHEET`!]`COLUMN_NAME`:`TYPE`[(`INPUT_FORMAT`)]
        * `[]` は省略可能
        * ここでの `()` はそのまま記入
        * 大文字単語はその内容に相当する具体的な名前や決められた形式名を意味します
        * TYPE = text|number|date|time|datetime|bool
    * ここでの指定はあくまでもヒント。変換に失敗するようなら、デフォルトの変換をする
    * シート名や列名にはワイルドカードも使用可能 (決定順序: 厳密一致→ワイルドカード→(シート名のみ)空白)
* 複数 CSV をまとめて1つの Excel ブックにする
    * CSV のファイル名がシート名となる
* 既存の Excel ブックを指定した場合、CSV に相当するシートだけが上書きされる
* パイプライン
    * こんなのができる→ `(echo a && echo 1) | csv2xlsx -o hoge_result.xlsx --name sheet_ais1`
* オプション `--columns` で、"$A" (A列) や "#3" (3列目) といった形式での `COLUMN_NAME` の指定が可能


# 使い方 (というか、ヘルプ)

```
csv2xlsx - CSV to XLSX file converter

Options:
  -o, --output FILENAME
  -d                                   a value delimiter (default: ,)
  --header                             -1 when no header (default: 1)
  -g, --guess                          guess cell type by --columns or CSV values (default: true)
    --no-guess
  --df, --date                         global input format of date over columns (default: ymd)
  --tf, --time                         global input format of time over columns (default: hms)
  --dtf, --datetime                    global input format of datetime over columns (default: 20060102 150405)
  --dxf, --date-xlsx                   global output format of date over columns (default: yyyy/mm/dd)
  --txf, --time-xlsx                   global output format of time over columns (default: hh:mm:ss)
  --dtxf, --datetime-xlsx              global output format of datetime over columns (default: yyyy/mm/dd hh:mm:ss)
  --nxf, --number-xlsx
  --cols, --columns                    [SHEET!]COLUMN_NAME:TYPE[(INPUT_FORMAT[->OUTPUT_FORMAT])],...
  --name, --pipelined-name SHEET_NAME  the name of a pipelined CSV (default: Sheet1)

Usage:
  csv2xlsx [options] -o FILENAME CSV_FILENAME [CSV_FILENAME...]

  --columns [SHEET!]COLUMN_NAME:TYPE[(INPUT_FORMAT[->OUTPUT_FORMAT])]
    SHEET = CSV_FILENAME
    TYPE = text|number|date|time|datetime|bool
    INPUT_FORMAT
      date: yyyy, yy, y, 2006, 06, mm, m, 01, 1, dd, d, 02, 2
      time: hh, h, 15, 3, mm, m, 04, 4, ss, s, 05, 5
      datetime: 2006, 06, 01, 1, 02, 2, 15, 3, 04, 4, 05, 5
    Examples:
      csv2xlsx -o dest.xlsx src.csv
      csv2xlsx -o dest.xlsx --columns num_*:number src.csv
      csv2xlsx -o dest.xlsx --columns num_*:number(->#\,##0.00) src.csv

Help sub commands:
  help     csv2xlsx help subcommnad subsubcommand
  version  show version
```

# 未実装 (今後やりたいこと)

メモ。順不同。

* 二重引用符で囲まれた値を文字列として認識する
    * encoding/csv 使えなくなる? 勝手に二重引用符消しちゃうんだよね…
* (変換の施行の優先度の関係で) 数値よりも日付や時刻として認識しやすい問題への対応
    * 列ごとにランダムサンプリングして、大多数の表示形式にあわせる?


<!-- vim: set et ft=markdown sts=4 sw=4 ts=4 tw=0 : -->
