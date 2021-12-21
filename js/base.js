class AppHandler {
    schema;
    *getControlElements(doc) { }
    getPageId(url) { }
}

class ControlElementWrapper {
    constructor(containerElement, labelElement, controlElementMetadata) {
        this.containerElement = containerElement;
        this.labelElement = labelElement;
        this.metadata = controlElementMetadata;
    }
}
class ControlElementMetadata {
    constructor(uniqueId, controlType, titleText, selector, isRequired, isHidden) {
        this.uniqueId = uniqueId;
        this.controlType = controlType;
        this.titleText = titleText;
        this.selector = selector;
        this.isRequired = isRequired;
        this.isHidden = isHidden;
    }
}

class Service {
    schema;

    constructor(doc, appHandler, lib) {
        this.doc = doc;
        this.appHandler = appHandler;
        this.lib = lib;
    }
    async initiate() { }
    #appSettingKey = (...namespaces) => `app-${this.appHandler.schema}-${this.schema}${namespaces ? '-' + namespaces.join('-') : ''}`;
    #appPageSettingKey = (urlObj) => this.#appSettingKey('page', this.appHandler.getPageId(urlObj));

    async getPageSettings(urlObj) {
        return await this.lib.getUserData(this.#appPageSettingKey(urlObj)) || {};
    }

    async setPageSetting(urlObj, value, ...namespaces) {
        let settings = await this.getPageSettings(urlObj);
        settings = this.lib.setOrDeleteAtPath(settings, value, ...namespaces);
        return await this.lib.setUserData(this.#appPageSettingKey(urlObj), settings);
    }
}