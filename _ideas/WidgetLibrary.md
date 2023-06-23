
# WidgetLibrary in monorepo

NPM-пакет с виджетами хранится в одном GIT-репозитоии в следующем виде:

```
+ widgets
  + widget_a
    - README.md    // Widget documentation
    - index.js     // Widget class
  + widget_b
    - README.md
    - index.js
    ...
- package.json
```

Исключить файлы документации через `.npmignore`:
```
widgets/**/README.md
```

package.json
```
{
  "name": "@webmeccano/widgets",
  "version": "1.0.0",
  "author": "Andy Chentsov <chentsov@gmail.com>"
}
```

