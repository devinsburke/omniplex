class AppHandler {
    *getControlElements(doc) { }
    getPageId(url) { }
}

class AppHandlerControlElement {
    constructor(context, container, trigger, titleText, uniqueId, isRequired) {
        this.context = context;
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