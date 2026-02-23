---
title: "pmsync"
date: 2021-10-16T00:00:00+09:00
tags:
    - "pomera"
---

ポメラSyncされたメモを操作するツール 刷新版

<!--more-->

既存のツールpomiをある程度 踏襲しつつ、Gmail関係のAPIを更新したものです。

# ダウンロード

[ダウンロード](https://github.com/shu-go/pmsync/releases)

## 更新履歴
* 0.3.0 (2021-10-23)
    - list, trash サブコマンドを高速化
    - もし不具合があるようなら、0.2.3を使ってください
* 0.2.3 (2021-10-23)
    - list, trash サブコマンドに並び替えのオプション --sort を追加
* 0.2.0 (2021-10-23)
    - Gmail側のメッセージをゴミ箱に送る trash サブコマンド追加
* 0.1.1 (2021-10-16)
    - 刷新

# 紹介

## ポメラSyncしたメモをPCでダウンロード・アップロードする

ポメラDM200には「ポメラSync」という機能が搭載されています。
これは、ポメラで編集したメモを iPad や iPhone のメモアプリと同期する機能です。

pmsync は、この同期に使われる情報をもとにパソコンにテキストファイルとしてダウンロードしたり、逆にパソコンで編集したテキストファイルをメモとしてアップロードしたりするためのツールです。

## もう少し詳しく

DM200からポメラSyncされたメモはGmail上にラベルNotes/Pomera_syncとして保存されます。

pmsync は、このラベルが付与されたメールメッセージをアップロード・ダウンロードするためのコマンドラインツールです。

# 使い方
## コマンドライン

pmsync はコマンドラインで実行するソフトウェアです。
つまり、コマンドプロンプトから、

* どのメモをダウンロードするか
* どのファイルをアップロードするか

を指示するわけです。

## 先にpmsync自体のダウンロード

以下の場所からダウンロードできます。

[ダウンロード](https://github.com/shu-go/pmsync/releases)

## 使い始めの設定

pmsync はコマンドラインアプリケーションです。
Windows ではコマンドプロンプトを使って操作をします。

### 1. Google Cloud Platform のプロジェクト作成～認証情報作成

https://console.cloud.google.com/projectcreate にアクセスします。

以降の手順は、スクリーンショットを参考にしてください。

---

{{< figure src="pmsync_auth_1.png" >}}

---

{{< figure src="pmsync_auth_2.png" >}}

---

{{< figure src="pmsync_auth_3.png" >}}

---

{{< figure src="pmsync_auth_4.png" >}}

---

{{< figure src="pmsync_auth_5.png" >}}

---

{{< figure src="pmsync_auth_6.png" >}}

---

{{< figure src="pmsync_auth_7.png" >}}

---

{{< figure src="pmsync_auth_8.png" >}}

---

{{< figure src="pmsync_auth_9.png" >}}

---

{{< figure src="pmsync_auth_10.png" >}}

---

{{< figure src="pmsync_auth_11.png" >}}

---

{{< figure src="pmsync_auth_12.png" >}}

---

{{< figure src="pmsync_auth_13.png" >}}

---

{{< figure src="pmsync_auth_14.png" >}}

---

{{< figure src="pmsync_auth_15.png" >}}

ここまで来たら、「JSONをダウンロード」をクリックして、必要なファイルをダウンロードします。

ファイル名は「credentials.json」とし、pmsync の実行ファイルがある場所に保存します。


### 1. Gmail への接続設定

コマンドプロンプトから pmsync auth コマンドを実行して、Gmail に接続します。

    > pmsync auth

再びブラウザーでの操作になります。

---

{{< figure src="pmsync_use_1.png" >}}

---

{{< figure src="pmsync_use_2.png" >}}

---

{{< figure src="pmsync_use_3.png" >}}

---

{{< figure src="pmsync_use_4.png" >}}


### 2. 接続確認

コマンド pmsync list を実行して、ポメラSyncの内容が見えることを確認してください。

    > pmsync list
    (以下は表示例)
    xxxxxx テスト (Fri, 18 Nov 2016 11:23:22 +0900)
    xxxxxx ★メモ★ (Wed, 09 Nov 2016 18:16:46 +0900)

### 3. 動作確認2 メモの取得

コマンド pmsync get を使うと、条件を指定してメモをファイルとして取得できます。

    > pmsync get

保存先を指定しない場合、コマンドプロンプト画面にメモの内容をつらつらと表示します。
表示を途中で止めたい場合は、Ctrl+C で強制終了させてください。

### 3-1. メモをファイルとして保存する

今度は、同じく pmsync get でファイルに保存してみます。

    > pmsync get -o file

デフォルトの保存先は、「(カレントディレクトリ)/pomera_sync」 となっています。
これは、-d オプションで変更可能です。

### 4. 動作確認3 メモの格納

ローカルにあるファイルをポメラSyncに格納するためには、pmsync put コマンドを使います。

(ここでは、ローカルのファイル ★メモ★.txt を編集したものとします)

    > pmsync put ★メモ★.txt
    putting pomera_sync\★メモ★.txt

ファイルの指定には、ワイルドカードとして * が使えます。

    > pmsync put ★*
    putting pomera_sync\★メモ★.txt

``*`` だけを指定することで、pomera_syncフォルダー内のすべてのファイルがアップロード対象となります。

※ファイルシステムのルートディレクトリーから始まるファイル名を指定した場合、-d の指定に関わらず、そのファイルをアップロードします。

## 使い方のヒント

コマンドラインから、pmsync help コマンドを実行して、何ができるか確認してみてください。

※コマンドは今後増える可能性があります。

    > pmsync help
    pmsync - Gmail<-->file sync for Pomera DM200(dev-20211023)

    Sub commands:
      auth       update token
      list, ls   list notes(mail messages)
      get        display or download as a file
      put        upload files as notes(gmail messages)
      trash, rm  send messages to the trash

    Options:
      --userid                      (default: me)
      --box, --label                (default: Notes/pomera_sync)
      -c, --credentials FILE_NAME  your client configuration file from Google Developer Console (default: ./credentials.json)
      -t, --token FILE_NAME        file path to read/write retrieved token (default: ./token.json)
      --clientid                   if no credentials.json
      --clientsecret               if no credentials.json
      --auth-port NUMBER            (default: 7878)

    Usage:
      * create credentials at https://console.developers.google.com/apis/credentials
      * download credentials.json
      * pmsync auth
      * pmsync get
      * pmsync get -o file

    Help sub commands:
      help     pmsync help subcommnad subsubcommand
      version  show version

また、各コマンドの詳細な使い方は、「pmsync help コマンド名」を実行することで確認できます。

    > pmsync help list
    command list - list notes(mail messages)

    Options:
      -f, --format  {id}, {subject}, {date}, {snippet}, {body} (default: {id} {subject} ({date}))

    Global Options:
      --userid                      (default: me)
      --box, --label                (default: Notes/pomera_sync)
      -c, --credentials FILE_NAME  your client configuration file from Google Developer Console (default: ./credentials.json)
      -t, --token FILE_NAME        file path to read/write retrieved token (default: ./token.json)
      --clientid                   if no credentials.json
      --clientsecret               if no credentials.json
      --auth-port NUMBER            (default: 7878)

    Usage:
      args accepts Gmail advanced search syntax (https://support.google.com/mail/answer/7190)

