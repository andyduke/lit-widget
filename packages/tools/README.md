
# A set of helper functions.

## debounce & throttle

### debounce

Debounce the execution of the method.

You can specify the value in milliseconds as a number or in string format with the suffix `'<delay>ms'`, supported suffixes: ms - milliseconds, s - seconds, m - minutes.

This can be handy for events such as key presses or "input" in input fields.

```js
@debounce('300ms')
inputChanged(event) {
  // ...
}
```

### throttle

Throttle the execution of the method.

You can specify the value in milliseconds as a number or in string format with the suffix `'<delay>ms'`, supported suffixes: ms - milliseconds, s - seconds, m - minutes.

This can be handy for "resize" or "scroll" events.

```js
@throttle('500ms')
resizeChanged(event) {
  // ...
}
```

### duration

Duration converter from human-readable form to milliseconds.

Converts a string like `'<delay>ms'` to milliseconds.
Supported suffixes: ms - milliseconds, s - seconds, m - minutes.

If a numeric value is passed, it is returned unchanged.

```js
const delayInMilliseconds = duration('500ms');
```
