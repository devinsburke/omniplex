class htmlLibrary {
    appSchema;

    constructor(appSchema) {
        this.appSchema = appSchema;
    }

    // SECTION: Element Manipulation.
    buildElement(parent, tag, classList=[], attributeDict={}, innerText='') {
        var el = document.createElement(this.schemaName(tag));
        el.innerText = innerText;
        el.classList.add(...this.normalizeClasses(...classList));
        Object.entries(attributeDict).forEach(([name, value]) => el.setAttribute(this.schemaName(name, true), value));
        parent.appendChild(el);
        return el;
    }
    normalizeClasses(...classNames) {
        const list = [];
        classNames.forEach(cls => cls.split(' ').forEach(sub => list.push(this.schemaName(sub))));
        return list;
    }
    addClass = (element, className) => element.classList.add(this.schemaName(className));
    removeClass = (element, className) => element.classList.remove(this.schemaName(className));
    setClass = (element, className, value) => value ? this.addClass(element, className) : this.removeClass(element, className);
    hasClass = (element, className) => element.classList.contains(this.schemaName(className));
    countClass = (parent, className) => parent.getElementsByClassName(className).length;
    toggleClass = (element, className) => element.classList.toggle(this.schemaName(className));
    toggleOnClickOut(clickElement, className, applyClassToElement=clickElement) {
        className = this.schemaName(className);
        const listener = (e) => {
            if (!applyClassToElement.contains(e.target)) {
                applyClassToElement.classList.remove(className);
                applyClassToElement.ownerDocument.removeEventListener('click', listener);
            }
        }
        clickElement.addEventListener('click', () => {
            applyClassToElement.classList.toggle(className);
            if (applyClassToElement.classList.contains(className))
                applyClassToElement.ownerDocument.addEventListener('click', listener);
        });
    }

    addCss = (doc, cssText, id) => this.buildElement(doc.head, 'style', [], {'id': this.schemaName(id)}, cssText);
    getElement = (parent, id) => parent.getElementById(this.schemaName(id));
    deleteElement = (element) => el.parent.removeNode(element);
    clearElements(parent) {
        while (parent.firstChild)
            parent.firstChild.remove();
    }
    
    getAttribute = (element, attributeName) => element[this.schemaName(attributeName, true)];
    setAttribute = (element, attributeName, value) => element && (element.setAttribute(this.schemaName(attributeName, true), value));

    setOrDeleteAtKey = (obj, key, value) => value != null ? obj[key] = value : delete obj[key];
    setOrDeleteAtPath(obj, value, ...paths) {
        if (!paths)
            return value;

        let currentNode = obj;
        for (const i=0, l=paths.length-1; i < l; i++) {
            const path = paths[i];
            const nextNode = currentNode[path];
            if (nextNode == null) {
                if (value == null)
                    return obj;
                nextNode = {};
                currentNode[path] = nextNode;
            }
            currentNode = nextNode;
        }
        this.setOrDeleteAtKey(currentNode, paths[paths.length-1], value);
        return obj;
    }
    
    schemaName = (name, addDataPrefix=false) => !name.startsWith('-') ? name : `${addDataPrefix ? 'data-' : ''}${this.appSchema}${name}`;

    async forEachSync(obj, callback) {
        if (!obj)
            return;
        else if (Array.isArray(obj))
            for (var i = 0, l = obj.length; i < l; i++)
                await callback(i, obj[i]);
        else
            for (var prop of Object.keys(obj))
                await callback(prop, obj[prop]);
    }

    async forEachAsync(obj, callback) {
        if (!obj)
            return;
        if (Array.isArray(obj))
            await Promise.all(obj.map(async (o, i) => await callback(i, o)));
        else
            await Promise.all(Object.keys(obj).map(async k => await callback(k, obj[k])));
    }

    getUserData = async keys => await this.#storagePromise(this.#storageSyncGet, keys);
    setUserData = async (key, value) => await this.#storagePromise(this.#storageSyncSet, {[key]:value});
    setOrDeleteUserData = async (key, value) => value == null ? this.deleteUserData(key) : this.setUserData(key, value)
    deleteUserData = async key => await this.#storagePromise(this.#storageSyncRemove, key);

    #storageSyncSet = (data, fn) => chrome.storage.sync.set(data, fn);
    #storageSyncGet = (data, fn) => chrome.storage.sync.get(data, fn);
    #storageSyncRemove = (data, fn) => chrome.storage.sync.remove(data, fn);
    #storagePromise = (fn, param) => new Promise(async (pass, fail) => fn(param, d => chrome.runtime.lastError ? fail(Error(chrome.runtime.lastError.message)) : pass(d)));
}