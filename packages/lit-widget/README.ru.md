
# LitWidget

[ [ENGLISH](./README.md) | RUSSIAN ]

**LitWidget** - это паттерн для упрощения разработки Веб компонентов с помощью библиотеки [Lit](https://lit.dev/).

Виджет **LitWidget** является расширением **LitElement** и позволяет декларативно связать св-ва класса компонента с дочерними html-элементами, а так же добавить к ним обработчики событий. Этот паттерн похожим образом реализован в [Github/Catalyst](https://catalyst.rocks/) и [Stimulus.js](https://stimulus.hotwired.dev/).

**LitWidget**, в отличии от **LitElement**, по умолчанию воспроизводит (`render`) все вложенные элементы, таким образом достигается Прогрессивное Улучшение, когда html-страница содержит весь контент, который может быть проиндексирован поисковыми роботами, а не генерирует контент с помощью кода. Для изменения этого поведения достаточно переопределить метод `render` в виджете.

Так же, **LitWidget** делает все стили страницы (все тэги `<style>` и `<link>`) доступными в **shadowRoot** по умолчанию (кроме стилей с атрибутом `[data-shared="false"]`). Это поведение можно отключить, установив для статического свойства `sharedStyles` значение `false`.

## Пример использования

В следующем примере св-ва класса `input` и `output` будут автоматически связаны с html-элементами внутри тэга компонента, которые помечены атрибутами `data-target="w-hello.input"` и `data-target="w-hello.output"` соответственно, а так же метод класса `greet()` будет добавлен в качестве обработчика события `click` к кнопке, помеченной атрибутом `data-target="w-hello.button"`.

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

