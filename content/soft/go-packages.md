---
title: "Goのパッケージ"
date: 2024-05-03T00:00:00+09:00
tags:
    - go
---

Go向けパッケージの一覧

<!--more-->

ちょこちょこと作ってきたので、使いどころがありそうなものをピックアップして一覧にしてみました。

|名前|場所|説明|
|-|-|-|
|shandler|https://github.com/shu-go/shandler|slogでロギングする際にどのように出力側に伝えるかを制御するパッケージ。slog.Debugだけ別の出力先にするとか、複数の出力先に複製するとか、途中で出力レベル(slog.LevelDebugとかのこと)を変更するとか、色付けをするとか、ができるようになります。|
|findcfg|https://github.com/shu-go/findcfg|.yamlや.json, .configが置かれている場所を検索するパッケージ。複数の置き場所(候補)を許容しつつそれらを見に行く優先順位を付けているようなソフトウェアで使います。[git-cx](https://github.com/shu-go/git-cx)や[faker](https://github.com/shu-go/faker)で使っています。|
|gotwant|https://github.com/shu-go/gotwant|お手軽に使えるテスト用のパッケージ。比較して、違ったらエラー出力する類のやつです。余分な機能は極力持たせない感じで作っています。多数の自作ソフトウェアで利用しています。最近では出力結果を色付けするコマンドを同梱するようになりました。|
|orderedmap|https://github.com/shu-go/orderedmap|格納順を保持するタイプのマップです。genericsを使っていて、他の同種のものより少し性能・機能は勝っています。JSONとYAMLのMarshal/Unmarshalあり。[git-cx](https://github.com/shu-go/git-cx)や[faker](https://github.com/shu-go/faker)で使っています。|
|gli|https://github.com/shu-go/gli|コマンドラインツール作成用のフレームワークです。構造体でコマンドを定義するタイプ。コマンド・オプションの定義やグルーコードを書く労力を減らしコマンドの処理内容に注力できるようにすることを目的としています。構造体に特定のメソッド(Run/Before/Initとか)を書いておけば main関数に少量のコードを書くだけで動きます。ほぼすべての自作ソフトウェアで使っています。|
|cliparser|https://github.com/shu-go/cliparser|gliで使っている、コマンドライン文字列を各要素に切り出すためのパッケージです。事前にヒント(値が続いてくるオプションかどうか、とか)を与えることで、コマンド・オプション・その他を判別させます。|
|ennet|https://github.com/shu-go/ennet|[emmet](https://emmet.io/)の文字列をXMLに展開するパッケージです。emmetは `ul>li*3` といった、ネストした要素の省略記法ですが、これをXMLファイルの操作ツールである[eksemel](https://github.com/shu-go/eksemel)で要素追加をする際の記法に利用しています。|
|minredir|https://github.com/shu-go/minredir|OAuth2とかで使う、処理の過程で一旦特定のURLにアクセスが来る場合のためにHTTP/HTTPSサーバーを立ち上げておきたい場合に使います。[uniqal](https://github.com/shu-go/uniqal)や[pmsync](https://github.com/shu-go/pmsync)で使っています。|
|nmfmt|https://github.com/shu-go/nmfmt|フォーマット文字列として `$name` や `${name}` という表記ができるようになるパッケージです。|
|elapsed|https://github.com/shu-go/elapsed|経過時間を計測するタイマー機能を提供するパッケージです。「elapsed: 123ms」とかそういうのを表示するためのものです。|
|rog|https://github.com/shu-go/rog|ロギングのパッケージです。slogとかあるしお役御免かなーと思ってはいるんですが、デバッグ用途でちょくちょく使っています。rog.EnableDebug() → rog.Debug() → rog.DisableDebug() で局所的にかつ深堀しつつデバッグするのが楽なので。|

<!-- vim: set et ft=markdown sts=4 sw=4 ts=4 tw=0 : -->
