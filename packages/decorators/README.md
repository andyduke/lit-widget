
# Decorators

A set of handy JavaScript decorators.


## autobind

Binds a class context to a method.

Allows you to use class methods as an event handler, without the additional `bind`:
```js
connectedCallback() {
  // ...
  this.addEventListener('click', this.toggle);
}

disconnectedCallback() {
  this.removeEventListener('click', this.toggle);
  // ...
}

@autobind()
toggle(event) {

}
```

Such methods can be used in `removeEventListener` since they are pointers to the same instance used in `addEventListener`.


## debounce

Debounce the execution of the method.

You can specify the value in milliseconds as a number or in string format with the suffix `'<delay>ms'`, supported suffixes: ms - milliseconds, s - seconds, m - minutes.

This can be handy for events such as key presses or "input" in input fields.

```js
@debounce('300ms')
inputChanged(event) {
  // ...
}
```


## throttle

Throttle the execution of the method.

You can specify the value in milliseconds as a number or in string format with the suffix `'<delay>ms'`, supported suffixes: ms - milliseconds, s - seconds, m - minutes.

This can be handy for "resize" or "scroll" events.

```js
@throttle('500ms')
resizeChanged(event) {
  // ...
}
```
