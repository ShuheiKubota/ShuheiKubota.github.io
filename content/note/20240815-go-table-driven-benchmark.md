---
title: "Goでテーブル駆動のベンチマークをとる方法"
date: 2024-08-15T00:00:00+09:00
tags:
    - "go"
---

公式に記載ありますが、まとめてみます。

<!--more-->

[公式サイトのブログ記事](https://go.dev/blog/subtests#table-driven-benchmarks)

# ベンチマークのシナリオ

- 数値を文字列に変換する関数を作った。
- 標準パッケージが提供する同種の関数と、パフォーマンスの比較をしたい。
- テーブルとして用意したテストケースそれぞれについて比較をしたい。

# 書き方(ベンチマークの部分のみ)

```go
type testcase struct {
	name  string
	input []int
}

var testcases = []testcase{
	{ // このテストケース単位で、標準パッケージ関数との比較をしたい。
		name:  "plus",
		input: []int{1, 2, 3},
	},
	{ // このテストケース単位で、標準パッケージ関数との比較をしたい。
		name:  "minus",
		input: []int{-1, -2, -3},
	},
}

func BenchmarkStringer(b *testing.B) {
	std := strconv.Itoa
	myitoa := MyItoa

	for _, c := range testcases { // テストケース
		b.Run(c.name+"(std)", func(b *testing.B) { // 比較対象(サブベンチマーク)
			for i := 0; i < b.N; i++ {
				for _, n := range c.input {
					std(n)
				}
			}
		})
		b.Run(c.name+"(my)", func(b *testing.B) { // 比較対象(サブベンチマーク)
			for i := 0; i < b.N; i++ {
				for _, n := range c.input {
					myitoa(n)
				}
			}
		})
	}

	// ちなみに、普通の(?)サブベンチマークとして書くとこんな感じになる。
	// こちらの方法だとテーブル全体で比較する形になっている。

	b.Run("std-all", func(b *testing.B) {
		for _, c := range testcases { // テストケース
			for i := 0; i < b.N; i++ {
				for _, n := range c.input {
					std(n)
				}
			}
		}
	})

	b.Run("my-all", func(b *testing.B) {
		for _, c := range testcases { // テストケース
			for i := 0; i < b.N; i++ {
				for _, n := range c.input {
					myitoa(n)
				}
			}
		}
	})
}
```

## 結果の出力例

```
go test -bench .
```

全部で6つあるテスト結果のうち、前半4つがテーブル駆動の出力例です。

```
BenchmarkStringer/plus(std)-8           144737995                8.125 ns/op
BenchmarkStringer/plus(my)-8            54076951                20.84 ns/op
BenchmarkStringer/minus(std)-8          17072347                61.68 ns/op
BenchmarkStringer/minus(my)-8           26117388                40.63 ns/op

BenchmarkStringer/std-all-8             16578752                70.74 ns/op
BenchmarkStringer/my-all-8              19311915                64.46 ns/op
```

# 対象を絞り込む

`-bench xxx` でベンチマーク対象となるテストケースを絞り込むこともできます。

```
go test -bench /minus
```

```
BenchmarkStringer/minus(std)-8          17571860                67.47 ns/op
BenchmarkStringer/minus(my)-8           27569918                43.05 ns/op
```


<!--  vim: set et ft=markdown sts=4 sw=4 ts=4 tw=0 :  -->
