// https://github.com/ianstormtaylor/is-hotkey/blob/master/src/index.js

export class KeyboardShortcut {

  constructor(shortcut, {useKey = true} = {}) {
    // Generate F1-F20 codes
    for (let f = 1; f < 20; f++) {
      this.keyCodes['f' + f] = 111 + f;
    }

    this.useKey = useKey;
    this.shortcutName = shortcut.toLowerCase();
    this.shortcut = this.parse(this.shortcutName);
  }

  static get isMac() {
    return this._isMac ??= /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);
  }

  keyModifiers = {
    alt: 'altKey',
    control: 'ctrlKey',
    meta: 'metaKey',
    shift: 'shiftKey',
  }

  keyAliases = {
    add: '+',
    break: 'pause',
    cmd: 'meta',
    command: 'meta',
    ctl: 'control',
    ctrl: 'control',
    del: 'delete',
    down: 'arrowdown',
    esc: 'escape',
    ins: 'insert',
    left: 'arrowleft',
    mod: this.isMac ? 'meta' : 'control',
    opt: 'alt',
    option: 'alt',
    return: 'enter',
    right: 'arrowright',
    space: ' ',
    spacebar: ' ',
    up: 'arrowup',
    win: 'meta',
    windows: 'meta',
  }

  keyCodes = {
    backspace: 8,
    tab: 9,
    enter: 13,
    shift: 16,
    control: 17,
    alt: 18,
    pause: 19,
    capslock: 20,
    escape: 27,
    ' ': 32,
    pageup: 33,
    pagedown: 34,
    end: 35,
    home: 36,
    arrowleft: 37,
    arrowup: 38,
    arrowright: 39,
    arrowdown: 40,
    insert: 45,
    delete: 46,
    meta: 91,
    numlock: 144,
    scrolllock: 145,
    ';': 186,
    '=': 187,
    ',': 188,
    '-': 189,
    '.': 190,
    '/': 191,
    '`': 192,
    '[': 219,
    '\\': 220,
    ']': 221,
    '\'': 222,
  }

  toKeyName(name) {
    name = name.toLowerCase();
    name = this.keyAliases[name] || name;
    return name;
  }

  toKeyCode(name) {
    name = this.toKeyName(name);
    const code = this.keyCodes[name] || name.toUpperCase().charCodeAt(0);
    return code;
  }

  parse(shortcut) {
    const result = {};

    // Special case to handle the `+` key since we use it as a separator.
    shortcut = shortcut.replace('\\+', '+add');

    // Split keys
    const values = shortcut.split('+');
    const length = values.length;

    // Ensure that all the modifiers are set to false unless the hotkey has them.
    for (const k in this.keyModifiers) {
      result[this.keyModifiers[k]] = false;
    }

    for (let value of values) {
      // Optional key 'Shift?+a'
      const optional = value.endsWith('?') && (value.length > 1);
      if (optional) {
        value = value.slice(0, -1);
      }

      const name = this.toKeyName(value);
      const modifier = this.keyModifiers[name];

      // Validate modifier
      if ((value.length > 1) && !modifier && !this.keyAliases[value] && !this.keyCodes[name]) {
        throw new TypeError(`Unknown shortcut modifier: "${value}"`);
      }

      // Set key
      if (length === 1 || !modifier) {
        if (!!this.useKey) {
          result.key = name;
        } else {
          result.which = this.toKeyCode(value);
        }
      }

      // Set modifier
      if (modifier) {
        result[modifier] = optional ? null : true;
      }
    }

    return result;
  }

  isMatchEvent(event) {
    for (const key in this.shortcut) {
      const expected = this.shortcut[key];
      let actual;

      if (expected == null) {
        continue;
      }

      // Get actual key
      if (key === 'key' && event.key != null) {
        actual = event.key.toLowerCase();
      } else if (key === 'which') {
        actual = ((expected === 91) && (event.which === 93)) ? 91 : event.which;
      } else {
        actual = event[key];
      }

      // Check if actual is null or not expected
      if (actual == null && expected === false) {
        continue;
      }

      // Check if actual is equal to expected
      if (actual !== expected) {
        return false;
      }
    }

    // Store shortcut name inside event
    Object.defineProperty(event, 'shortcut', {
      value: this.shortcutName,
      writable: false
    });

    return true;
  }

}

export class KeyboardShortcuts {

  constructor(shortcuts) {
    if (!Array.isArray(shortcuts)) shortcuts = [shortcuts];
    this.shortcuts = shortcuts.map((s) => new KeyboardShortcut(s));
  }

  isMatchEvent(event) {
    return this.shortcuts.some((s) => s.isMatchEvent(event));
  }

}
