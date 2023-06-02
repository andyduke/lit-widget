import { KeyboardShortcut } from './keyboard';

export function keydown(shortcut) {
  return {
    eventName: 'keydown',
    isMatch: (new KeyboardShortcut(shortcut)).isMatchEvent,
  }
}

export function keyup(shortcut) {
  return {
    eventName: 'keyup',
    isMatch: (new KeyboardShortcut(shortcut)).isMatchEvent,
  }
}

export function keypress(shortcut) {
  return {
    eventName: 'keypress',
    isMatch: (new KeyboardShortcut(shortcut)).isMatchEvent,
  }
}
