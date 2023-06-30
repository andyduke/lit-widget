
# LitWidget

[ [ENGLISH](./README.md) | RUSSIAN ]

**LitWidget** - это паттерн для упрощения разработки Веб компонентов с помощью библиотеки [Lit](https://lit.dev/).

Далее все веб-компоненты на базе `LitWidget` будем называть виджетами.

**LitWidget** является расширением **LitElement** и позволяет декларативно связать св-ва класса компонента с дочерними html-элементами, а так же добавить к ним обработчики событий. Такое связывание значительно упрощает работу с **[Light DOM](#light-dom)**. Этот паттерн похожим образом реализован в [Github/Catalyst](https://catalyst.rocks/) и [Stimulus.js](https://stimulus.hotwired.dev/).

## Пример использования

В следующем примере св-ва `input` и `output` класса `HelloWidget` будут автоматически связаны с html-элементами внутри тэга компонента (Light DOM), которые помечены атрибутами `data-target="w-hello.input"` и `data-target="w-hello.output"` соответственно, а так же метод класса `greet()` будет добавлен в качестве обработчика события `click` к кнопке, помеченной атрибутом `data-target="w-hello.button"`.

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

Почему и когда стоит использовать Light DOM?

Shadow DOM имеет ряд ограничений, которые удобны при разработке веб-приложений, но не всегда подходят для разработки сайтов.

## 1. Проблема с SEO

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
- другие - в первом варианте не видят контент вообще, т.к. он находится в Shadow DOM, во втором варианте индексируется текст заголовка, но *не интерпретируется как заголовок*, т.к. тэг `<h1>` находится в Shadow DOM;
- и только в третьем случае индексируется заголовок тэга `<h1>` в Light DOM как и в обычном HTML.

Если для Вас важна поисковая оптимизация - то Вам необходимо использовать Light DOM в подобных случаях.

## 2. Изоляция CSS-стилей

Shadow DOM изолирует не только стили компонента от общих стилей страницы, но и глобальные стили страницы от самого компонента.

Иногда это может создать дополнительные трудности, когда вы подключаете веб-компоненты к уже работающему проекту, в котором у вас есть готовая дизайн система с описанием глобальных стилей.

Так же использование одинаковых стилей внутри нескольких веб-компонентов, например стилей для полей формы, приводит к увеличению кода и негативно сказывается на загрузке страницы.

**LitWidget** позволяет сделать глобальные стили страницы доступными в Shadow DOM  веб-компонента. Это поведение включается свойством `sharedStyles` в `LitWidget`, при этом виджет будет отслеживать изменения в стилях страницы и при появлении нового тэга со стилями - автоматически сделает его доступным и во всех виджетах со включенным `sharedStyles`, так что если Вы подключаете какие-то API, например встаиваете карты - то их стили будут доступны в виджетах.

# Отличия от LitElement

**LitWidget**, в отличии от **LitElement**, по умолчанию воспроизводит (`render`) все вложенные элементы (Light DOM), таким образом достигается **[Прогрессивное Улучшение](https://en.wikipedia.org/wiki/Progressive_enhancement)**, когда html-страница содержит весь контент, который может быть проиндексирован поисковыми роботами, а не генерирует контент с помощью кода. Для изменения этого поведения достаточно переопределить метод `render` в виджете.

Так же, **LitWidget** делает все стили страницы (все тэги `<style>` и `<link>`) доступными в **shadowRoot** по умолчанию (кроме стилей с атрибутом `[data-shared="false"]`). Это поведение можно отключить, установив статическое свойство `sharedStyles` в `false`.


# Attributes
## Default values pattern

# Binding of child elements

# Listening to events

# Sharing CSS Styles

# Rendering

# Patterns

# Anti Patterns
