---
title: "Popcorn"
date: 2023-10-21T00:00:00+09:00
tags:
    - "vim"
---

自分がよく使うコマンドを登録して呼び出すための Vim script

<!--more-->


{{< figure src="1.png" >}}
{{< figure src="2.png" >}}

- [vim.org](https://www.vim.org/scripts/script.php?script_id=6088)
- [GitHub](https://github.com/shu-vim/Popcorn)

# 紹介

```vim
※vim9scriptです。

g:PopcornItems = [
    {name: 'LSP', sub: [
        {name: 'Hover', execute: 'LspHover', default: true},
        {name: 'Definition', execute: 'LspDefinition'},
        {name: 'Rename', execute: 'LspRename'},
    ]},
    {name: 'Window', sub: [
        {name: 'Alt', executeeval: '"buffer " .. bufnr("#")', default: true},
        {name: '-'},
        {name: 'Split(--)', execute: 'split'},
        {name: 'Split(|)', execute: 'vsplit'},
    ]},
    {name: '-'},
    {name: 'Time', nameeval: 'strftime("%Y-%m-%d %H:%M:%S")', execute: 'Popcorn'},
]
```

詳細な説明は [GitHub](https://github.com/shu-vim/Popcorn) に掲載しています。
