---
title: "wfw"
date: 2021-10-19T00:00:01+09:00
tags:
    - "system"
---

Windows ファイアウォール向けのコマンドや可視化された SVG ファイルを生成するツール

<!--more-->

ファイアウォールでよくある許可・拒否の流れとしては、列挙されたルール中で優先度順に最初にマッチしたルールに従うというものです。
例えば、①最優先のルールで 80 ポートを許可しておき、②その次の優先度のルールとしてすべてのポートを拒否するというものです。

こうしておくと、80 ポートは許可、それ以外のポートは拒否となるというものです。

---

一方で、Windows のファイアウォールはルールの規則が特殊です。
自分で優先度を指定できないため、必然的に拒否が優先されます。(例外はありますが)

そのため、上の例のようなルールを作っておくと、②の「すべてのポートを拒否」が優先され、結果的に 80 ポートにアクセスできなくなります。

Windows ファイアウォールでの正解は、①は変わらず 80 ポートを許可、②は 0-79および81-65535を拒否、となります。

----

wfw では、優先度付きのルールで記述したファイアウォールルールを、Windows ファイアウォール仕様のルールに変換します。

広範囲のブロックを基本として、そこに許可するIPアドレスやポートを追加していくスタイルのルールをJSONフォーマットを介して、以下の出力を行います。

* JSONファイル
* リスト形式
* netsh advfirewall firewall 向けのコマンド
* 変換結果を可視化するための SVG ファイル

なお、受信ルール(リモートIPアドレスとローカルポート)の指定のみサポートしています。

# ダウンロード

[ダウンロード](https://github.com/shu-go/wfw/releases)

## 更新履歴

* 0.10.0 (2022-01-15)
    - 生成されたルール内で IP アドレスやポートが格子状に分割されていたところを、`--aggregation` に則って結合するようにした。
      例えば、同一のルール内で port が 0-79,80,81-65535 のようになっていたのが、0-65535 になるようになります。
    - 優先度の高いルールによってくり抜かれたルールの名前から、IP 部分を抜いた、Port 部分を抜いた、といった表記を削除。
      最終的に複数のルールを結合した結果ルールを生成するにあたり、どの部分を抜いたというのを簡単には表現できないため。
    - ヘルプ表示 (`wfw --help`) 内のオプションの説明を追記。
* 0.9.2 (2022-01-14)
    - 依存関係の更新
* 0.9.1 (2022-01-13)
    - ルールの結合を、より `--aggregation` に沿ったものにした。
* 0.9.0 (2022-01-08)
    - `--svg` を廃止して `--format svg` に統合。
    - `--join` を廃止して `--aggregation` (諸略形は `-a`) に変更。意味合いは逆転しています。初期値は `ip`
    - `--svg-name-format` の初期値を `%_{aggregation}_{protocol}.svg` に変更。
    - SVGの出力先ディレクトリーを `--svg-dir` で指定できるようにした。

{{< folding title="過去の更新" name="history" >}}

* 0.7.1 (2021-12-23)
    - `_misc` ディレクトリーにコマンドと SVG を生成するための補助ツールを同梱。
      同ディレクトリーに `wfw.exe` と入力 JSON をいれて、`compile_rules.bat` を実行してみてください。 
    - 入力 JSON の `Name` が `#` から始まる場合は、そのルールを無視するようにした。
    - IPの各オクテットの範囲を [0, 255] とし、きちんと連続するようにした。
    - コマンドを生成する場合は改行を削除する。
* 0.4.0 (2021-11-06)
    - `--svg {ファイル名}` オプションを渡すことで、`ファイル名_TCP.svg` といった命名規則で SVG ファイルを生成できるようになりました。
    - [SVG ファイルの生成](#svg-ファイルの生成)
* 0.3.1 (2021-10-30)
    - ルールが分割された場合に、分割後のルール名に分割の原因となったルール名を追記するようになりました。
    - オプション --except でフォーマットを指定可能。(空白にすると追記なし)
* 0.2.0 (2021-10-28)
    - オプション --format=json を追加。入力ファイルと同じフォーマットで出力できるようなりました。
* 0.1.1 (2021-10-20)
    - TCP もしくは UDP 以外のプロトコルの場合、localport を出力しないようにしました。
* 0.1.0 (2021-10-19)
    - 新規

{{< /folding >}}

# 使い方

ルールを JSON 形式で作成し、`wfw` に読み込ませて、コマンドを生成させます。

## 雛形の生成

```
wfw gen
```

ファイル `example.json` が作成されます。

この内容を参考にして、ルールを作ります。

## 雛形の解説

```json
[
  {
    "Name": "allow HTTPS",
    "Desc": "1st priority",
    "Allow": true,
    "Protocol": "TCP",
    "Port": "443",
    "IP": "192.168.0.1-192.168.255.255"
  },
  {
    "Name": "allow HTTP from .0.101",
    "Desc": "2nd priority",
    "Allow": true,
    "Protocol": "TCP",
    "Port": "80,443,8080",
    "IP": "192.168.0.101"
  },
  {
    "Name": "deny TCP from 192.168.",
    "Desc": "3rd priority",
    "Allow": false,
    "Protocol": "TCP",
    "Port": "0-65535",
    "IP": "192.168.0.1-192.168.255.255"
  },
  {
    "Name": "deny UDP from 192.168.",
    "Desc": "3rd priority",
    "Allow": false,
    "Protocol": "UDP",
    "Port": "0-65535",
    "IP": "192.168.0.1-192.168.255.255"
  },
  {
    "Name": "allow RDP from .0.101",
    "Desc": "4th priority, this rule will be disappeared",
    "Allow": true,
    "Protocol": "TCP",
    "Port": "3389",
    "IP": "192.168.0.101"
  }
]
```

最初のルール「allow HTTPS」では、広範囲の IP アドレスからの TCP 443 ポートアクセスを許可しています。

また、2番目のルール「allow HTTP from .0.101」では、192.168.0.101 からの TCP 80,443,8080 ポートアクセスを許可しています。

3番目のルール「deny TCP from 192.168.」では、192.168.0.1～.255.255 からのすべての TCP アクセスをブロックしています。
ただし、最初のルールが優先されます。これは後ほどの[結果確認](#結果確認)で消えていることが確認できます。

最後のルールは、3番目のルールが優先されるため、結果的に消えてしまいます。

最後から2番目は、これまでと異なり、UDP についてのルールです。

---

`Name` と `Desc` は、分かりやすいように記入します。
特に `Name` は Windows ファイアウォールの一覧に表示されます。

`Protocol` は、Windows ファイアウォールの「プロトコルの種類」にあるものを記入してください。
`wfw` では特に内容のチェックまではしていません。

`Allow` は、`true` で接続を許可することを、`false` で接続をブロックすることを意味します。

`Port` で、許可・ブロックする(`Allow` の指定に依る)ポートを列挙します。
"80, 443" のように単独のポートを , で区切って指定することも、0-65535 のように範囲を指定することもできます。
("80, 443, 8080-8089" のような指定も可能)

`IP` には、このルールが適用されるスコープ(その中の「リモート IP アドレス」)を指定します。
`Port`  同様に、 , と - を使った複数指定ができます。

## 結果確認

まずは、リスト表示で結果確認。

```
wfw example.json
```

↓結果↓

```
----------------------------------------
Name: allow HTTPS
Desc: 1st priority
Action: allow
Protocol: TCP
Port: 443
IP: 192.168.0.1-192.168.255.255
----------------------------------------
Name: allow HTTP from .0.101
Desc: 2nd priority
Action: allow
Protocol: TCP
Port: 80,8080
IP: 192.168.0.101
----------------------------------------
Name: deny TCP from 192.168.(Except: Port of allow HTTPS)
Desc: 3rd priority
Action: BLOCK
Protocol: TCP
Port: 0-442,444-65535
IP: 192.168.0.1-192.168.0.100,192.168.0.102-192.168.255.255
----------------------------------------
Name: deny TCP from 192.168.(Except: Port of allow HTTP from .0.101)
Desc: 3rd priority
Action: BLOCK
Protocol: TCP
Port: 0-79,81-442,444-8079,8081-65535
IP: 192.168.0.101
----------------------------------------
Name: deny UDP from 192.168.
Desc: 3rd priority
Action: BLOCK
Protocol: UDP
Port: 0-65535
IP: 192.168.0.1-192.168.255.255
```

結果として、5つのルールに分かれることがわかります。
(`example.json` の3番目のルールが2つに分かれています)

最初の結果は言わずもがな。

2番目は最初のルールで TCP 443 がカバーされていますので、ポートから 443 がなくなっています。

次は、先に4番目を見てみます。
4番目は、もともとは TCP すべてをブロックするというものでした。
それが 192.168.0.101 についてのブロックに変わっています。
これらは、同IPアドレスで許可していたポートを避けるようになっています。

3番目に戻りますと…
3番目は、やはりもともとは TCP すべてをブロックするというものでした。
それが、4番目で出てきた 192.168.0.101 以外のブロックルールに変わっています。

## ルールのまとめ

* IP, Port は、, と - を使った複数指定が可能
* 上にあるルールが優先される
* IP, Port は、優先されるルールの範囲を避けるように改変される
  * 場合によっては、複数のルールに分割されることもある

## コマンドの生成

先程までは結果の確認のためにリスト表示をしていました。

今度は netsh advfirewall firewall 向けのコマンドを生成してみます。

※`wfw` では直接 Windows ファイアウォールのルールを書き換える機能はありません。

```
wfw --format cmd example.json
```

↓結果↓

```
netsh advfirewall firewall add rule  name="allow HTTPS"  enable=no  
    description="1st priority"  dir=in  profile=any  
    action=allow  
    protocol="tcp"  localport="443"  
    remoteip="192.168.0.1-192.168.255.255"
netsh advfirewall firewall add rule  name="allow HTTP from .0.101"  enable=no  
    description="2nd priority"  dir=in  profile=any  
    action=allow  
    protocol="tcp"  localport="80,8080"  
    remoteip="192.168.0.101"
netsh advfirewall firewall add rule  name="deny TCP from 192.168.(Except: Port of allow HTTPS)"  enable=no  
    description="3rd priority"  dir=in  profile=any  
    action=block  
    protocol="tcp"  localport="0-442,444-65535"  
    remoteip="192.168.0.1-192.168.0.100,192.168.0.102-192.168.255.255"
netsh advfirewall firewall add rule  name="deny TCP from 192.168.(Except: Port of allow HTTP from .0.101)"  enable=no  
    description="3rd priority"  dir=in  profile=any  
    action=block  
    protocol="tcp"  localport="0-79,81-442,444-8079,8081-65535"  
    remoteip="192.168.0.101"
netsh advfirewall firewall add rule  name="deny UDP from 192.168."  enable=no  
    description="3rd priority"  dir=in  profile=any  
    action=block  
    protocol="udp"  localport="0-65535"  
    remoteip="192.168.0.1-192.168.255.255"
```

※ページの見た目のため、本来は入っていない改行を入れています。

この結果を**管理者権限で起動した**コマンドプロンプトに貼り付ければ、Windows ファイアウォールのルールが追加されます。

---

デフォルトでは無効化されたルールを作成するコマンドを生成します。
(上で生成されたコマンドでは `enable=no` となっていますね)

以下のようにすることで、最初から有効なルールを生成させることもできます。

```
wfw -f cmd  --enabled  example.json
```

個人的にはこのオプションは使わず、無効化されたルールをよく確認した上で有効化することをおすすめします。

## SVG ファイルの生成

`--format svg` を引数に渡すことで、SVG ファイルを生成することができます。

`example.json` から生成した SVG を下に2つ(TCP と UDP)掲載します。

```
wfw --format svg example.json
```

### TCP (example_ip_TCP.svg)

{{< svg data="example_ip_TCP.svg" >}}

[結果確認](#結果確認)で表示された内容が図示されています。

縦軸が IP アドレス、横軸がポートです。

マウスカーソルを当てると、まとまったルールがハイライトされ、下にその内容が表示されます。

### UDP (example_ip_UDP.svg)

{{< svg data="example_ip_UDP.svg" >}}

## まとまり傾向の切り替え

これまでに掲載してきた結果表示は、1つの IP アドレス内で極力ポートをまとめる傾向がありました。

オプション `--aggregation`(省略形は `-a`) を指定することで、方針を切り替えることができます。

例えば `--aggregation ip` (デフォルト値) とした場合、接続元 IP アドレスごとで許可・拒否するポートをまとめ上げます。

他の選択肢としては `--aggregation port` があり、こちらはローカルポートに着目して、対象となる IP アドレスをまとめ上げます。


SVG で結果を比較してみます

### 変更: `--aggregation port`

```
wfw --aggregation port --format svg example.json
```

{{< svg data="example_port_TCP.svg" >}}

### 比較用に再掲: `--aggregation ip`

```
wfw --aggregation ip --format svg example.json
```

{{< svg data="example_ip_TCP.svg" >}}
