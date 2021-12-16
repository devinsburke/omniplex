class AppHandler {
    constructor() { }
    *getControlElements(doc) { alert('not implemented'); yield null; }
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
