class HideShowService extends Service {
    schema = 'hideShow';
    pageMenu = {};
    hiddenControls = [];

    async onDocumentStart() {
        const settings = await this.getPageSettings(window.location);
        const css = Object.entries(settings)
            .filter(([_, m]) => m.isHidden)
            .reduce((a, [_, m]) => a + `${m.selector}{display:none;}\n`, '');
        this.lib.addCss(this.doc, css, '-explicit-hidden');
    }

    async onDocumentIdle() {
        const settings = await this.getPageSettings(window.location);

        const title = this.appHandler.getTitleElement(this.doc);
        this.pageMenu = await this.appendMenu(title);

        for (const ctrl of this.appHandler.getControlElements(this.doc)) {
            const menu = await this.appendMenu(ctrl.labelElement);
            const attributes = ctrl.metadata.isRequired ? {'disabled': 'disabled'} : {};
            const hideAction = this.lib.buildElement(menu, '-action', ['-hide-filter'], attributes, `Hide ${ctrl.metadata.controlType}: ${ctrl.metadata.titleText}`);
            hideAction.addEventListener('click', async () => await this.hideControl(ctrl));

            const storedMetadata = settings[ctrl.metadata.uniqueId];
            if (storedMetadata) {
                ctrl.metadata = storedMetadata;
                await this.hideControl(ctrl);
            }
        }
        this.lib.getElement(this.doc, '-explicit-hidden').remove();
    }

    appendMenu(element) {
        const icon = this.lib.buildElement(element, '-menu-trigger');
        const menu = this.lib.buildElement(icon, '-menu');
        this.lib.toggleOnClickOut(icon, '-open');
        this.lib.addClass(element, '-app-menu-container');
        return menu;
    }

    appendUnhideMenu(element) {
        this.hiddenControls = this.hiddenControls.sort(
            (a, b) => a.metadata.controlType.localeCompare(b.metadata.controlType)
                || a.metadata.titleText.localeCompare(b.metadata.titleText)
        );
        this.lib.clearElements(element);
        for (const ctrl of this.hiddenControls) {
            const action = this.lib.buildElement(element, '-action', ['-hide-filter'], {}, `Unhide ${ctrl.metadata.controlType}: ${ctrl.metadata.titleText}`);
            action.addEventListener('click', async () => await this.hideControl(ctrl));
        }
    }

    async hideControl(ctrl) {
        this.lib.addClass(ctrl.containerElement, '-hidden');
        this.lib.setAttribute(ctrl.containerElement, '-control-metadata', ctrl.metadata);
        
        if (!ctrl.metadata.isHidden) {
            ctrl.metadata.isHidden = true;
            await this.setPageSetting(window.location, ctrl.metadata, ctrl.metadata.uniqueId);
        }

        const title = this.appHandler.getTitleElement(this.doc);
        this.lib.setAttribute(title, '-hidden-count', this.hiddenControls.length);
        this.hiddenControls.push(ctrl);
        this.appendUnhideMenu(this.pageMenu);
    }
}