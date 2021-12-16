class HideShowService {
    constructor(doc, appHandler, lib) {
        this.doc = doc;
        this.appHandler = appHandler;
        this.lib = lib;
    }

    initiate() {
        for (const ctrl of this.appHandler.getControlElements(this.doc)) {
            this.appendMenu(ctrl, 'filter');
        }
    }

    appendMenu(ctrl, kind) {
        this.lib.toggleOnClickOut(ctrl.container, ctrl.trigger, '-menu-open');
        const menu = this.lib.buildElement(ctrl.trigger, '-menu');
        switch (kind) {
            case 'filter':
                const attributes = ctrl.isRequired ? {'disabled': 'disabled'} : {};
                const hideAction = this.lib.buildElement(menu, '-action', ['-hide-filter'], attributes, `Hide the ${ctrl.titleText} filter`);
                hideAction.addEventListener('click', () => this.hideHandler(ctrl));
        }
    }

    hideHandler(ctrl) {
        ctrl.container.classList.add('omni-hidden');
        //alert(this.appHandler.getUniqueUrl(window.location));
    }
}