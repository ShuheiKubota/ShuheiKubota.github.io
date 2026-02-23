---
title: "Raspberry Pi 4 で DLNA/OMV セットアップ"
date: 2021-02-10T00:00:00+09:00
tags:
    - "raspberrypi"
---

Raspberry Pi 4 のセットアップから OMV、その上に DLNA をセットアップするところまでを 粗く記録しておきます。

OpenMediaVault をインストールし、外付け SSD を共有フォルダーにしつつ、DLNA でデータ化した音楽・動画を視聴できるようにします。

<!--more-->

全体的に、記事 [Raspberry Pi + WifiアダプタでNAS化](https://qiita.com/wisteria3221/items/6ad8c75c60f59d245c0d) をベースにして設定を進めた。
(特に気にせずにOMVのインストールをすると、なぜか無線LANが使えなくなるのがネックになっていたので大変助かった。感謝 :smile:)

## Raspberry Pi 4 セットアップ

### Lite イメージを MicroSD カードに焼く。
### ssh, wpa_sapplicant.conf をルートに置く。

* ssh は空のファイル。
* wpa_sapplicant.conf は以下のようなファイル。

```apache
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=JP
network={
   ssid="my-sssid"
   psk="my-password"
}
```

### 起動
### IP アドレスを確認する。(netenum)
### `ssh pi@{IP_ADDR}` でログイン。パスワードは `raspberry`。
### `sudo apt-get update && sudo apt-get upgrade`
### `sudo raspi-config`
ssh あたりの再設定？

## OMV インストール

[Raspberry Pi + WifiアダプタでNAS化](https://qiita.com/wisteria3221/items/6ad8c75c60f59d245c0d) より引用。

```bash
wget https://github.com/OpenMediaVault-Plugin-Developers/installScript/raw/master/install
chmod +x install

# nオプションが重要
sudo ./install -n
```

## OMV セットアップ

初期の ID, パスワードは以下の通り。

| ID | Password |
|----|----------|
| admin | openmediavault |

SSD を外付けする。

あまり余計なものを入れたくなかったので、ファイルシステムのフォーマットは ext4 にしている。

exFAT にできた方が嬉しかったが、マウントができなかった。

### ディスク
### ファイルシステム

ファイルシステムのフォーマットとマウントを行う。

### 共有フォルダ

SMB以外でも、DLNA で公開するための共有フォルダを設定しておく。

### SMB/CIFS

DLNA で公開する共有フォルダも含めておく。
SMB 経由で更新したいので。

### プラグイン

openmediavault-minidlna をインストール。
少し時間がかかる。

### DLNA

OMV 共有フォルダを指定。

## ネットワークインターフェイスの設定

OMV の設定が終わり、DLNA クライアントからの接続が確認できたら、ネットワークインターフェイスを変更する。
**注意: ここからは特に、ご家庭のネットワーク環境に合わせて、やる・やらないを決めてください**

上記では Raspberry Pi の wlan0 でネットワークに接続していたが、有線の eth0 に変える。

以降、見間違いを防ぐため、wlan0, eth0 で記載する。

### LANケーブルを接続

無線ルーターに、Raspberry Piから伸ばしたLANケーブルを接続する。

### (任意) IPアドレスを固定する

名前解決がきちんと出来ていれば、`\\raspberrypi` で接続できる。
(メモ: デフォルトでは、ID:pi, password:raspberry)

DLNA の場合はクライアントが自動的に探してくれるようだ？

ともあれ、IP アドレスを固定したい場合は、以下のファイルに追記する。

#### /etc/dhcpcd.conf を設定

```apache
#ファイルの末尾に追加

interface eth0
static ip_address=192.168.0.100/24
static routers=192.168.0.1
static domain_name_servers=192.168.0.1 8.8.8.8

interface wlan0
static ip_address=192.168.0.101/24
static routers=192.168.0.1
static domain_name_servers=192.168.0.1 8.8.8.8
```

### eth0 での SSH 接続を確認する

Windows10 標準の SSH クライアントを使っているからかもしれないが、wlan0 経由のときとは異なり（というか、よく覚えてないが）、接続が拒否されてしまった。

```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Someone could be eavesdropping on you right now (man-in-the-middle attack)!
It is also possible that a host key has just been changed.
The fingerprint for the ECDSA key sent by the remote host is
SHA256:eS0jKz/S3iIvuD2d9bkmvQwf9KRmwnl4Q/tGbq/RsC4.
Please contact your system administrator.
Add correct host key in    .ssh/known_hosts   to get rid of this message.
Offending ECDSA key in   .ssh/known_hosts:6
ECDSA host key for 192.168.0.100 has changed and you have requested strict checking.
Host key verification failed.
```

要は、known_hosts ファイル(Windows では `C:\Users\xxx\.ssh\known_hosts`)に、eth0 の IP アドレスを追記する。
wlan0 に接続したときの記述(自動的にできていた)を真似するといい。

### wlan0 接続を無効化する

無効化しなくてもよいかもしれない。

```bash
sudo iwconfig wlan0 txpower off
# sudo iwconfig wlan0 txpower auto
```
