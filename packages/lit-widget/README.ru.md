
# LitWidget

[ [ENGLISH](./README.md) | RUSSIAN ]

**LitWidget** является расширением **LitElement** и позволяет [декларативно связать](#декларативная-привязка) свойства класса компонента с дочерними HTML-элементами, а так же добавить к ним обработчики событий. Такое связывание значительно упрощает работу с **Light DOM**. Этот паттерн похожим образом реализован в [Github/Catalyst](https://catalyst.rocks/) и [Stimulus.js](https://stimulus.hotwired.dev/).

<table>
<tr>
  <th>JavaScript</th>
  <th>HTML</th>
</tr>
<tr>
  <td valign="top">

```js
@customElement('w-hello')
class HelloWidget extends LitWidget {

  @target input

  @target output

  @onEvent('button', 'click')
  greet() {
    this.output.textContent = `Hello, ${this.input.value}!`;
  }

}
```
  </td>
  <td valign="top">

```html
<w-hello>
  <input data-target="w-hello.input" type="text" />

  <button data-target="w-hello.button">
    Greet
  </button>

  <span data-target="w-hello.output"></span>
</w-hello>
```
  </td>
</tr>
</table>

# Документация

См. [DOCUMENTATION.ru.md](DOCUMENTATION.ru.md)

# Лицензия

Проект распространяется под BSD 3-Clause лицензией.
