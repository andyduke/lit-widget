
# R-Layout - Адаптивные макеты в SCSS

[ [ENGLISH](./README.md) | RUSSIAN ]

Пакет позволяет описать набор парамеров для адаптивного компонента пользовательского интерфейса.

Например, необходимо сверстать информационный блок с заголовком и описательным текстом:
```html
<div class="block">

  <!-- Заголовок -->
  <div class="block-heading">
    Heading
  </div>

  <!-- Текст -->
  <div class="block-text">
    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed dapibus, ante ultricies adipiscing pulvinar, enim tellus volutpat odio, vel pretium ligula purus vel ligula.
  </div>

</div>
```

Этот блок должен быть адаптивным, т.е. иметь разные отступы и размер шрифта для разных точек перестроения (breakpoints).

В обычном SCSS это делается так:
```scss
.block {

  // Стили для заголовка
  .block-heading {

    // Для маленьких экранов
    @media only screen and (max-width: 767px) {
      font-size: 18px;
      line-height: 1.3;
      margin-bottom: 24px;
    }

    // Для больших экранов
    @media only screen and (min-width: 768px) {
      font-size: 20px;
      line-height: 1.2;
      margin-bottom: 32px;
    }

  }

  // Стили для текста
  .block-text {

    // Для маленьких экранов
    @media only screen and (max-width: 767px) {
      font-size: 16px;
    }

    // Для больших экранов
    @media only screen and (min-width: 768px) {
      font-size: 18px;
      line-height: 1.3;
    }

  }

}
```

С помощью **R-Layout** это можно описать так:
```scss
@include rl.define-layout(
  // Название макета
  $name: block,

  // Точки перестроения (breakpoints)
  $sizes: (
    small:    (max: 767px),
    normal:   (min: 768px),
  ),

  // Значения параметров
  $values: (

    // Для маленьких экранов
    small: (

      // Параметры для заголовка
      heading: (
        font-size: 18px,
        line-height: 1.3,
        margin: (
          bottom: 24px,
        ),
      ),

      // Параметры для текста
      text: (
        font-size: 16px,
      ),

    ),

    // Для больших экранов
    normal: (

      // Параметры для заголовка
      heading: (
        font-size: 20px,
        line-height: 1.2,
        margin: (
          bottom: 32px,
        ),
      ),

      // Параметры для текста
      text: (
        font-size: 18px,
        line-height: 1.3,
      ),

    ),

  ),
);

.block {

  @include rl.layout(block) {

    // Стили для заголовка
    .block-heading {
      font-size: rl.value(heading, font-size);
      line-height: rl.value(heading, line-height);
      margin-bottom: rl.value(heading, margin, bottom);
    }

    // Стили для текста
    .block-text {
      font-size: rl.value(text, font-size);
      line-height: rl.value(text, line-height);
    }

  }

}
```

Таким образом становится легче управлять адаптивной версткой, например можно легко изменить в одном месте точки перестроения (breakpoints) или даже добавить еще одну, а так же проще изменить какие-то параметры верстки, например отступ или размер шрифта.


## Установка и подключение

Установить пакет можно через NPM:
```sh
npm install @simulacron/r-layout
```

После чего надо добавить путь `./node_modules` в параметр `--load-path=` при вызове `sass`:
```sh
sass --load-path=./node_modules styles.scss:styles.css
```

Теперь вы можете подключить `r-layout` в свой scss.


### Подключение через `@use`

При подключении через `@use`, будут доступны миксины и функции в пространстве имен `rl`:

```scss
@use "@simulacron/r-layout/rl";

@include rl.define-layout(
  ...
);

...

@include rl.layout(...) {

  font-size: rl.value(...);

}
```


### Подключение через `@import`

При подключении через `@import`, будут доступны миксины и функции в глобальном пространстве имен:
```scss
@import '@simulacron/r-layout';

@include r-define-layout(
  ...
);

...

@include r-layout(...) {

  font-size: rl-value(...);

}
```


### Соответствие имен миксинов и функций

Обратите внимание, что при разном подключении у миксинов и функций отличаются имена. Ниже представлена таблица соответствия имен при разных способах подключения:

| `@use`                  | `@import`               |
|-------------------------|-------------------------|
| `rl.define-layout`      | `r-define-layout`       |
| `rl.layout`             | `r-layout`              |
| `rl.value`              | `rl-value`              |
| `rl.def-value`          | `rl-def-value`          |
| `rl.layout-value`       | `rl-layout-value`       |
| `rl.layout-def-value`   | `rl-layout-def-value`   |


## Использование

Для начала необходимо [определить макет](#определение-макета-define-layout) и задать его параметры, а затем можно [использовать макет](#использование-макета-layout) для генерирования блоков медиа-запросов ([MediaQuery](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries)).


### Определение макета (define-layout)

Макет определяется с помощью миксина `rl.define-layout(...)`.

```scss
@include rl.define-layout(
  $name: 'intro',
  $sizes: (
    small:    (max: 767px),
    normal:   (min: 768px),
  ),
  $values: (
    small: (
      font-size: 16px,
    ),
    normal: (
      font-size: 18px,
    ),
  ),
);
```

У миксина 3 обязательных параметра:
* `$name` - имя макета, используется далее в `rl.layout(...)`;
* `$sizes` - точки перестроения макета (breakpoints);
* `$values` - параметры макета.


#### Точки перестроения

Точки перестроения `$sizes` задаются в виде карты ([Map](https://sass-lang.com/documentation/values/maps/)) со списком имен точек перестроения и условий для медиа-запроса:
```scss
(
  breakpoint-name: (
    min: XX,
    max: YY,
    orientation: ZZ
  )
)
```

Имена точек перестроения используются далее при указании параметров макета для каждой точки.

Условия для медиа-запроса задаются с помощью трех значений:

* `min` - минимальная ширина экрана;
* `max` - максимальная ширина экрана;
* [`orientation`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/orientation) - ориентация экрана.

> **Внимание!** Все значения опциональны, но всегда должно быть указано хотя бы одно.

Например, если указать:
```scss
(
  small: (max: 767px),
  normal: (min: 768px, max: 1023px),
  large: (min: 1024px),
)
```
...то это будет эквивалентно:
```css
@media screen and (max-width: 767px) {...}
@media screen and (min-width: 768px, max-width: 1023px) {...}
@media screen and (min-width: 1024px) {...}
```


#### Параметры макета

Параметры макета задаются в `$values`, в виде карты ([Map](https://sass-lang.com/documentation/values/maps/)) для каждой точки перестроения, определенной в `$sizes`:
```scss
(
  small: (...),
  normal: (...),
)
```

Для точки перестроения задается карта параметров, в произвольном формате. Карта параметров поддерживает вложенные карты:
```scss
small: (
  font-size: 16px,
  spacing: (
    v-spacing: 24px,
  ),
),
```

> Набор параметров разных точек может отличаться, например для точки перестроения для узких экраном может быть не задан параметр горизонтального расстояния между элементами. В этом случае функция `rl.value(...)` для отстутствующего в точке перестроения параметра вернет `null` и CSS-свойство не будет сгенерировано.
```scss
(
  small: (
    font-size: 16px,
    spacing: (
      // h-spacing не указан для этой точки перестооения
      v-spacing: 24px,
    ),
  ),
  normal: (
    font-size: 18px,
    spacing: (
      h-spacing: 16px,
      v-spacing: 24px,
    ),
  ),
)
```


---

### Использование макета (layout)

Когда макет [определен](#определение-макета-define-layout), его можно использовать для генерации блоков медиа-запросов с помощью миксина `rl.layout(...)`.

Внутри макета, для получения параметра необходимо использовать функцию `rl.value(...)`:

```scss
.selector {

  @include rl.layout(block) {
    font-size: rl.value(font-size);
  }

}
```

Если параметр макета имеет вложенность (карта в карте), то для доступа к такому параметру необходимо в функции `rl.value(...)` перечислить весь путь к нему *(в виде последовательных параметров)*, например:
```scss
// Параметр определен как
@include rl.define-layout(
  ...
  spacing: (
    top: 32px,
    bottom: 64px,
  )
  ...
);

@include rl.layout(...) {
  // Получения значения параметра bottom в spacing
  margin-bottom: rl.value(spacing, bottom);
}
```

> Вложенность может быть любого уровня.

Если параметр не найден в макете, то функция вернет `null`.


#### Использование параметров в математических выражениях

При использовании параметров внутри математичского выражения, может возникнуть ошибка, если параметра нет в какой-то из точек перестроения, или он равен нулю (при делении). Для избежания таких ошибок необходимо в математических выражениях вместо функции `rl.value(...)` использовать функцию `rl.def-value(...)`, в которую в первом параметре передать значение по умолчанию:
```scss
width: (100% / rl.def-value(1, columns-count));
```
