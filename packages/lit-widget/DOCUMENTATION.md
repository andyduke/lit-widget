
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
import { LitWidget, target, onEvent } from '@simulacron/lit-widget';
import { customElement } from 'lit/decorators.js';

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

Let's consider three approaches to the implementation of the header component.

1. Using the Shadow DOM, passing content through a component attribute:
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

2. Using the Shadow DOM, passing content through a slot:
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

3. Using Light DOM - content as in a regular HTML element:
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

All three implementations in the browser look the same, but indexing services of search engines and other services recognize the content in these three implementations differently:
- some (like Google) correctly recognize the header in all three implementations;
- others are:
  - in the first implementation, the content is not recognized at all, because it is in the Shadow DOM;
  - in the second implementation, the heading text is indexed, but *is not interpreted as a heading*, because the `<h1>` tag is in the Shadow DOM;
  - and only in the third implementation the header in the `<h1>` tag is indexed in the Light DOM as in normal HTML.

If search engine optimization is important to you, then you need to use Light DOM to make content available for indexing.

### CSS Style Isolation

Shadow DOM isolates not only the styles of the component from the general styles of the page, but also the global styles of the page from the component itself.

This can sometimes create additional difficulties when you are using Web Components in an existing project where you already have a design system with global styles defined.

Also, using the same styles within multiple Web Components, such as styles for form fields, leads to an increase in code size and has a negative impact on page loading.

**LitWidget** allows you to [make global page styles available in the Shadow DOM](#sharing-css-styles-in-shadow-dom) of the Web component. This behavior is enabled by default, while the widget will track changes in page styles and when a new tag with styles appears, it will automatically be available in all widgets with global styles sharing enabled, so if you connect some APIs, for example, embed Maps , then their styles will be available in the Shadow DOM of the widgets.

### FUOC (Flash of unstyled content)

Web Components (custom elements) are 100% defined in JavaScript. That includes their HTML and CSS. Those are programmatically added to the DOM through APIs. By the time the browser has interpreted and executed that code, there is a good chance that the rendering pipeline has already put the custom element on the screen. Since it doesn't know about the element the first time around it will render it without the intended styling. After the JavaScript of the custom element definition is executed and the browser, therefore, knows about the CSS rules that apply to that element it can update the view.

Flash of unstyled content (FOUC) can cause irritating layout shifts as well as reveal content that should have been progressively disclosed.

FUOC occurs when using Shadow DOM in Web Components, but when using Light DOM there is no such problem, because all the content of the Web Component is immediately known to the browser and it can apply global page styles to it.


# Differences from LitElement

**LitWidget**, unlike **LitElement**, by default renders (`render`) all nested elements (Light DOM), thus **[Progressive Enhancement](https://en.wikipedia.org/wiki/Progressive_enhancement)** is achieved when the html page contains all the content that can be indexed by search robots, and not generates content with code. To change this behavior, just override the `render` method in the widget.

Also, **LitWidget** makes all page styles available in **shadowRoot** by default, see [Sharing CSS Styles for details](#sharing-css-styles-in-shadow-dom).


# Declarative binding

**LitWidget** allows Light DOM (and Shadow DOM too) to specify elements as targets for binding to class properties and handlers.

For example, if you specify an `input` property binding in a widget using the `@target` decorator:
```js
@customElement('w-hello')
class HelloWidget extends LitWidget {

  @target input

}
```
...it will be equivalent to something like this getter:
```js
@customElement('w-hello')
class HelloWidget extends LitWidget {

  get input() {
    return this.querySelector(`data-target="${this.tagName}.input"`);
  }

}
```
Thus, further in the class, an element from the Light DOM with the attribute `data-target="w-hello.input"` will be available like this: `this.input`.

### Targets

Targets are specified using the `data-target` attribute, as the value of the attribute, you must specify the name of the Web Component tag and, separated by a dot, the name of the target declared in the widget:
```html
<w-hello>
  <input type="text" data-target="w-hello.input" />
</w-hello>
```
> The tag name prefix is needed to avoid conflicts when inside the Light DOM of one widget there is another widget that might have a target with the same name.

### Multiple targets

If you need to specify multiple elements as an array of targets, you must use the `data-targets` attribute, where the value is the Web Component tag name and the target name, as in the case of a single `data-target`:
```html
<w-profile>
  <input type="text" name="home-email" data-targets="w-hello.emails" />
  <input type="text" name="work-email" data-targets="w-hello.emails" />
</w-profile>
```

## Binding child elements to targets

The binding of targets in the widget class is specified either using the [`@target`](#target) and [`@targets`](#targets) decorators, or through the [`targets`](#static-targets) and [`targetsAll`](#static-targetsall) static properties.

**Binding with decorators:**
```js
@customElement('w-profile')
class ProfileWidget extends LitWidget {

  // In Light DOM/Shadow DOM will be available
  // bind target data-target="w-profile.name"
  @target name;

  // Light DOM/Shadow DOM will be available
  // multiple binding targets
  // data-targets="w-profile.emails"
  @targets({name: 'emails'}) emailList;

}
```

**Binding with static properties:**
```js
class ProfileWidget extends LitWidget {

  // In Light DOM/Shadow DOM will be available
  // bind target data-target="w-profile.name"
  // for property "this.name"
  static targets = {
    name: {}
  }

  // In Light DOM/Shadow DOM will be available
  // multiple binding targets
  // data-targets="w-profile.emails"
  // for the "this.emailList" property
  static targetsAll = {
    emails: {property: 'emailList'}
  }

}
customElements.define('w-profile', ProfileWidget);
```

### Decorator syntax

#### `@target`

```js
@target[({ name?, selector?, cache = true, template = false })]
```

The property on which the decorator is applied will contain a reference to the target HTML element, or `null` if the target element is not found.


##### name, selector

By default, the `@target` decorator uses the property name as the target name:
```js
@target name;
```
...but you can pass a target name other than a property name to the decorator, like "profile-name":
```js
@target({name: 'profile-name'}) name;
```
...or CSS selector:
```js
@target({selector: '.profile-name'}) name;
```

##### cache

With the `cache` parameter, you can control the caching of the element query operation. By default, the `cache` parameter is set to `true`, so when the property is accessed, the target element is queried and the result is cached. If you want to query an element every time you access, you must set the `cache` parameter to `false`.

##### template

The `template` parameter allows you to specify that the `<template>` tag is used as the target element. In this case, the class property will point not to the tag, but to the content of the `<template>` tag (see [Lit#templateContent](https://lit.dev/docs/templates/directives/#templatecontent)).

#### `@targets`

```js
@targets[({ name?, selector?, cache = true })]
```

The property to which this decorator is applied will always contain an array of elements, including an empty array if no target element is found.

The `@targets` decorator takes almost the same parameters as [`@target`](#target), except for the `template` parameter.


### Syntax of static properties

#### static targets

Targets are specified as a key-value list, where the key is the name of the target, and the value is an object with parameters. All parameters are optional, if no parameter is specified, then you just need to specify an empty object `{}`.

```js
class HelloWidget extends LitWidget {

  static targets = {
    target_name: {
      property: String,
      selector: String,
      cache: Boolean = true,
      template: Boolean = false
    },
    target_name2: {},
    ...
  }

}
```

The `property` parameter allows you to specify the name of the class property that will be associated with the target element, if this parameter is not specified, the target name is used.

The example below declares two targets: a target element named "person" will be available in the class via the `this.person` property, and the target element "avatar" will be available in the class via the `this.person_image` property:
```js
class HelloWidget extends LitWidget {

  static targets = {
    avatar: {
      property: 'person_image'
    },
    person: {}
  }

}
```

Otherwise, the parameters are identical to those of the [`@target`](#target) decorator.


#### static targetsAll

Multiple targets are defined in the same way as single targets (see [static targets](#static-targets)):
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

See the [`@targets`](#targets) decorator for a description of the parameters.


## Listening to events

**LitWidget** automatically adds specially marked *public* class methods as event handlers when connected to a DOM element (in `connectedCallback`) and removes them when disconnected from a DOM element (in `disconnectedCallback`).

Event handlers are added to target elements specified in the DOM using the `data-target` and `data-targets` attributes (see [Targets](#targets)). One handler can be added to several elements at the same time, as well as handle several events at the same time.

If you specify a class method as the target's event handler:
```js
@customElement('w-hello')
class HelloWidget extends LitWidget {

  @onEvent('button', 'click')
  greet() {
    this.output.textContent = `Hello, ${this.input.value}!`;
  }

}
```
...if greatly simplified - this is equivalent to something like this:
```js
@customElement('w-hello')
class HelloWidget extends LitWidget {

  connectedCallback() {
    super.connectedCallback();

    this._greetBind = this.greet.bind(this);
    this.querySelector(`data-target="${this.tagName}.button"`).addEventListener('click', this._greetBind);
  }

  disconnectedCallback() {
    this.querySelector(`data-target="${this.tagName}.button"`).removeEventListener('click', this._greetBind);

    super.disconnectedCallback();
  }

  greet() {
    this.output.textContent = `Hello, ${this.input.value}!`;
  }

}
```

> **LitWidget** tracks the addition and removal of elements with target attributes (`data-target` and `data-targets`) in the Light DOM and Shadow DOM and automatically adds and removes handlers.

There are two ways to specify a class method as a DOM event handler, using the [`@onEvent()`](#onevent-decorator-syntax) decorator or the [`events`](#syntax-of-the-events-property) class property.

**Specifying an event handler with a decorator:**
```js
class LookupWidget extends LitWidget {

  @onEvent('input-field', 'input')
  typing(event) {
    ...
  }

}
```

**Specifying an event handler using the `events` property:**
```js
class LookupWidget extends LitWidget {

  events = [
    {target: 'input-field', event: 'input', handler: this.typing},
  ];

  typing(event) {
    ...
  }

}
```


### `@onEvent` decorator syntax

```js
onEvent(target, event, { [selector], [debounce], [throttle], [wrapper] })
```

#### target

The name of the target to add an event handler to an HTML element in the Light DOM with this target name (see [Targets](#targets)).

You can also pass an existing HTML element, `window` or `document` object to add an event handler to, for example, `document.body` or `window`:
```js
class SampleWidget extends LitWidget {

  @onEvent(window, 'resize')
  windowSizeChanged(event) {
    ...
  }

}
```

#### event

The name of the DOM event to which the handler is added.

#### selector

This parameter allows you to filter the triggering of delegated events by CSS selector.

> Using event delegation can reduce the number of event listeners used and therefore improve performance.

For example, instead of adding an event handler to each list item, you can add an event handler to the list itself, but filter by the list item selector:
```js
@customElement('w-sample')
class SampleWidget extends LitWidget {

  @onEvent('list', 'click', { selector: '.list-item' })
  itemClick(event) {
    ...
  }

}
```
```html
<w-sample>
  ...
  <div data-target="w-sample.list">
    <div class="list-item">Item 1</div>
    <div class="list-item">Item 2</div>
    <div class="list-item">Item 3</div>
    <div class="list-separator"></div>
    <div class="list-item">Item 4</div>
  </div>
  ...
</w-sample>
```
In the example above, the `itemClick(...)` handler will only fire on clicks on items in the `<div class="list-item">...</div>` list, but not on `<div class="list -separator"></div>`.


#### debounce, throttle

Optionally, you can set the frequency of the event handler firing, using the `debounce` or `throttle` parameters.

> **Attention!** You cannot specify both parameters at the same time.

* Debounce -
  postpones the handler call until a certain amount of time has passed since the last call.
  *This can be handy for events such as a keypress or an `input` event in input fields.*

* Throttle -
  skips events with a certain frequency.
  *This can be handy for `resize` or `scroll` events.*


You can specify the value in milliseconds as a number or as a string with suffix: `'<delay>ms'`, supported suffixes:
* ms - milliseconds,
* s - seconds,
* m - minutes.

```js
class SampleWidget extends LitWidget {

  @onEvent(window, 'resize', { throttle: '500ms' })
  windowSizeChanged(event) {
    ...
  }

}
```

#### wrapper

Wrapper function for applying additional decorators to the event handler; can be useful, for example, to apply the `debounce` decorator with a delay set at runtime:
```js
@onEvent(..., wrapper: (fn, self) => debounce(fn, self.delay * 1000) )
```

The first parameter passed to the function is the event handler method, the second is a reference to the class instance.


### Syntax of the `events` property

Event handlers are specified as an array of objects with parameters:
- target
- selector
- event
- handler
- debounce
- throttle
- wrapper

The `target`, `event` and `handler` parameters are required.

The `handler` parameter must point to a class method or function - an event handler.
> **Attention!** The `events` property is not static, therefore *you can* specify a link to a class method as a handler.

Otherwise, the parameters are identical to those of the [`@onEvent`](#onevent-decorator-syntax) decorator.

```js
class HelloWidget extends LitWidget {

  events = [
    // Handler for target element
    {target: 'button', event: 'click', handler: this.buttonClick},

    // Delegated event handler
    {target: 'list', selector: '.item', event: 'click', handler: this.listItemClick},

    // Frequency-limited event handler
    {target: 'search-field', event: 'input', handler: this.typing, debounce: '500ms'},

    // Conditional event handler
    {target: 'search-field', event: keydown(['Up', 'Down']), handler: this.navigate},

    // Global element event handler
    {target: document, event: 'click', handler: this.outsideClick},
  ]

}
```

### Conditional events

Conditional events allow you to restrict an event handler to fire under certain conditions, such as only when certain keys are pressed.

**LitWidget** allows you to specify an object consisting of two fields, `eventName` and `isMatch`, instead of the event name:
```js
{
  eventName: 'keydown',
  isMatch: (event) => event.key == 'ArrowUp',
}
```

* **eventName** - name of the event;
* **isMatch** - a function that takes an event as a parameter and returns a boolean value; if the function returned `true`, then the event handler will fire.

In the example below, the `keydown` event handler will only fire when the `Escape` button is pressed:
```js
class SampleWidget extends LitWidget {

  @onEvent(
    'search-field',
    {
      eventName: 'keydown',
      isMatch: (event) => event.key == 'Escape',
    }
  )
  cancel(event) {
    ...
  }

}
```
Condition handlers are conveniently organized as functions, the example above can be written like this:
```js
function keydown(key) {
  return {
    eventName: 'keydown',
    isMatch: (event) => event.key == key,
  };
}

class SampleWidget extends LitWidget {

  @onEvent('search-field', keydown('Escape'))
  cancel(event) {
    ...
  }

}
```


# Default values

Web components are often created for the purpose of their reuse in various scenarios. To do this, the components can be configured, for example, through attributes.

In `LitElement`, the component's [attributes are associated with class properties](https://lit.dev/docs/components/properties/#attributes) that can be set to default values. These values will be used if the attribute is not specified in the component's HTML markup:
```js
@customElement('my-element')
class MyElement extends LitElement {

  @property({type: String})
  mode = 'expand';

  @property({type: String})
  expandedClass = 'expanded';

}
```
```html
<my-element mode="collapse"></my-element>
```

Instead of just specifying default values, in **LitWidget** you can put the default values in a separate static property `defaultValues` and use these values to initialize properties:
```js
class MyElement extends LitWidget {

  static defaultValues = {
    mode: 'expand',
    expandedClass: 'expanded',
  }

  @property({type: String})
  mode = this.defaultValues.mode;

  @property({type: String})
  expandedClass = this.defaultValues.expandedClass;

}
```

This approach allows you to make the components more customizable, it becomes possible to configure default values globally for the entire component:
```js
MyElement.defaultValues.expandedClass = 'ui-expanded';
```

This can be handy if the components are generic and you want to be able to customize their behavior for a particular project, but you don't want to specify the same values every time you use the components.

> **Warning!** Inside the component, you must access `defaultValues` as a class property, not as a static property.

**LitWidget** automatically creates a class property getter that merges all `defaultValues` values from the entire class inheritance chain:
```js
class MyElement extends LitWidget {

  static defaultValues = {
    mode: 'expand',
    expandedClass: 'expanded',
  }

}

class MyCustomElement extends MyElement {

  static defaultValues = {
    hint: 'Click to expand',
    expandedClass: 'custom-expanded',
  }

  connectedCallback() {
    console.log(this.defaultValues);
  }

}
```

The example above will output to the console:
```js
{ mode: "expand", expandedClass: "custom-expanded", hint: "Click to expand" }
```


# Sharing CSS Styles in Shadow DOM

**LitWidget** allows you to make global page styles (`<style>` and `<link rel="stylesheet">`) available in the Web Component's Shadow DOM.

To do this, set the `sharedStyles` property to `true`:
```js
class SampleWidget extends LitWidget {
  sharedStyles = true
}
```

**LitWidget** will track changes in the global styles of the page, and when a new style tag appears, it will automatically be available in all widgets with `sharedStyles` enabled, so if you use any external APIs, for example, embed Maps, then the styles will be available in the Shadow DOM of the widgets.

If this behavior is to be disabled, then the `sharedStyles` property must be set to `false`.

If it is necessary to isolate some global styles from the Shadow DOM, then the `<style>`, `<link rel="stylesheet">` tags must be marked with the `data-shared="false"` attribute:
```html
<style type="text/css">
  .component {
    background-color: teal;
  }
</style>
<style type="text/css" data-shared="false">
  /* Styles in this tag will not be available in the Shadow DOM of widgets */
  .component {
    border: 1px solid red;
  }
</style>
```

By default, the `sharedStyles` property is set to `true` *unless Light DOM is used*. When using Light DOM - the value of the property is ignored, because global styles are always available in the Light DOM.
