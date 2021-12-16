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
        className.forEach(cls => {
            const sublist = cls.split(' ');
            sublist.forEach(sub => list.push(this.schemaName(sub)));
        });
        return list;
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
}