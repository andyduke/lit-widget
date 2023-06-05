import { LitWidgetBase } from './lit-widget-base';
import { throttle, debounce } from './tools/debounce';
import { ListenersMap } from './tools/listeners-map';

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
 *
 */
export class EventsController {

  observer;

  listeners = new ListenersMap();

  constructor(host, events) {
    // console.log('[2]', events);

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
    // let targetedEvents = new Set();

    for (const event of events) {
      let target;
      if ((event.target instanceof HTMLElement) || (event.target instanceof Document) || (event.target instanceof Window)) {
        target = {type: 'element', element: event.target};
      } else {
        // if (typeof event.target !== 'undefined') {
        //   target = {type: 'target', target: event.target, handler: event.handler};
        // } else if (typeof event.selector !== 'undefined') {
        //   target = {type: 'selector', selector: event.selector, handler: event.handler};
        // } else {
        //   throw new Error(`[LitWidget.EventsController]: Invalid event definition: ${JSON.stringify(event)}.`);
        // }

        /*if ((typeof event.target === 'object') && (typeof event.target['selector'] === 'string')) {
          target = {type: 'selector', selector: event.target['selector']};
        } else*/ if (typeof event.target === 'string') {
          target = {type: 'target', target: event.target, selector: event.selector};
        } else {
          throw new Error(`[LitWidget.EventsController]: Invalid event definition: ${JSON.stringify(event)}.`);
        }
      }

      targetedEvents.set(target, event);
      // targetedEvents.add(target);
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
    // Add listeners if attribute added
    let handler = (...args) => event.handler.apply(this.host, args);

    // TODO: Handle debounce, etc...
    if (event.debounce) {
      handler = debounce(handler, event.debounce);
    } else if (event.throttle) {
      handler = throttle(handler, event.throttle);
    }
    if (event['wrapper'] != null && typeof event['wrapper'] !== 'undefined') {
      handler = event.wrapper.call(this.host, handler/*, this.host*/);
    }

    // Handle delegated event
    if (typeof event.selector == 'string') {
      const prevHandler = handler;
      handler = (e) => {
        if (e.target.matches(event.selector)) {
          prevHandler(e);
        }
      };
    }

    // TODO: if eventName is preset -> wrap event._handler with `(event) => eventName.isMatch(event) ? event._handler : null`

    // Create event handler
    const eventHandler = new EventHandler(event.event, handler);

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
      /*
      const handlers = this.listeners.get(eventInfo.element) || [];
      handlers.push(eventHandler);
      this.listeners.set(eventInfo.element, handlers);
      */
    }
  }

  bindEvents(el, oldAttrValue) {
    // console.log('Bind actions:', el);

    // for (const event of this.events) {
    for (const [eventInfo, event] of this.events) {
      // if (eventInfo.type == 'element') continue;
      if (eventInfo.type !== 'target') continue;

      // console.log('Bind [1]:', el, eventInfo, event);

      // const isSelector = (eventInfo.type == 'selector');
      // const isMatch = isSelector
      //   ? el.matches(event.selector)
      //   : this.host.targetMatches(el, this.tagName, event.target) || this.host.targetsMatches(el, this.tagName, event.target);

      const isMatch = this.host.targetMatches(el, this.tagName, eventInfo.target) || this.host.targetsMatches(el, this.tagName, eventInfo.target);
      const isOldMatch = !isMatch && (oldAttrValue == this.host.createTargetPath(this.tagName, eventInfo.target));
      // const key = {element: el, target: eventInfo};
      const key = {element: el, id: event.id};

      // console.log('Bind [2]', key, 'is match =', isMatch, 'is old match =', isOldMatch, '*', this.tagName, eventInfo.target, el, event);
      // console.log('         key:', JSON.stringify(key));
      // console.log('         has key:', this.listeners.has(el, key));

      // TODO: Check selectors???

      if (isMatch) {
        // TODO: Multiple handlers via event.id?
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

        // console.log('   *', handler);

        // Remove element from listeners map
        this.listeners.delete(el, key);
      }

      /*
      if (isMatch) {
        console.log('Bind [3]:', el, event);

        // Skip nested (Shadow DOM Only!)
        const isShadowNode = el.getRootNode() === this.host.shadowRoot;
        if (isShadowNode && el.closest(this.tagName)) continue;

        // console.log('Bind [3]:', el, event);

        // Create event handler
        const eventHandler = this.createHandler(event);

        // Add listener to element
        eventHandler.addListener(el);

        // Store element's event handler
        const handlers = this.listeners.get(el) || [];
        handlers.push(eventHandler);
        this.listeners.set(el, handlers);
      } else if (isOldMatch && this.listeners.has(el)) {
        console.log('Bind [3]: Remove element listeners,', el);

        // TODO: Remove only oldAttrValue listener

        // Remove listeners if attribute removed
        const handlers = this.listeners.get(el) || [];
        for (const handler of handlers) {
          handler.removeListener(el);
        }

        // Remove element from listeners map
        this.listeners.delete(el);
      }
      */
    }

    // console.log('Listeners:', this.listeners);
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
      this.observer.observe(
        el,
        {
          childList: true,
          subtree: true,
          attributeFilter: [
            this.host.targetAttribute, this.host.targetsAttribute,
            // TODO: Observe class?
          ],
          attributeOldValue : true,
        }
      );
    }
  }

}
