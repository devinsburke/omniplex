class AppHandler {
    name = '';
    *getControlElements(doc) { }
    getPageId(url) { }
}

class AppHandlerControlElement {
    constructor(controlType, container, trigger, titleText, selector, isRequired) {
        this.controlType = controlType;
        this.container = container;
        this.trigger = trigger;
        this.titleText = titleText;
        this.selector = selector;
        this.isRequired = isRequired;
    }
}

class Service {
    constructor(doc, appHandler, lib) {
        this.doc = doc;
        this.appHandler = appHandler;
        this.lib = lib;
    }
    initiate() { }

    getPageSettings(urlObj) {
        return this.lib.getUserData(`app-${this.appHandler.name}-page-${this.appHandler.getPageId(urlObj)}`);
    }
}