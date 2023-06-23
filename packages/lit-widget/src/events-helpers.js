import { KeyboardShortcuts } from './tools/keyboard';

export function keydown(shortcut) {
  const shortcuts = new KeyboardShortcuts(shortcut);
  return {
    eventName: 'keydown',
    isMatch: (e) => shortcuts.isMatchEvent(e),
  }
}

export function keyup(shortcut) {
  const shortcuts = new KeyboardShortcuts(shortcut);
  return {
    eventName: 'keyup',
    isMatch: (e) => shortcuts.isMatchEvent(e),
  }
}

export function keypress(shortcut) {
  const shortcuts = new KeyboardShortcuts(shortcut);
  return {
    eventName: 'keypress',
    isMatch: (e) => shortcuts.isMatchEvent(e),
  }
}
