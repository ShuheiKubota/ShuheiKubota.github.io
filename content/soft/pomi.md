---
title: "pomi"
date: 2021-10-19T00:00:00+09:00
tags:
    - "pomera"
---

ポメラSyncされたメモを操作するツール
→後継のソフトウェア[pmsync](/soft/pmsync/)を使ってください。

<!--more-->


# 紹介

## ポメラSyncしたメモをPCでダウンロード・アップロードする

ポメラDM200には「ポメラSync」という機能が搭載されています。
これは、ポメラで編集したメモを iPad や iPhone のメモアプリと同期する機能です。

pomi は、この同期に使われる情報をもとにパソコンにテキストファイルとしてダウンロードしたり、逆にパソコンで編集したテキストファイルをメモとしてアップロードしたりするためのソフトです。

## 動画で説明

具体的な挙動は下の動画を参照していただくと理解しやすいと思います。

{{< youtube ijBhG64XMMI >}}

# 使い方…の前にフロントエンドのご紹介

pomi 自体は使うのに若干スキルを要するソフトなのですが、Outliner 伊藤 崇様がフロントエンドのソフトを作られています。

[Windows用ポメラSyncツール『PomeraDrops』公開 #DM200](http://outliner.sblo.jp/article/177911977.html)

ウィンドウにファイルを D&D するとファイルがアップロードされるなど、直感的で簡単に pomi の機能を使うことができます。
とても良いソフトですので、使ってみることをおすすめします。

# 使い方
## コマンドライン

で、pomi の話に戻りますが、pomi はコマンドラインで実行するソフトとなっています。
つまり、コマンドプロンプトから

* どのメモをダウンロードするか
* どのファイルをアップロードするか

を指示するわけです。

## 先にダウンロード

以下の場所からダウンロードできます。

[ダウンロード](#ダウンロード)

## 使い始めの設定

pomi はコマンドラインアプリケーションです。
Windows ではコマンドプロンプトを使って操作をします。

### 1. Gmail への接続設定

コマンドプロンプトから pomi auth コマンドを実行して、Gmail に接続します。

    > pomi auth

初回実行時は「Windows セキュリティの重要な警告」が表示されますので、「アクセスを許可する」を押してください。

また、コマンドを実行すると同時にブラウザーが起動し、「pomi が次の許可をリクエストしています:」と表示されますので、内容を確認の上、同意する場合に「許可」をおしてください。

許可後のページは閉じていただいて結構です。（本当は自動的に閉じるようにしたいのですが、Chrome ではできません…）

(pomi auth は、デフォルトでは60秒でタイムアウトします。60秒以上経った場合は、再度 pomi auth を実行してください)

### 2. 接続確認

コマンド pomi list を実行して、ポメラSyncの内容が見えることを確認してください。

    > pomi list
    (以下は表示例)
    1 テスト (Fri, 18 Nov 2016 11:23:22 +0900)
    2 ★メモ★ (Wed, 09 Nov 2016 18:16:46 +0900)

表示例にある左端の番号（1, 2, …）は、ほかのコマンドでも使います。

### 3. 動作確認2 メモの取得

コマンド pomi get を使うと、条件を指定してメモをファイルとして取得できます。

    > pomi get --all

デフォルトの保存先は、「(カレントディレクトリ)/pomera_sync」 となっています。
これは、--dir オプションで変更可能です。

    > pomi --dir a/b/c get --all

### 4. 動作確認3 メモの格納

ローカルにあるファイルをポメラSyncに格納するためには、pomi put コマンドを使います。

(ここでは、ローカルのファイル ★メモ★.txt を編集したものとします)

    > pomi put ★メモ★.txt
    searching files in ./pomera_sync
    putting pomera_sync\★メモ★.txt

ファイルの指定には、ワイルドカードとして * が使えます。

    > pomi put ★*
    searching files in ./pomera_sync
    putting pomera_sync\★メモ★.txt

## 使い方のヒント

コマンドラインから、pomi help コマンドを実行して、何ができるか確認してみてください。

※コマンドは今後増える可能性があります。

    > pomi help
    NAME:
      pomi - Pomera Sync IMAP tool

    USAGE:
      pomi [global options] command [command options] [arguments...]

    VERSION:
      0.1.0

    COMMANDS:
      auth            authenticate with gmail
      list, l, ls     list messages
      show, g         show messages
      get, g          get messages
      put, p          put messages
      delete, del, d  delete messages
      help, h         Shows a list of commands or help for one command
    
    GLOBAL OPTIONS:
      --config CONFIG, --conf CONFIG  load the configuration from CONFIG (default: "./pomi.toml")
      --dir DIR, -d DIR               set local directory to DIR (default: "./pomera_sync")
      --help, -h                      show help
      --version, -v                   print the version

また、各コマンドの詳細な使い方は、「pomi help コマンド名」を実行することで確認できます。

    > pomi help list
    NAME:
      pomi list - list messages in the box

    USAGE:
      pomi list [command options] [arguments...]

    OPTIONS:
      --criteria value, -c value  criteria (default: "SUBJECT")

# ダウンロード

* [pomi_windows_amd64.zip](https://github.com/ShuheiKubota/ShuheiKubota.github.io/releases/download/site/pomi_windows_amd64.zip)
* [pomi_windows_386.zip](https://github.com/ShuheiKubota/ShuheiKubota.github.io/releases/download/site/pomi_windows_386.zip)
* [pomi_darwin_amd64.zip](https://github.com/ShuheiKubota/ShuheiKubota.github.io/releases/download/site/pomi_darwin_amd64.zip)
* [pomi_darwin_386.zip](https://github.com/ShuheiKubota/ShuheiKubota.github.io/releases/download/site/pomi_darwin_386.zip)
* [pomi_linux_amd64.zip](https://github.com/ShuheiKubota/ShuheiKubota.github.io/releases/download/site/pomi_linux_amd64.zip)
* [pomi_linux_386.zip](https://github.com/ShuheiKubota/ShuheiKubota.github.io/releases/download/site/pomi_linux_386.zip)

<!--
* [zip](https)
-->

# 更新履歴

* 0.1.3 (2018-01-13)
    - 内部処理の変更のみ。

* 0.1.2 (2017-02-13)
    - pomi put / get で、ファイルの拡張子を保持*しようとする*仕組みを追加

        たとえば「ほげほげ.md」を put して get した場合に、従来の挙動では拡張子が txt になっていましたが、今回の対応で md を保持するようになります。

        X-Pomi-Ext というヘッダーを付与して対応しています。
        他のアプリを使って編集をした場合、このヘッダーが消えてしまうかもしれません。

* 0.1.1 (2017-02-11)
    - pomi put の際に、上書きか新規メッセージかを判断する基準をより細かくしました。

        Subject が対象のファイル名(拡張子を除く)に厳密一致する場合は上書きになります。

* 0.1.0

