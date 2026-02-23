---
title: "Go言語でのスタックトレースを簡素化する"
date: 2022-05-05T23:30:00+09:00
tags:
    - "go"
---

Go言語のパッケージ: 冗長なスタックトレースを簡素化して出力します。

<!--more-->

# 普通に出したスタックトレース冗長すぎ問題

`github.com/pkg/errors` で作成したエラーについては `fmt.Printf("%+v", err)` でスタックトレースを出力することができます。

ただ、その出力が `errors.Wrap()` した単位でそれぞれ出力されるため、大分冗長です。

## 例

以下のように、C→B→A と経由したエラーがあったとします。

```go
func funcA() error {
    return errors.Wrap(funcB(), "error A")
}

func funcB() error {
    return errors.Wrap(funcC(), "error B")
}

func funcC() error {
    return errors.New("error C")
}
```

その場合、以下のようにして funcA から返ってきたエラーからスタックトレースを出力すると、以下のようになります。

```go
err := funcA()
fmt.Printf("%+v\n", err)
```

```
error C
mypkg.funcC
        path/to/mypkg/mysource.go:30
mypkg.funcB
        path/to/mypkg/mysource.go:26
mypkg.funcA
        path/to/mypkg/mysource.go:22
mypkg.Example
        path/to/mypkg/mysource.go:12
testing.runExample
        go/current/src/testing/run_example.go:63
testing.runExamples
        go/current/src/testing/example.go:44
testing.(*M).Run
        go/current/src/testing/testing.go:1721
main.main
        _testmain.go:49
runtime.main
        go/current/src/runtime/proc.go:250
runtime.goexit
        go/current/src/runtime/asm_amd64.s:1571
error B
mypkg.funcB
        path/to/mypkg/mysource.go:26
mypkg.funcA
        path/to/mypkg/mysource.go:22
mypkg.Example
        path/to/mypkg/mysource.go:12
testing.runExample
        go/current/src/testing/run_example.go:63
testing.runExamples
        go/current/src/testing/example.go:44
testing.(*M).Run
        go/current/src/testing/testing.go:1721
main.main
        _testmain.go:49
runtime.main
        go/current/src/runtime/proc.go:250
runtime.goexit
        go/current/src/runtime/asm_amd64.s:1571
error A
mypkg.funcA
        path/to/mypkg/mysource.go:22
mypkg.Example
        path/to/mypkg/mysource.go:12
testing.runExample
        go/current/src/testing/run_example.go:63
testing.runExamples
        go/current/src/testing/example.go:44
testing.(*M).Run
        go/current/src/testing/testing.go:1721
main.main
        _testmain.go:49
runtime.main
        go/current/src/runtime/proc.go:250
runtime.goexit
        go/current/src/runtime/asm_amd64.s:1571
```

起点となる "error C" についてのスタックトレースだけがあれば良いものを、その後 `errors.Wrap()` した分エラーについてまでもスタックトレースを出力しています。
冗長ですね。

# というわけで、パッケージ ` stacktrace`

上記のような冗長な出力と比べて、エラー A, B, C それぞれのスタックトレースのフレームをマージしたようなスタックトレースを生成します。(フレームの再現はしません。あくまでも人間が読む出力を簡素化したいだけなので)

# 使い方

## まずは go get

```
go get github.com/shu-go/stacktrace
```

ちなみに [GitHub](https://github.com/shu-go/stacktrace)

## もともとの出力に近い方式

```go
import "github.com/shu-go/stacktrace"

func hoge() {
    err := funcA()
    fmt.Printf("%+v", stacktrace.New(err))
}
```

出力は以下のようになります。

```
error C
mypkg.funcC
        path/to/mypkg/mysource.go:30
error B
mypkg.funcB
        path/to/mypkg/mysource.go:26
error A
mypkg.funcA
        path/to/mypkg/mysource.go:22
mypkg.Example
        path/to/mypkg/mysource.go:12
testing.runExample
        go/current/src/testing/run_example.go:63
testing.runExamples
        go/current/src/testing/example.go:44
testing.(*M).Run
        go/current/src/testing/testing.go:1721
main.main
        _testmain.go:49
runtime.main
        go/current/src/runtime/proc.go:250
runtime.goexit
        go/current/src/runtime/asm_amd64.s:1571
```

もともとの出力を真似た上で冗長部分を削除、しかし、エラーメッセージ部分の出力は行うようにしています。

### 簡単に解説: スタックトレースの読み方

```
<最初に発生したエラーのメッセージ>
<最初にエラーが発生した関数の名前>
    <エラーが発生したソースファイル上の位置>
<↑の関数を呼び出した関数の名前>
    <エラー発生関数を呼び出していた部分のソースファイル上の位置>
  :
```

基本的には上記のとおりなのですが、エラーメッセージは複数回出現することがあります。
これは、途中で `errors.Wrap()` した場合など、エラーを伝播する中で「別のエラーがもともとのエラーを内部に隠し持つようになった」場合にそのようなスタックトレースの出力になります。

上の出力例では、"error C" や "error B" といった行が関数の名前が記載されるのと同じインデントで出力されていますね。

正直ちょっと見辛いと思いますが、まあ、もとから提供された振る舞いに合わせたということで、許してください。

## さらにシンプルにした場合

`%+v` にしていたところを、`%v` に変えるだけです。

```go
fmt.Printf("%v", stacktrace.New(err))
```

出力は以下のようになります。

```
error C
        path/to/mypkg/stacktrace_test.go:30
error B
        path/to/mypkg/stacktrace_test.go:26
error A
        path/to/mypkg/stacktrace_test.go:22
        path/to/mypkg/stacktrace_test.go:12
        go/current/src/testing/run_example.go:63
        go/current/src/testing/example.go:44
        go/current/src/testing/testing.go:1721
        _testmain.go:49
        go/current/src/runtime/proc.go:250
        go/current/src/runtime/asm_amd64.s:1571
```

`%+v` から関数名の行を取り払っただけですが、大分見やすくなりました。(個人的には)

関数の呼び出し関係はわからなくなります。
細かく `errors.Wrap()` するスタイルのコードではエラーメッセージでその分を補えると思うので、こちらの出力が見やすいかもしれません。

## その他の使い方

`stacktrace.New(err)` した結果はこのパッケージ独自のフレームの配列 ([]stacktrace.Frame) になります。

スタックトレースとして出力される情報だけを持った構造体なので加工するのに適しているかはわかりませんが、有用なようであればご利用ください。
