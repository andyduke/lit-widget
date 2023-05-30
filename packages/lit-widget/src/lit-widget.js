import { LitElement, html } from 'lit';
import { templateContent } from 'lit/directives/template-content.js';
import { throttle, debounce, duration } from './debounce';

/**
 * Declarative binding to child elements for [LitElement](https://lit.dev/)
 * like [Github/Catalyst](https://catalyst.rocks/) and
 * [Stimulus.js](https://stimulus.hotwired.dev/).
 *
 * To define a widget, subclass LitWidget, specify targets using
 * the @target/@targets decorators or the targets/targetsAll static property,
 * and add event handlers using the @onEvent decorator or
 * the static events property.
 *
 * LitWidget unlike LitElement implements the **`render()`** method,
 * which renders all child elements of the widget through `<slot>`.
 * To change this behavior, simply override the `render` method and
 * implement your own rendering.
 *
 * LitWidget makes all page styles (both `<style>` and `<link>` tags) available
 * in **shadowRoot** by default (except styles with the `[data-shared="false"]` attribute),
 * this behavior can be disabled by setting the `sharedStyles` static property to `false`.
 */
export class LitWidget extends LitElement {

  static widget(name) {
    return function(proto, options) {
      LitWidget.define(name, proto, options);
    }
  }

  static define(name, constructor, options) {
    customElements.define('w-' + name, constructor, options);
  }

  render() {
    return html`<slot></slot>`;
  }

  /**
   * Specifies whether to import page styles into shadowRoot.
   */
  static sharedStyles = true

  createRenderRoot() {
    // Find handle [data-root]
    let shadowRoot = true;
    let root;
    const tagName = this.tagName.toLowerCase();
    const rootElement = this.querySelector(`[data-root="${tagName}"]`);
    if (!!rootElement && rootElement.closest(tagName) == this) {
      root = rootElement;
      shadowRoot = false;
    } else {
      root = super.createRenderRoot();
    }

    const sharedStyles = Object.getPrototypeOf(this).constructor.sharedStyles;

    if (shadowRoot && sharedStyles) {
      // Import styles
      for (const style of document.head.querySelectorAll('style')) {
        if (style.getAttribute('data-shared') == 'false') continue;
        const styleClone = style.cloneNode(true);
        root.insertBefore(styleClone, root.firstChild);
      }

      // Import link[stylesheet]
      for (const style of document.head.querySelectorAll('link[rel="stylesheet"]')) {
        if (style.getAttribute('data-shared') == 'false') continue;
        const styleClone = style.cloneNode(true);
        root.insertBefore(styleClone, root.firstChild);
      }
    }

    return root;
  }

  connectedCallback() {
    super.connectedCallback();

    setTimeout(() => this._attachEvents());
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    setTimeout(() => this._detachEvents());
  }

  get _events() {
    const klass = Object.getPrototypeOf(this).constructor;
    return klass.events || [];
  }

  _attachEvents() {
    for (const event of this._events) {
      if (event.debounce && event.throttle) {
        throw new Error(`[LitWidget "${$this.tagName.toLowerCase()}"] For the event "${event.event}", debounce and throttle are specified, you can specify only one thing.`);
      }

      const target = this.findTarget(this.tagName, event.target);
      if (target) {
        let handler = event.handler;
        if (typeof handler === 'string') handler = this[handler];

        event._handler = (...args) => handler.apply(this, args);

        if (event.debounce) {
          event._handler = debounce(event._handler, duration(event.debounce));
        } else if (event.throttle) {
          event._handler = throttle(event._handler, duration(event.throttle));
        }

        if (event['wrapper'] != null && typeof event['wrapper'] !== 'undefined') {
          event._handler = event.wrapper.call(this, event._handler, this);
        }

        target.addEventListener(event.event, event._handler);
      } else {
        throw new Error(`[LitWidget "${this.tagName.toLowerCase()}"] Event target "${event.target}" not found.`);
      }
    }
  }

  _detachEvents() {
    for (const event of this._events) {
      if (!!event._handler) {
        target.addEventListener(event.event, event._handler);
      }
    }
  }

  findTarget(tagName, targetName, selector = null, converter = null) {
    let convert = (value) => !!converter ? converter(value) : value;
    const tag = tagName.toLowerCase();

    if (!!selector) {
      for (const el of this.querySelectorAll(selector)) {
        if (el.closest(tag) === this) {
          return convert(el);
        }
      }
    }

    if (this.renderRoot) {
      for (const el of this.renderRoot.querySelectorAll(`[data-target~="${tag}.${targetName}"]`)) {
        if (!el.closest(tag)) return convert(el);
      }
    }

    for (const el of this.querySelectorAll(`[data-target~="${tag}.${targetName}"]`)) {
      if (el.closest(tag) === this) return convert(el);
    }
  }

  findTargets(tagName, targetName, selector = null, converter = null) {
    let convert = (value) => !!converter ? converter(value) : value;
    const tag = tagName.toLowerCase();
    const targets = [];

    if (!!selector) {
      for (const el of this.querySelectorAll(selector)) {
        if (el.closest(tag) === this) {
          targets.push(convert(el));
        }
      }
    }

    if (this.renderRoot) {
      for (const el of this.renderRoot.querySelectorAll(`[data-targets~="${tag}.${targetName}"]`)) {
        if (!el.closest(tag)) {
          targets.push(convert(el));
        }
      }
    }

    for (const el of this.querySelectorAll(`[data-targets~="${tag}.${targetName}"]`)) {
      if (el.closest(tag) === this) {
        targets.push(convert(el));
      }
    }

    return targets;
  }

}

LitWidget.addInitializer((instance) => {
  const klass = Object.getPrototypeOf(instance).constructor;

  if (typeof klass.targets !== 'undefined') {
    for (const [target, options] of Object.entries(klass.targets)) {
      // Add target getter
      Object.defineProperty(instance, target, {
        configurable: true,
        get() {
          if (typeof this._findCache === 'undefined') {
            this._findCache = {};
          }

          if (this._findCache[target]) {
            return this._findCache[target];
          } else {
            const targetElement = this._findCache[target] ??= this.findTarget(this.tagName, target, options.selector, options.template ? (value) => templateContent(value) : null);
            if (targetElement == null) {
              console.error(`[LitWidget "${klass.name}"] Target "${target}" not found.`);
            } else {
              this._findCache[target] = targetElement;
            }
            return targetElement;
          }
        }
      });
    }
  }

  if (typeof klass.targetsAll !== 'undefined') {
    for (const [target, options] of Object.entries(klass.targetsAll)) {
      // Add target getter
      Object.defineProperty(instance, target, {
        configurable: true,
        get() {
          if (typeof this._findCache === 'undefined') {
            this._findCache = {};
          }
          return this._findCache[target] ??= this.findTargets(this.tagName, target, options.selector, options.template ? (value) => templateContent(value) : null);
        }
      });
    }
  }
});
