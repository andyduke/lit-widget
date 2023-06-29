
class DocumentStylesObserver {

  document;

  observer;

  observing;

  listeners;

  constructor(document) {
    this.document = document;
    this.listeners = new Set();
    this.observing = false;

    this.observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && (mutation.addedNodes.length || mutation.removedNodes.length)) {
          // console.log('! [+]', mutation.addedNodes);
          // console.log('! [-]', mutation.removedNodes);

          for (const node of mutation.addedNodes) {
            if (node instanceof Element) {
              const tagName = node.tagName.toLowerCase();
              if ((tagName == 'style') || (tagName == 'link' && node.getAttribute('rel') == 'stylesheet')) {
                this.notifyListeners({type: 'add', node});
              }
            }
          }

          for (const node of mutation.removedNodes) {
            if (node instanceof Element) {
              const tagName = node.tagName.toLowerCase();
              if ((tagName == 'style') || (tagName == 'link' && node.getAttribute('rel') == 'stylesheet')) {
                this.notifyListeners({type: 'remove', node});
              }
            }
          }

        }
      }
    });
  }

  observe() {
    if (this.observing) return;

    this.observer.observe(
      this.document.head,
      {
        childList: true,
        subtree: true,
      }
    );

    this.observing = true;
  }

  disconnect() {
    if (!this.observing) return;

    this.observer.takeRecords();
    this.observer.disconnect();

    this.observing = false;
  }

  addListener(fn) {
    this.listeners.add(fn);
    if (this.listeners.size > 0) {
      this.observe();
    }
  }

  removeListener(fn) {
    this.listeners.delete(fn);
    if (this.listeners.size == 0) {
      this.disconnect();
    }
  }

  notifyListeners(operation) {
    for (const listener of this.listeners) {
      listener(operation);
    }
  }

}

/**
 * TODO:
 */
export class SharedStylesController {

  host;

  static observer;

  initialized = false;

  styleRoot;
  styles = new WeakMap();

  constructor(host, sharedStyles) {
    if (sharedStyles) {
      this.host = host;
      this.host.addController(this);
      this.stylesUpdated = (o) => this.updated(o);
    }
  }

  hostConnected() {
    const shadowRoot = this.host.shadowRoot != null;

    if (!this.initialized) {
      this.initialized = true;

      const root = this.host.renderRoot;
      const document = this.host.ownerDocument;

      if (shadowRoot) {
        // Import styles
        for (const style of document.head.querySelectorAll('style')) {
          this.addStyle(style, root);
        }

        // Import link[stylesheet]
        for (const style of document.head.querySelectorAll('link[rel="stylesheet"]')) {
          this.addStyle(style, root);
        }
      }
    }

    if (shadowRoot) {
      this.startObserving();
    }
  }

  addStyle(style, root = null) {
    // Skip non-shared styles
    if (style.getAttribute('data-shared') == 'false') return;

    if (root == null) root = this.host.renderRoot;

    // Create styleRoot
    if (this.styleRoot == null) {
      this.styleRoot = this.host.ownerDocument.createElement('shared-styles--');
      root.insertBefore(this.styleRoot, root.firstChild);
    }

    // Cloning and adding a style
    const styleClone = style.cloneNode(true);
    this.styleRoot.appendChild(styleClone);

    // Save the link between the style and its clone
    this.styles.set(style, styleClone);
  }

  removeStyle(style) {
    const styleClone = this.styles.get(style);
    if (styleClone != null) {
      styleClone.remove();
      this.styles.delete(style);
    }
  }

  hostDisconnected() {
    this.stopObserving();
  }

  startObserving() {
    // Create observer
    if (SharedStylesController.observer == null) {
      SharedStylesController.observer = new DocumentStylesObserver(this.host.ownerDocument);
    }

    // Start observing
    SharedStylesController.observer.addListener(this.stylesUpdated);
  }

  stopObserving() {
    if (SharedStylesController.observer != null) {
      SharedStylesController.observer.removeListener(this.stylesUpdated);
    }
  }

  updated({type, node}) {
    switch(type) {
      case 'add':
        this.addStyle(node);
        break;

      case 'remove':
        this.removeStyle(node);
        break;
    }
  }

}
