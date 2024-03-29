import { LitWidgetBase } from '../lit-widget-base';
import { throttle, debounce } from '../tools/debounce';
import { ListenersMap } from '../tools/listeners-map';

class EventHandler {

  constructor(eventName, handler) {
    this.eventName = eventName;
    this.handler = handler;
  }

  addListener(el) {
    el.addEventListener(this.eventName, this.handler);
  }

  removeListener(el) {
    el.removeEventListener(this.eventName, this.handler);
  }

}

/**
 * TODO:
 */
export class EventsController {

  host;

  observer;

  listeners = new ListenersMap();

  constructor(host, events) {
    if (!(host instanceof LitWidgetBase)) {
      throw new Error('[LitWidget.EventsController]: The host is not an instance of the LitWidget class.');
    }

    this.host = host;
    this.tagName = this.host.tagName.toLowerCase();
    this.events = this.prepareEvents(events);

    // console.log('Events:', this.events);

    this.host.addController(this);
  }

  prepareEvents(events) {
    let targetedEvents = new Map();

    for (const event of events) {
      let target;
      if ((event.target instanceof HTMLElement) || (event.target instanceof Document) || (event.target instanceof Window)) {
        target = {type: 'element', element: event.target};
      } else {
        if (typeof event.target === 'string') {
          target = {type: 'target', target: event.target, selector: event.selector};
        } else {
          throw new Error(`[LitWidget.EventsController]: Invalid event definition: ${JSON.stringify(event)}.`);
        }
      }

      targetedEvents.set(target, event);
    }

    // console.log('Targeted events:', targetedEvents);

    return targetedEvents;
  }

  hostConnected() {
    // console.log('[!] EventsController connected');

    // Bind [type=element] events to elements
    this.bindElementsEvents();

    // Bind element events to targets
    this.bindTargetElements(this.host);

    // Observe shadowRoot and element
    this.listen([this.host.shadowRoot, this.host]);
  }

  hostDisconnected() {
    // console.log('[!] EventsController disconnected');

    // Disconnect observer
    this.observer?.disconnect();
    this.observer = null;

    // Remove elements listeners
    for (const [element, target, handler] of this.listeners) {
      handler.removeListener(element);
    }
    this.listeners.clear();
  }

  createHandler(event) {
    // Event name
    let eventName = event.event;

    // Add listeners if attribute added
    let handler = (...args) => event.handler.apply(this.host, args);

    // Handling debounce, etc...
    if (event.debounce) {
      handler = debounce(handler, event.debounce);
    } else if (event.throttle) {
      handler = throttle(handler, event.throttle);
    }
    if (event['wrapper'] != null && typeof event['wrapper'] !== 'undefined') {
      handler = event.wrapper.call(this.host, handler, this.host);
    }

    // Handling delegated event
    if (typeof event.selector == 'string') {
      handler = (() => {
        const prevHandler = handler;
        return (e) => {
          if (e.target.matches(event.selector)) {
            prevHandler(e);
          }
        };
      })();
    }

    // Handle conditional event (eventName = {eventHandler: string, isMatch: function})
    if (typeof eventName == 'object') {
      const preset = eventName;
      if ((preset.eventName == null) || (typeof preset.isMatch !== 'function')) {
        throw new Error(`[LitWidget.EventsController]: Invalid conditional event: ${preset}`);
      }

      // Extract eventName from preset
      eventName = preset.eventName;

      // Wrap handler
      handler = (() => {
        const isMatch = preset.isMatch;
        const prevHandler = handler;
        return (e) => {
          if (isMatch(e)) {
            prevHandler(e);
          }
        };
      })();

    }

    // Create event handler
    const eventHandler = new EventHandler(eventName, handler);

    return eventHandler;
  }

  bindElementsEvents() {
    for (const [eventInfo, event] of this.events) {
      if (eventInfo.type !== 'element') continue;

      const key = {element: eventInfo.element, target: eventInfo};
      if (this.listeners.has(eventInfo.element, key)) continue;

      // Create event handler
      const eventHandler = this.createHandler(event);

      // Add listener to element
      eventHandler.addListener(eventInfo.element);

      // Store element's event handler
      this.listeners.set(eventInfo.element, key, eventHandler);
    }
  }

  bindEvents(el, oldAttrValue) {
    // console.log('Bind actions:', el);

    // for (const event of this.events) {
    for (const [eventInfo, event] of this.events) {
      if (eventInfo.type !== 'target') continue;

      const isMatch = this.host.targetMatches(el, this.tagName, eventInfo.target) || this.host.targetsMatches(el, this.tagName, eventInfo.target);
      const isOldMatch = !isMatch && (oldAttrValue == this.host.createTargetPath(this.tagName, eventInfo.target));
      const key = {element: el, id: event.id};

      if (isMatch) {
        if (this.listeners.has(el, key)) continue;

        // console.log('Bind [3] (+):', key, el, event);

        // Skip nested (Shadow DOM Only!)
        const isShadowNode = el.getRootNode() === this.host.shadowRoot;
        if (isShadowNode && el.closest(this.tagName)) continue;

        // Create event handler
        const eventHandler = this.createHandler(event);

        // Add listener to element
        eventHandler.addListener(el);

        // Store element's event handler
        this.listeners.set(el, key, eventHandler);
      } else if (isOldMatch) {
        if (!this.listeners.has(el, key)) continue;

        // console.log('Bind [3] (-):', key, el, event);

        // Remove listeners if attribute removed
        const handler = this.listeners.get(el, key);
        handler?.removeListener(el);

        // Remove element from listeners map
        this.listeners.delete(el, key);
      }
    }
  }

  bindTargetElements(root) {
    // Bind controller's targets
    for (const el of root.querySelectorAll(`[${this.host.targetAttribute}],[${this.host.targetsAttribute}]`)) {
      this.bindEvents(el);
    }

    // Also bind the controller to itself
    if (root instanceof Element && (root.hasAttribute(this.host.targetAttribute) || root.hasAttribute(this.host.targetsAttribute))) {
      this.bindEvents(root);
    }
  }

  listen(els) {
    if (!this.observer) {
      // Create observer
      this.observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
          if (mutation.type === 'attributes' && mutation.target instanceof Element) {
            this.bindEvents(mutation.target, mutation.oldValue);
          } else if (mutation.type === 'childList' && mutation.addedNodes.length) {
            for (const node of mutation.addedNodes) {
              if (node instanceof Element) {
                this.bindTargetElements(node);
              }
            }
          }
        }
      });
    }

    // Observe elements
    for (const el of els) {
      if (el == null) continue;

      this.observer.observe(
        el,
        {
          childList: true,
          subtree: true,
          attributeFilter: [
            this.host.targetAttribute,
            this.host.targetsAttribute,
          ],
          attributeOldValue : true,
        }
      );
    }
  }

}
