import { KeyboardShortcuts } from '@simulacron/keyboard';

/**
 * **Keydown** event helper for [LitWidget](https://github.com/andyduke/lit-widget).
 *
 * You can specify one or more keyboard shortcuts:
 * ```js
 * keydown('mod+s')
 * // or
 * keydown(['mod+s', 'ctrl+k'])
 * ```
 *
 * For the keyboard shortcut format, see
 * [KeyboardShortcuts](https://github.com/andyduke/lit-widget/tree/master/packages/keyboard).
 *
 * @param {string|string[]} shortcut
 * @returns {object} Conditional event structure
 */
export function keydown(shortcut) {
  const shortcuts = new KeyboardShortcuts(shortcut);
  return {
    eventName: 'keydown',
    isMatch: (e) => shortcuts.isMatchEvent(e),
  }
}

/**
 * **Keyup** event helper for [LitWidget](https://github.com/andyduke/lit-widget).
 *
 * You can specify one or more keyboard shortcuts:
 * ```js
 * keyup('mod+s')
 * // or
 * keyup(['mod+s', 'ctrl+k'])
 * ```
 *
 * For the keyboard shortcut format, see
 * [KeyboardShortcuts](https://github.com/andyduke/lit-widget/tree/master/packages/keyboard).
 *
 * @param {string|string[]} shortcut
 * @returns {object} Conditional event structure
 */
export function keyup(shortcut) {
  const shortcuts = new KeyboardShortcuts(shortcut);
  return {
    eventName: 'keyup',
    isMatch: (e) => shortcuts.isMatchEvent(e),
  }
}

/**
 * **Keypress** event helper for [LitWidget](https://github.com/andyduke/lit-widget).
 *
 * You can specify one or more keyboard shortcuts:
 * ```js
 * keypress('mod+s')
 * // or
 * keypress(['mod+s', 'ctrl+k'])
 * ```
 *
 * For the keyboard shortcut format, see
 * [KeyboardShortcuts](https://github.com/andyduke/lit-widget/tree/master/packages/keyboard).
 *
 * @param {string|string[]} shortcut
 * @returns {object} Conditional event structure
 */
export function keypress(shortcut) {
  const shortcuts = new KeyboardShortcuts(shortcut);
  return {
    eventName: 'keypress',
    isMatch: (e) => shortcuts.isMatchEvent(e),
  }
}
