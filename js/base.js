class AppHandler {
    schema;
    *getControlElements(doc) { }
    getTitleElement(doc) { }
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

class ServiceManager {
    constructor(lib) {
        this.lib = lib;
        this.services = [];
    }
    
    addServices = (app, services) => services.forEach(s => this.services.push(new s(document, app, this.lib)));
    triggerOnStart = async() => await this.lib.forEachAsync(this.services, async (_, s) => await s.onDocumentStart());
    triggerOnIdle = async() => await this.lib.forEachAsync(this.services, async (_, s) => await s.onDocumentIdle());
};

class Service {
    schema;

    constructor(doc, appHandler, lib) {
        this.appHandler = appHandler;
        this.doc = doc;
        this.lib = lib;
    }
    async onDocumentStart() { }
    async onDocumentEnd() { }
    async onDocumentIdle() { }

    #appSettingKey = (...namespaces) => `app-${this.appHandler.schema}-${this.schema}${namespaces ? '-' + namespaces.join('-') : ''}`;
    #appPageSettingKey = (urlObj) => this.#appSettingKey('page', this.appHandler.getPageId(urlObj));

    async getPageSettings(urlObj) {
        const settingKey = this.#appPageSettingKey(urlObj);
        const settings = await this.lib.getUserData(settingKey) || {};
        return settings[settingKey] || {};
    }

    async setPageSetting(urlObj, value, ...namespaces) {
        let settings = await this.getPageSettings(urlObj);
        settings = this.lib.setOrDeleteAtPath(settings, value, ...namespaces);
        return await this.lib.setUserData(this.#appPageSettingKey(urlObj), settings);
    }
}

var omni = new ServiceManager(new htmlLibrary('omni'));