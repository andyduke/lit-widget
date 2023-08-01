
# Keyboard helpers

Helper classes and functions for working with the keyboard.


## KeyboardShortcut

Class for handling keyboard shortcut. Typically used in browser keyboard event handlers.

You must instantiate the class with the keyboard shortcut,
and then use the `isMatchEvent()` method to test for the keyboard event:
```js
const shortcut = new KeyboardShortcut('mod+s');

element.addEventListener('keydown', function(event) {
  if (shortcut.isMatch(event)) {
    // Do action...
  }
});
```

### Keyboard shortcuts format

Keyboard shortcuts are specified using a simple format such as `'modifier+key'`,
`'modifier+modifier+key'`, or simply `'key'`.

`Modifiers` can be:
- `mod` - cross-platform modifier, Ctrl on Windows and Cmd on Mac;
- `ctrl`, `ctl` - Control on Windows;
- `alt`, `opt`, `option` - Alt;
- `shift` - Shift;
- `meta` - cross-platform modifier, Win on Windows, Cmd on Mac;
- `win`, `windows` - Win on Windows;
- `cmd`, `command` - Cmd on Mac.

`Key` is any value from the predefined `KeyboardEvent.key` keys, specified in any case.

The class provides some aliases for the keys from the `KeyboardEvent`, such as:
- `esc` - 'Escape' key;
- `return` - 'Enter' key;
- `space`, `spacebar` - 'spacebar' key;
- `add` - '+' key;
- `break` - 'Pause' key;
- `ins` - 'Insert' key;
- `del` - 'Delete' key;
- `up` - 'ArrowUp' key;
- `down` - 'ArrowDown' key;
- `left` - 'ArrowLeft' key;
- `right` - 'ArrowRight' key.

> This class is inspired by the `is-hotkey` package from Ian Storm Taylor <https://github.com/ianstormtaylor>


## KeyboardShortcuts

A class for handling *multiple* keyboard shortcuts.

It is used when it is necessary to use one handler
for several keyboard shortcuts.

```js
const shortcuts = new KeyboardShortcuts([
  'mod+s',
  'ctrl+k',
]);

element.addEventListener('keydown', function(event) {
  if (shortcuts.isMatch(event)) {
    // Do action...
  }
});
```

See [KeyboardShortcut](#keyboardshortcut) for details.
