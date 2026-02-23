---
title: "GOEXPERIMENT + Build Constraints"
date: 2024-02-13T22:06:52+09:00
tags:
    - "go"
---

例えば GOEXPERIMENT=rangefunc の場合にビルドしたい/したくない場合の書き方

<!--more-->

# 書き方

ファイルの冒頭にコメントを記述するやり方でいけます。

すべて小文字の `goexperiment.xxx` を使います。
否定形は `!goexperiment.xxx` です。

## GOEXPERIMENT 

```go 
//go:build goexperiment.rangefunc
```

## not GOEXPERIMENT 

```go 
//go:build !goexperiment.rangefunc
```

# 例

main.go
```go
package main

func main() {
	RangeOverFunc()
}
```

rof1.go
```go
//go:build goexperiment.rangefunc

package main

func RangeOverFunc() {
	f := func(yield func(i int) bool) {
		n := 0
		for {
			yield(n)
			n++
		}
	}

	for i := range f {
		println("ctrl+c してね")
		println(i)
	}
}
```

rof2.go
```go
//go:build !goexperiment.rangefunc

package main

func RangeOverFunc() {
	println("rangefunc disabled")
}
```

build
```bat
> go build
> rof.exe
rangefunc disabled

> set GOEXPERIMENT=rangefunc
> go build
> rof.exe
 :
```
