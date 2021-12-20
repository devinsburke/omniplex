class htmlLibrary {
    constructor(appPrefix) {
        this.appPrefix = appPrefix;
    }

    buildElement(parent, tag, classList=[], attributeDict={}, innerText='') {
        var el = document.createElement(this.schemaName(tag));
        el.innerText = innerText;
        el.classList.add(...this.normalizeClasses(...classList));
        Object.entries(attributeDict).forEach(([name, value]) => el.setAttribute(this.schemaName(name, true), value));
        parent.appendChild(el);
        return el;
    }
    
    normalizeClasses(...className) {
        const list = [];
        className.forEach(cls => cls.split(' ').forEach(sub => list.push(this.schemaName(sub))));
        return list;
    }

    addClass(element, className) {
        element.classList.add(this.schemaName(className));
    }

    toggleClass(element, className) {
        element.classList.toggle(this.schemaName(className));
    }

    toggleOnClickOut(container, trigger, className) {
        className = this.schemaName(className);
        const listener = (e) => {
            if (!container.contains(e.target)) {
                container.classList.remove(className);
                container.ownerDocument.removeEventListener('click', listener);
            }
        }
        trigger.addEventListener('click', () => {
            container.classList.toggle(className);
            if (container.classList.contains(className))
                container.ownerDocument.addEventListener('click', listener);
        });
    }
    
    schemaName(name, addDataPrefix=false) {
        return !name.startsWith('-') ? name : `${addDataPrefix ? 'data-' : ''}${this.appPrefix}${name}`;
    }

    forEach(obj, callback) {
        if (!obj)
            return;

        for (const prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                await callback(prop, obj[prop]);
            }
        }
    }

    getChromeError() {
        return chrome.runtime.lastError && Error(chrome.runtime.lastError.message);
    }

    getUserData(keys) {
        return new Promise((resolve, reject) => chrome.storage.sync.get(keys, result => {
            if (chrome.runtime.lastError)
                reject(Error(chrome.runtime.lastError.message));
            else
                resolve(result);
        }));
    }

    setUserData(data) {
        return new Promise((resolve, reject) => chrome.storage.sync.set(data, result => {
            if (chrome.runtime.lastError)
                reject(Error(chrome.runtime.lastError.message));
            else
                resolve(result);
        }));
    }
}