class HideShowService extends Service {
    initiate() {
        for (const ctrl of this.appHandler.getControlElements(this.doc)) {
            this.appendMenu(ctrl);
        }
    }

    appendMenu(ctrl) {
        const icon = this.lib.buildElement(ctrl.trigger, '-menu-trigger');
        const menu = this.lib.buildElement(icon, '-menu');
        this.lib.toggleOnClickOut(icon, icon, '-open');
        this.lib.addClass(ctrl.trigger, '-app-menu-container');

        switch (ctrl.context) {
            case 'filter':
            case 'form':
                const attributes = ctrl.isRequired ? {'disabled': 'disabled'} : {};
                const hideAction = this.lib.buildElement(menu, '-action', ['-hide-filter'], attributes, `Hide the ${ctrl.titleText} ${ctrl.context}`);
                hideAction.addEventListener('click', () => this.hideCallback(ctrl));
        }
    }

    hideCallback(ctrl) {
        this.lib.addClass(ctrl.container, '-hidden');
        //alert(this.appHandler.getPageId(window.location));
    }
}