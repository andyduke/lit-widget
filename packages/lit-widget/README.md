
# LitWidget

[ ENGLISH | [RUSSIAN](./README.ru.md) ]

**LitWidget** is a pattern to simplify the development of Web Components using the [Lit](https://lit.dev/) library.

The **LitWidget** widget extends **LitElement** and gives you the ability to declaratively bind component class properties to the component's html child elements, as well as add event handlers to them. This pattern is similarly implemented in [Github/Catalyst](https://catalyst.rocks/) and [Stimulus.js](https://stimulus.hotwired.dev/).

**LitWidget**, unlike **LitElement**, by default renders (`render`) all nested elements, thus Progressive Enhancement is achieved when the html page contains all the content that can be indexed by search robots, and not generates content with code. To change this behavior, just override the `render` method in the widget.

Also, **LitWidget** makes all page styles (both `<style>` and `<link>` tags) available in **shadowRoot** by default (except styles with the `[data-shared="false"]` attribute), this behavior can be disabled by setting the `sharedStyles` static property to `false`.

## Usage example

In the following example, class properties `input` and `output` will be automatically bound to html elements inside the component tag that are marked with `data-target="w-hello.input"` and `data-target="w-hello.output"` respectively, as well as the `greet()` class method will be added as a `click` event handler to the button marked with the `data-target="w-hello.button"` attribute.

Widget class:
```js
@customElement('w-hello')
class HelloWidget extends LitWidget {

  // Will point to an element with the attribute data-target="w-button.input"
  @target input

  // Will point to an element with the attribute data-target="w-button.output"
  @target output

  // Click event handler for element with data-target="w-button.button" attribute
  @onEvent('button', 'click')
  greet() {
    this.output.textContent = `Hello, ${this.input.value}!`;
  }

}
```

HTML markup:
```html
<w-hello>
  <input data-target="w-hello.input" type="text" />

  <button data-target="w-hello.button">
    Greet
  </button>

  <span data-target="w-hello.output"></span>
</w-hello>
```

# Attributes
## Default values pattern

# Binding of child elements

# Listening to events

# Sharing CSS Styles

# Rendering

# Patterns

# Anti Patterns
