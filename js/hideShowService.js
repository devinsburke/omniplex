class HideShowService extends Service {
    schema = 'hideShow';

    async initiate() {
        for (const ctrl of this.appHandler.getControlElements(this.doc)) {
            await this.appendMenu(ctrl);
            this.lib.setAttribute(ctrl.containerElement, '-control-metadata', ctrl.metadata);
        }
        const settings = await this.getPageSettings(window.location);
        await this.lib.forEachAsync(settings, async (_, ctrl) => await this.hideControl(ctrl));
    }

    async appendMenu(ctrl) {
        const icon = this.lib.buildElement(ctrl.labelElement, '-menu-trigger');
        const menu = this.lib.buildElement(icon, '-menu');
        this.lib.toggleOnClickOut(icon, '-open');
        this.lib.addClass(ctrl.labelElement, '-app-menu-container');

        switch (ctrl.metadata.controlType) {
            case 'filter':
            case 'form':
                const attributes = ctrl.metadata.isRequired ? {'disabled': 'disabled'} : {};
                const hideAction = this.lib.buildElement(menu, '-action', ['-hide-filter'], attributes, `Hide the ${ctrl.metadata.titleText} ${ctrl.metadata.controlType}`);
                hideAction.addEventListener('click', async () => await this.hideControl(ctrl));
        }
    }

    async hideControl(ctrl) {
        this.lib.addClass(ctrl.containerElement, '-hidden');
        this.lib.setAttribute(ctrl.containerElement, '-control-metadata', ctrl.metadata);

        if (!ctrl.metadata.isHidden) {
            ctrl.metadata.isHidden = true;
            await this.setPageSetting(window.location, ctrl.metadata, ctrl.metadata.uniqueId);
        }
    }
}