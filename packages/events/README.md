
# LitWidget conditional events helpers

Helper functions for LitWidget [conditional events](https://github.com/andyduke/lit-widget/blob/master/packages/lit-widget/DOCUMENTATION.md#conditional-events).

* `keydown()` - **keydown** event helper;
* `keyup()` - **keyup** event helper;
* `keypress()` - **keypress** event helper.

You can specify one or more keyboard shortcuts:
```js
class SampleWidget extends LitWidget {

  @onEvent('search-field', keydown('esc'))
  cancel(event) {
    ...
  }

  // or

  @onEvent('search-field', keydown(['esc', 'ctrl+k']))
  cancel(event) {
    ...
  }

}
```

For the keyboard shortcut format, see
[KeyboardShortcuts](https://github.com/andyduke/lit-widget/tree/master/packages/keyboard).
