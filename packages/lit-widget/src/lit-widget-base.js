import { LitElement } from 'lit';

export class LitWidgetBase extends LitElement {

  get targetAttribute() {
    return 'data-target';
  }

  get targetsAttribute() {
    return 'data-targets';
  }

  createTargetPath(tagName, targetName) {
    const tag = tagName.toLowerCase();
    return `${tag}.${targetName}`;
  }

  createTargetSelector(tagName, targetName) {
    const tag = tagName.toLowerCase();
    return `[${this.targetAttribute}~="${tag}.${targetName}"]`;
  }

  createTargetsSelector(tagName, targetName) {
    const tag = tagName.toLowerCase();
    return `[${this.targetsAttribute}~="${tag}.${targetName}"]`;
  }

  targetMatches(el, tagName, targetName) {
    const selector = this.createTargetSelector(tagName, targetName);
    return el.matches(selector);
  }

  targetsMatches(el, tagName, targetName) {
    const selector = this.createTargetsSelector(tagName, targetName);
    return el.matches(selector);
  }

  /**
   * findTarget will run `querySelectorAll` against the given widget element, plus
   * its shadowRoot, returning any the first child that:
   *
   *  - Matches the selector of `[data-target~="tag.name"]` where tag is the
   *    tagName of the HTMLElement, and `name` is the given `targetName` argument.
   *
   *  - Closest ascendant of the element, that matches the tagname of the
   *    widget, is the specific instance of the widget itself - in other
   *    words it is not nested in other widgets of the same type.
   *
   * @param {string} tagName - HTML element tag name
   * @param {string} targetName - Widget property name
   * @param {string} [selector] - Selector to find element instead of using [data-target]
   * @param {Function} [converter] - The result converter can be used to convert the tag, for example using templateContent
   * @returns {(HTMLElement|any|null)} The HTML element found, or null if no matching element was found
   */
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

    const targetSelector = this.createTargetSelector(tag, targetName);

    if (this.shadowRoot) {
      for (const el of this.shadowRoot.querySelectorAll(targetSelector)) {
        if (!el.closest(tag)) return convert(el);
      }
    }

    for (const el of this.querySelectorAll(targetSelector)) {
      if (el.closest(tag) === this) return convert(el);
    }
  }

  /**
   * findTargets will run `querySelectorAll` against the given widget element, plus
   * its shadowRoot, returning all matching child elements that are:
   *
   *  - Matches the selector of `[data-targets~="tag.name"]` where tag is the
   *    tagName of the HTMLElement, and `name` is the given `targetName` argument.
   *
   *  - Closest ascendant of the element, that matches the tagname of the
   *    widget, is the specific instance of the widget itself - in other
   *    words it is not nested in other widgets of the same type.
   *
   * @param {string} tagName - HTML element tag name
   * @param {string} targetName - Widget property name
   * @param {string} [selector] - Selector to find elements instead of using [data-targets]
   * @param {Function} [converter] - The result converter can be used to convert the result tags, for example using templateContent
   * @returns {HTMLElement[]} The HTML elements found
   */
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

    const targetsSelector = this.createTargetsSelector(tag, targetName);

    if (this.shadowRoot) {
      for (const el of this.shadowRoot.querySelectorAll(targetsSelector)) {
        if (!el.closest(tag)) {
          targets.push(convert(el));
        }
      }
    }

    for (const el of this.querySelectorAll(targetsSelector)) {
      if (el.closest(tag) === this) {
        targets.push(convert(el));
      }
    }

    return targets;
  }

}
