
# LitWidget

[ ENGLISH | [RUSSIAN](./README.ru.md) ]

The **LitWidget** widget extends [**LitElement**](https://lit.dev/docs/components/overview/) and gives you the ability to declaratively bind component class properties to the component's html child elements, as well as add event handlers to them. This binding greatly simplifies working with the **Light DOM**. A similar pattern is implemented in [Github/Catalyst](https://catalyst.rocks/) and [Stimulus.js](https://stimulus.hotwired.dev/).

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

# Documentation

See [DOCUMENTATION.md](DOCUMENTATION.md)

# License

This project is licensed under the terms of the BSD 3-Clause license.
