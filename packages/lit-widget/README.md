
# LitWidget

[ ENGLISH | [RUSSIAN](./README.ru.md) ]

**LitWidget** is a pattern to simplify the development of Web Components using the [Lit](https://lit.dev/) library.

The **LitWidget** widget extends **LitElement** and gives you the ability to declaratively bind component class properties to the component's html child elements, as well as add event handlers to them. This binding greatly simplifies working with the **[Light DOM](#light-dom)**. A similar pattern is implemented in [Github/Catalyst](https://catalyst.rocks/) and [Stimulus.js](https://stimulus.hotwired.dev/).

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

# Light DOM

Light DOM is the markup that the user of your component writes. This DOM is outside of the component's shadow DOM. These are the actual children of the element.
```html
<better-button>
  <!-- the image and span are better-button's light DOM -->
  <img src="gear.svg" slot="icon">
  <span>Settings</span>
</better-button>
```

Why and when should you use Light DOM?

Shadow DOM has a number of limitations that are useful when developing web applications, but not always suitable for website development.

## 3. FUOC (мерцание нестилизованного контента)

Web Components (custom elements) are 100% defined in JavaScript. That includes their HTML and CSS. Those are programmatically added to the DOM through APIs. By the time the browser has interpreted and executed that code, there is a good chance that the rendering pipeline has already put the custom element on the screen. Since it doesn't know about the element the first time around it will render it without the intended styling. After the JavaScript of the custom element definition is executed and the browser, therefore, knows about the CSS rules that apply to that element it can update the view.

Flash of unstyled content (FOUC) can cause irritating layout shifts as well as reveal content that should have been progressively disclosed.

FUOC occurs when using Shadow DOM in Web Components, but when using Light DOM there is no such problem, because all the content of the Web Component is immediately known to the browser and it can apply global page styles to it.

# Differences from LitElement

**LitWidget**, unlike **LitElement**, by default renders (`render`) all nested elements (Light DOM), thus Progressive Enhancement is achieved when the html page contains all the content that can be indexed by search robots, and not generates content with code. To change this behavior, just override the `render` method in the widget.

Also, **LitWidget** makes all page styles (both `<style>` and `<link>` tags) available in **shadowRoot** by default (except styles with the `[data-shared="false"]` attribute), this behavior can be disabled by setting the `sharedStyles` static property to `false`.


# Attributes
## Default values pattern

# Binding of child elements

# Listening to events

# Sharing CSS Styles

# Rendering

# Patterns

# Anti Patterns
