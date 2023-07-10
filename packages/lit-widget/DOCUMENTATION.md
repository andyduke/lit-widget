
# LitWidget Documentation

[ ENGLISH | [RUSSIAN](./DOCUMENTATION.ru.md) ]

**LitWidget** is a pattern to simplify the development of Web Components using the [Lit](https://lit.dev/) library.

Further in the text, all Web components based on **LitWidget** will be called widgets.

The **LitWidget** widget extends **LitElement** and gives you the ability to declaratively bind component class properties to the component's html child elements, as well as add event handlers to them. This binding greatly simplifies working with the **[Light DOM](#light-dom)**. A similar pattern is implemented in [Github/Catalyst](https://catalyst.rocks/) and [Stimulus.js](https://stimulus.hotwired.dev/).

The basic concept of **LitWidget** is as follows: the widget author defines binding to elements in the Light DOM in the component class, and the widget user marks specific binding points in the Light DOM using the `data-target` attribute. Thus, the functionality of the widget does not depend on the markup and separation of concerns is carried out - the presentation is in the HTML, and the logic is in the widget.


## Usage example

In the following example, class properties `input` and `output` will be automatically bound to html elements inside the component tag (Light DOM) that are marked with `data-target="w-hello.input"` and `data-target="w-hello.output"` respectively, as well as the `greet()` class method will be added as a `click` event handler to the button marked with the `data-target="w-hello.button"` attribute.

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
<w-details>
  <!-- the h4 and p are w-details's light DOM -->
  <h4>Shipping Details</h4>
  <p hidden>We ship worldwide.</p>
</w-details>
```

In **LitWidget**, the use of Light DOM is enabled by setting the `lightDOM` property to `true`:
```js
@customElement('w-sample')
class SampleWidget extends LitWidget {
  lightDOM = true
}
```
Such a widget will use itself as `renderRoot` or a child element marked with the `data-root` attribute, whose value should be the name of the component tag:
```html
<w-sample>
  <p>Light <b>DOM</b></p>
  <div data-root="w-sample"></div>
</w-sample>
```


## Why and when should you use Light DOM instead of Shadow DOM?

Shadow DOM has a number of limitations that are useful when developing web applications, but not always suitable for website development.

## The problem with SEO

Shadow DOM degrades the indexing of content by search engines by hiding content or markup from indexing mechanisms. Light DOM, on the other hand, allows you to work with components without compromising SEO.

TBD


## CSS Style Isolation

Shadow DOM isolates not only the styles of the component from the general styles of the page, but also the global styles of the page from the component itself.

TBD


## FUOC (Flash of unstyled content)

Web Components (custom elements) are 100% defined in JavaScript. That includes their HTML and CSS. Those are programmatically added to the DOM through APIs. By the time the browser has interpreted and executed that code, there is a good chance that the rendering pipeline has already put the custom element on the screen. Since it doesn't know about the element the first time around it will render it without the intended styling. After the JavaScript of the custom element definition is executed and the browser, therefore, knows about the CSS rules that apply to that element it can update the view.

Flash of unstyled content (FOUC) can cause irritating layout shifts as well as reveal content that should have been progressively disclosed.

FUOC occurs when using Shadow DOM in Web Components, but when using Light DOM there is no such problem, because all the content of the Web Component is immediately known to the browser and it can apply global page styles to it.


# Differences from LitElement

**LitWidget**, unlike **LitElement**, by default renders (`render`) all nested elements (Light DOM), thus Progressive Enhancement is achieved when the html page contains all the content that can be indexed by search robots, and not generates content with code. To change this behavior, just override the `render` method in the widget.

Also, **LitWidget** makes all page styles (both `<style>` and `<link>` tags) available in **shadowRoot** by default (except styles with the `[data-shared="false"]` attribute), this behavior can be disabled by setting the `sharedStyles` static property to `false`.

# Declarative binding

**LitWidget** allows Light DOM (and Shadow DOM too) to specify elements as targets for binding to class properties and handlers.

TBD


# Default values

Web components are often created for the purpose of their reuse in various scenarios. To do this, the components can be configured, for example, through attributes.

TBD


# Sharing CSS Styles in Shadow DOM

**LitWidget** allows you to make global page styles (`<style>` and `<link rel="stylesheet">`) available in the Web Component's Shadow DOM.

TBD
