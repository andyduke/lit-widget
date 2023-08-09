
# R-Layout - Adaptive layouts in SCSS

[ ENGLISH | [RUSSIAN](./README.ru.md) ]

The package allows you to define a set of parameters for adaptive user interface components.

For example, you need to create an information block with a heading and text:
```html
<div class="block">

  <!-- Heading -->
  <div class="block-heading">
    Heading
  </div>

  <!-- Text -->
  <div class="block-text">
    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed dapibus, ante ultricies adipiscing pulvinar, enim tellus volutpat odio, vel pretium ligula purus vel ligula.
  </div>

</div>
```

This block must be adaptive, i.e. have different margins and font sizes for different breakpoints.

Usually in SCSS this is implemented like this:
```scss
.block {

  // Heading styling
  .block-heading {

    // Styles for small screens
    @media only screen and (max-width: 767px) {
      font-size: 18px;
      line-height: 1.3;
      margin-bottom: 24px;
    }

    // Styles for big screens
    @media only screen and (min-width: 768px) {
      font-size: 20px;
      line-height: 1.2;
      margin-bottom: 32px;
    }

  }

  // Text styling
  .block-text {

    // Styles for small screens
    @media only screen and (max-width: 767px) {
      font-size: 16px;
    }

    // Styles for big screens
    @media only screen and (min-width: 768px) {
      font-size: 18px;
      line-height: 1.3;
    }

  }

}
```

With **R-Layout** this can be defined like this:
```scss
@include rl.define-layout(
  // Layout name
  $name: 'block',

  // Breakpoints
  $sizes: (
    small:    (max: 767px),
    large:   (min: 768px),
  ),

  // Layout parameter values
  $values: (

    // Small screen parameters
    small: (

      // Heading parameters
      heading: (
        font-size: 18px,
        line-height: 1.3,
        margin: (
          bottom: 24px,
        ),
      ),

      // Text parameters
      text: (
        font-size: 16px,
      ),

    ),

    // Large screen parameters
    large: (

      // Heading parameters
      heading: (
        font-size: 20px,
        line-height: 1.2,
        margin: (
          bottom: 32px,
        ),
      ),

      // Text parameters
      text: (
        font-size: 18px,
        line-height: 1.3,
      ),

    ),

  ),
);

.block {

  @include rl.layout(block) {

    // Heading styling
    .block-heading {
      font-size: rl.value(heading, font-size);
      line-height: rl.value(heading, line-height);
      margin-bottom: rl.value(heading, margin, bottom);
    }

    // Text styling
    .block-text {
      font-size: rl.value(text, font-size);
      line-height: rl.value(text, line-height);
    }

  }

}
```

Thus, it simplifies the management of adaptive layout, for example, you can easily change breakpoints in a single place or even add another one, and it is also easier to change some layout parameters, such as margins or font size.


## Installation

You can install the package via NPM:
```sh
npm install @simulacron/r-layout
```

After that, you need to add the `./node_modules` path to the `--load-path=` parameter when calling `sass`:
```sh
sass --load-path=./node_modules styles.scss:styles.css
```

Now you can use `r-layout` in your scss.


### Import with `@use`

When imported via `@use`, mixins and functions will be available in the `rl` namespace:

```scss
@use "@simulacron/r-layout/rl";

@include rl.define-layout(
  ...
);

...

@include rl.layout(...) {

  font-size: rl.value(...);

}
```


### Import with `@import`

When importing via `@import`, mixins and functions in the global namespace will be available:

```scss
@import '@simulacron/r-layout';

@include r-define-layout(
  ...
);

...

@include r-layout(...) {

  font-size: rl-value(...);

}
```

### Mapping names of mixins and functions

Please note that mixins and functions have different names for different import methods. Below is a table of name mappings for different import methods:

| `@use`                  | `@import`               |
|-------------------------|-------------------------|
| `rl.define-layout`      | `r-define-layout`       |
| `rl.layout`             | `r-layout`              |
| `rl.value`              | `rl-value`              |
| `rl.def-value`          | `rl-def-value`          |
| `rl.layout-value`       | `rl-layout-value`       |
| `rl.layout-def-value`   | `rl-layout-def-value`   |


## Usage

First you need to [define the layout](#layout-definition-define-layout) and its parameters, and then you can [use the layout](#using-the-layout-layout) to generate blocks of [media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries).


### Layout definition (define-layout)

The layout is defined using the `rl.define-layout(...)` mixin.

```scss
@include rl.define-layout(
  $name: 'intro',
  $sizes: (
    small:    (max: 767px),
    large:   (min: 768px),
  ),
  $values: (
    small: (
      font-size: 16px,
    ),
    large: (
      font-size: 18px,
    ),
  ),
);
```

The mixin has 3 required parameters:
* `$name` - layout name, used in `rl.layout(...)`;
* `$sizes` - layout breakpoints;
* `$values` - layout parameters.


#### Breakpoints

Breakpoints `$sizes` are specified as a [Map](https://sass-lang.com/documentation/values/maps/) with a list of breakpoint names and media query conditions:
```scss
(
  breakpoint-name: (
    min: XX,
    max: YY,
    orientation: ZZ
  )
)
```

Breakpoint names are used when specifying layout parameters for each breakpoint.

Conditions for a media query are specified using three values:

* `min` - minimum screen width;
* `max` - maximum screen width;
* [`orientation`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/orientation) - screen orientation.

> **Attention!** All values are optional, but at least one must always be specified.

For example, if you specify:
```scss
(
  small: (max: 767px),
  medium: (min: 768px, max: 1023px),
  large: (min: 1024px),
)
```
...this would be equivalent to:
```css
@media screen and (max-width: 767px) {...}
@media screen and (min-width: 768px, max-width: 1023px) {...}
@media screen and (min-width: 1024px) {...}
```


#### Layout parameters

Layout parameters are set in `$values` as a [Map](https://sass-lang.com/documentation/values/maps/) for each breakpoint defined in `$sizes`:
```scss
(
  small: (...),
  large: (...),
)
```

For a breakpoint, a parameter map is specified in an arbitrary format. Parameter map supports nested maps:
```scss
small: (
  font-size: 16px,
  spacing: (
    v-spacing: 24px,
  ),
),
```

> The set of parameters for different breakpoints may differ. For example, a breakpoint for narrow screens may not have a horizontal spacing parameter. In this case, the `rl.value(...)` function will return `null` for a parameter missing in the breakpoint parameters and the CSS property will not be generated.

```scss
(
  small: (
    font-size: 16px,
    spacing: (
      // h-spacing is not specified for this breakpoint
      v-spacing: 24px,
    ),
  ),
  large: (
    font-size: 18px,
    spacing: (
      h-spacing: 16px,
      v-spacing: 24px,
    ),
  ),
)
```


---

### Using the layout (layout)

Once a layout is [defined](#layout-definition-define-layout), it can be used to generate media query blocks using the `rl.layout(...)` mixin.

Inside the layout, to get the parameter, you need to use the `rl.value(...)` function:

```scss
.selector {

  @include rl.layout(block) {
    font-size: rl.value(font-size);
  }

}
```

**Attention!** Since the `@rl-layout(...)` mixin repeats its content for each breakpoint, only adaptive CSS constructs should be placed inside it.

If a layout parameter is nested (a map within a map), to access such a parameter, you need to pass the entire path to it in the `rl.value(...)` function *(as sequential parameters)*, for example:
```scss
@include rl.define-layout(
  ...
  // Parameter defined as nested map
  spacing: (
    top: 32px,
    bottom: 64px,
  )
  ...
);

@include rl.layout(...) {
  // Getting the value of the bottom parameter in spacing
  margin-bottom: rl.value(spacing, bottom);
}
```

> Nesting of parameters can be any depth.

If the parameter is not found in the layout, then the function will return `null`.


#### Using layout parameters in math expressions

When using parameters inside a mathematical expression, an error may occur if the parameter is not present in one of the breakpoints or if it is equal to zero (division-by-zero error). To avoid such errors, in mathematical expressions, instead of the `rl.value(...)` function, use the `rl.def-value(...)` function, in which the default value is passed in the first parameter:

```scss
width: (100% / rl.def-value(1, columns-count));
```
