class AppHandler {
    *getControlElements(doc) { }
    getPageId(url) { }
}

class AppHandlerControlElement {
    constructor(container, trigger, titleText, uniqueId, isRequired) {
        this.container = container;
        this.trigger = trigger;
        this.titleText = titleText;
        this.uniqueId = uniqueId;
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
}