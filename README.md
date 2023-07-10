
# LitWidget

Declarative binding to child elements for [LitElement](https://lit.dev/) like [Github/Catalyst](https://catalyst.rocks/) and [Stimulus.js](https://stimulus.hotwired.dev/).

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

[Read more](packages/lit-widget/DOCUMENTATION.md)
