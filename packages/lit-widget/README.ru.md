
# LitWidget

[ [ENGLISH](./README.md) | RUSSIAN ]

**LitWidget** - это паттерн для упрощения разработки Веб-компонентов с помощью библиотеки [Lit](https://lit.dev/).

Далее все Веб-компоненты на базе `LitWidget` будем называть виджетами.

**LitWidget** является расширением **LitElement** и позволяет [декларативно связать](#декларативная-привязка) свойства класса компонента с дочерними HTML-элементами, а так же добавить к ним обработчики событий. Такое связывание значительно упрощает работу с **[Light DOM](#light-dom)**. Этот паттерн похожим образом реализован в [Github/Catalyst](https://catalyst.rocks/) и [Stimulus.js](https://stimulus.hotwired.dev/).

Основная концепция **LitWidget** состоит в следующем: автор виджета описывает в классе привязку к элеменетам в Light DOM, а пользователь виджета размечает с помощью атрибута `data-target` конкретные точки привязки в Light DOM. Таким образом функциональность виджета не зависит от разметки.


## Пример использования

В следующем примере свойства `input` и `output` класса `HelloWidget` будут автоматически связаны с HTML-элементами внутри тэга компонента (Light DOM), которые помечены атрибутами `data-target="w-hello.input"` и `data-target="w-hello.output"` соответственно, а так же метод класса `greet()` будет добавлен в качестве обработчика события `click` кнопки, помеченной атрибутом `data-target="w-hello.button"`.

Класс виджета:
```js
@customElement('w-hello')
class HelloWidget extends LitWidget {

  // Будет указывать на элемент с атрибутом data-target="w-button.input"
  @target input

  // Будет указывать на элемент с атрибутом data-target="w-button.output"
  @target output

  // Обработчик события click для элемента с атрибутом data-target="w-button.button"
  @onEvent('button', 'click')
  greet() {
    this.output.textContent = `Hello, ${this.input.value}!`;
  }

}
```

HTML-разметка:
```html
<w-hello>
  <input data-target="w-hello.input" type="text" />

  <button data-target="w-hello.button">
    Greet
  </button>

  <span data-target="w-hello.output"></span>
</w-hello>
```

# Light DOM

Light DOM — это разметка, которую пишет пользователь вашего компонента. Этот DOM находится за пределами теневого DOM компонента - это настоящие дочерние элементы элемента.
```html
<w-details>
  <!-- the h4 and p are w-details's light DOM -->
  <h4>Shipping Details</h4>
  <p hidden>We ship worldwide.</p>
</w-details>
```

## Почему и когда стоит использовать Light DOM вместо Shadow DOM?

Shadow DOM имеет ряд ограничений, которые удобны при разработке веб-приложений, но не всегда подходят для разработки сайтов.

### Проблема с SEO

Shadow DOM ухудшает индексацию контента поисковыми системами, скрывая контент или разметку от индексирущих механизмов. Light DOM же позволяет работать с компонентами без ущерба для SEO.

Рассмотрим три подхода к реализации компонента заголовка.

1. Shadow DOM, с передачей контента через атрибут компонента:
    ```js
    @customElement('shadow-dom')
    class ShadowDOMComponent extends LitElement {
      @property text;

      render() {
        return html`<h1>${this.text}</h1>`;
      }
    }
    ```
    ```html
    <shadow-dom text="Header text"></shadow-dom>
    ```

2. Shadow DOM, с передачей контента через слот:
    ```js
    @customElement('shadow-dom-with-slot')
    class ShadowDOMwithSlotComponent extends LitElement {
      render() {
        return html`<h1><slot></slot></h1>`;
      }
    }
    ```
    ```html
    <shadow-dom-with-slot>
      Header text
    </shadow-dom-with-slot>
    ```

3. Light DOM - контент как в обычном HTML-элементе:
    ```js
    @customElement('light-dom')
    class LightDOMComponent extends LitWidget {
      lightDOM = true
    }
    ```
    ```html
    <light-dom>
      <h1>Header text</h1>
    </light-dom>
    ```

Все три варианта в браузере выглядят одинаково, но индексирующие механизмы поисковых систем и других сервисов, по разному распознают контент в этих трех вариантах:
- некоторые (такие как Google) правильно определяют заголовок во всех трех вариантах;
- другие:
  - в первом варианте не видят контент вообще, т.к. он находится в Shadow DOM;
  - во втором варианте индексируется текст заголовка, но *не интерпретируется как заголовок*, т.к. тэг `<h1>` находится в Shadow DOM;
  - и только в третьем варианте индексируется заголовок тэга `<h1>` в Light DOM как и в обычном HTML.

Если для Вас важна поисковая оптимизация, то Вам необходимо использовать Light DOM для обеспечения доступности контента для индексации.

### Изоляция CSS-стилей

Shadow DOM изолирует не только стили компонента от общих стилей страницы, но и глобальные стили страницы от самого компонента.

Иногда это может создать дополнительные трудности, когда вы подключаете Веб-компоненты к уже работающему проекту, в котором у вас есть готовая дизайн система с описанием глобальных стилей.

Так же использование одинаковых стилей внутри нескольких Веб-компонентов, например стилей для полей формы, приводит к увеличению кода и негативно сказывается на загрузке страницы.

**LitWidget** позволяет сделать [глобальные стили страницы доступными в Shadow DOM](#совместное-использование-стилей-css)  Веб-компонента. Это поведение включается свойством `sharedStyles` в `LitWidget`, при этом виджет будет отслеживать изменения в стилях страницы и при появлении нового тэга со стилями автоматически сделает его доступным и во всех виджетах со включенным `sharedStyles`, так что если Вы подключаете какие-то API, например встраиваете карты, то их стили будут доступны в Shadow DOM виджетов.

### FUOC (мерцание нестилизованного контента)

Веб-компоненты (пользовательские элементы) определены в JavaScript-коде, включая их HTML и CSS. Они программно добавляются в DOM через API. К тому времени, когда браузер интерпретирует и выполнит этот код, есть большая вероятность, что конвейер рендеринга уже поместил пользовательский элемент на экран. Поскольку он не знает об элементе в первый раз, он отобразит его без предполагаемого стиля. После того, как JavaScript-код определения пользовательского элемента выполнен и браузер, следовательно, знает о правилах CSS, которые применяются к этому элементу, он может обновить представление.

Мерцание нестилизованного контента (FOUC) может вызывать раздражающие изменения макета, а также показывать контент, который должен был раскрываться постепенно.

FUOC возникает при использовании Shadow DOM в Веб-компонентах, но при использовании Light DOM такой проблемы нет, т.к. все содержимое Веб-компонента сразу известно браузеру и он может применить к нему глобальные стили страницы.

# Отличия от LitElement

**LitWidget**, в отличии от **LitElement**, по умолчанию воспроизводит (`render`) все вложенные элементы (Light DOM), таким образом достигается **[Прогрессивное Улучшение](https://en.wikipedia.org/wiki/Progressive_enhancement)**, когда HTML-страница содержит весь контент, который может быть проиндексирован поисковыми роботами, а не генерирует контент с помощью кода. Для изменения этого поведения достаточно переопределить метод `render` в виджете.

Так же, **LitWidget** делает все стили страницы доступными в **shadowRoot** по умолчанию, подробнее см. [Совместное использование стилей CSS](#совместное-использование-стилей-css).


# Декларативная привязка

**LitWidget** позволяет в Light DOM (и в Shadow DOM тоже) указать элементы в качестве целей для привязки к свойствам и обработчикам класса.

### Указание цели

Цели указываются с помощью атрибута `data-target`, в качестве значения атрибута необходимо указать имя тэга Веб-компонента и через точку имя цели, объявленной в виджете:
```html
<w-hello>
  <input type="text" data-target="w-hello.input" />
</w-hello>
```
> Префикс в качестве имени тэга необходим для избежания конфликтов, когда внутри Light DOM одного виджета, находится другой виджет, у которого может быть цель с таким же именем.

### Несколько целей

Если небоходимо указать несколько элементов в качестве массива целей, необходимо использовать атрибут `data-targets`, где в качестве значения указать имя тэга Веб-компонента и имя цели, как и в случае с одиночной целью `data-target`:
```html
<w-profile>
  <input type="text" name="home-email" data-targets="w-hello.emails" />
  <input type="text" name="work-email" data-targets="w-hello.emails" />
</w-profile>
```


## Привязка дочерних элементов к свойствам класса

Привязка целей в классе виджета осуществляется либо с помощью дектораторов `@target` и `@targets`, либо через статические свойства `targets` и `targetsAll`.

**Привязка с помощью дектораторов:**
```js
@customElement('w-profile')
class ProfileWidget extends LitWidget {

  // В Light DOM/Shadow DOM будет доступна
  // точка привязки data-target="w-profile.name"
  @target name;

  // В Light DOM/Shadow DOM будут доступны
  // множественные точки привязки
  // data-targets="w-profile.emails"
  @targets({name: 'emails'}) emailList;

}
```

**Привязка с помощью статических свойств:**
```js
class ProfileWidget extends LitWidget {

  // В Light DOM/Shadow DOM будет доступна
  // точка привязки data-target="w-profile.name"
  // для свойства "this.name"
  static targets = {
    name: {}
  }

  // В Light DOM/Shadow DOM будут доступны
  // множественные точки привязки
  // data-targets="w-profile.emails"
  // для свойства "this.emailList"
  static targetsAll = {
    emails: {property: 'emailList'}
  }

}
customElements.define('w-profile', ProfileWidget);
```

### Синтаксис декораторов

#### `@target`

```js
@target[({ name?, selector?, cache = true, template = false })]
```

Свойство, к которому применяется декоратор, будет содержать ссылку на целевой HTML-элемент или `null`, если целевой элемент не найден.


##### name, selector

По умолчанию декоратор `@target` использует имя свойства в качестве имени цели:
```js
@target name;
```
...но вы можете передать в декоратор имя цели, отличное от имени свойства, например "profile-name":
```js
@target({name: 'profile-name'}) name;
```
...или CSS-селектор:
```js
@target({selector: '.profile-name'}) name;
```

##### cache

С помощью параметра `cache`, Вы можете управлять кэшированием операции поиска. По умолчанию параметр `cache` установлен в `true`, поэтому при обращении к свойству производится поиск целевого элемента и результат поиска кэшируется. Если же Вы хотите при каждом обращении осуществлять поиск, необходимо установить парметр `cache` в `false`.

##### template

Параметр `template` позволяет указать, что в качестве целевого элемента используется тэг `<template>`. В этом случае свойство класса будет цказывать не на тэг, а на содержимое тэга `<template>` (см. [Lit#templateContent](https://lit.dev/docs/templates/directives/#templatecontent)).

#### `@targets`

```js
@targets[({ name?, selector?, cache = true })]
```

Свойство, к которому применяется данный декоратор будет всегда содержать массив элементов, в том числе - пустой массив, если ни одного целевого элемента не найдено.

Декоратор `@targets` принимает практически те же параметры, что и [`@target`](#target), кроме параметра `template`.


### Синтаксис статических свойств

#### static targets

Цели задаются в виде списка "ключ-значение", где в качестве ключа выступает имя цели, а в виде значения - объект, с параметрами. Все параметры не обязатальные, если ни один параметр не указан - то необходимо просто указать пустой объект `{}`.

```js
class HelloWidget extends LitWidget {

  static targets = {
    target_name: {
      property: String,
      selector: String,
      cache: Boolean = true,
      template: Boolean = false
    },
    ...
  }

}
```

Параметр `property` позволяет задать имя свойства класса, которое будет связано с целевым элементом, если этот параметр не указан - используется имя цели.

В остальном параметры идентичны парметрам декоратора `@target`.


#### static targetsAll

Множественные цели задаются аналогично обычным как и обычные в [static targets](#static-targets):
```js
class HelloWidget extends LitWidget {

  static targetsAll = {
    target_name: {
      property: String,
      selector: String,
      cache: Boolean = true
    },
    ...
  }

}
```

Описание параметров см. в [`@targets`](#targets).


## Прослушивание событий


# Attributes

## Default values pattern


# Совместное использование стилей CSS

TODO: TBD

**LitWidget** позволяет сделать глобальные стили страницы доступными в Shadow DOM  Веб-компонента. Это поведение включается свойством `sharedStyles` в `LitWidget`, при этом виджет будет отслеживать изменения в стилях страницы и при появлении нового тэга со стилями автоматически сделает его доступным и во всех виджетах со включенным `sharedStyles`, так что если Вы подключаете какие-то API, например встраиваете карты, то их стили будут доступны в Shadow DOM виджетов.

TODO: Describe `sharedStyles`;
      Describe `sharedStyles` & `lightDOM`

TODO: Describe `[data-shared="false"]`

~~Так же, **LitWidget** делает все стили страницы (все тэги `<style>` и `<link>`) доступными в **shadowRoot** по умолчанию (кроме стилей с атрибутом `[data-shared="false"]`). Это поведение можно отключить, установив статическое свойство `sharedStyles` в `false`.~~


# Patterns

## Смешанное использование Light DOM и Shadow DOM

`.search-bar` and `.search-popover` classes are coming from global page stylesheet.

```html
<w-search>
  <div class="search-bar">
    <input type="text" />
    <span class="icon icon-search"></span>
  </div>
</w-search>
```

```js
@customElement('w-search')
class SearchWidget extends LitWidget {

  // Only layout, not styling
  static styles = css`
.dropdown {
  position: relative;
}
.dropdown .control {

}
.dropdown .popover {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
}
`;

  @state({type: Boolean})
  opened = false

  render() {
    return html`
<div class="dropdown">
  <div class="control">
    <slot></slot>
  </div>
  <div ?hidden=${this.opened} class="popover">
    <div class="search-popover">
      ...
    </div>
  </div>
</div>
`;
  }
}
```

# Anti Patterns
