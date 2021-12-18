class HideShowService extends Service {
    initiate() {
        for (const ctrl of this.appHandler.getControlElements(this.doc)) {
            this.appendMenu(ctrl, 'filter');
        }
    }

    appendMenu(ctrl, kind) {
        const icon = this.lib.buildElement(ctrl.trigger, '-menu-trigger');
        const menu = this.lib.buildElement(icon, '-menu');
        this.lib.toggleOnClickOut(icon, icon, '-open');
        this.lib.addClass(ctrl.trigger, '-app-menu-container');

        switch (kind) {
            case 'filter':
                const attributes = ctrl.isRequired ? {'disabled': 'disabled'} : {};
                const hideAction = this.lib.buildElement(menu, '-action', ['-hide-filter'], attributes, `Hide the ${ctrl.titleText} ${kind}`);
                hideAction.addEventListener('click', () => this.hideCallback(ctrl));
        }
    }

    hideCallback(ctrl) {
        ctrl.container.classList.add('omni-hidden');
        //alert(this.appHandler.getPageId(window.location));
    }
}