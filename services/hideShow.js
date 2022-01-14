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
        this.rebuildUnhideMenu(this.pageMenu);

        for (const ctrl of this.appHandler.getControlElements(this.doc)) {
            const menu = await this.appendMenu(ctrl.labelElement);
            const attributes = ctrl.metadata.isRequired ? {'disabled': 'disabled'} : {};
            const hideAction = this.lib.buildElement(menu, '-action', ['-hide-filter'], attributes, `Hide ${ctrl.metadata.controlType}: ${ctrl.metadata.titleText}`);
            hideAction.addEventListener('click', async () => await this.setControlVisibility(ctrl, false));

            const storedMetadata = settings[ctrl.metadata.uniqueId];
            if (storedMetadata) {
                ctrl.metadata = storedMetadata;
                await this.setControlVisibility(ctrl, !storedMetadata.isHidden);
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

    rebuildUnhideMenu(element) {
        this.lib.clearElements(element);
        if (this.hiddenControls.length == 0)
            return;
        this.hiddenControls = this.hiddenControls.sort(
            (a, b) => a.metadata.controlType.localeCompare(b.metadata.controlType)
                || a.metadata.titleText.localeCompare(b.metadata.titleText)
        );
        const action = this.lib.buildElement(element, '-action', ['-show-all'], {}, `Unhide all screen controls`);
        action.addEventListener('click', async () => await this.lib.forEachSync(this.hiddenControls, async (_, c) => this.setControlVisibility(c, true)));
        for (const ctrl of this.hiddenControls) {
            const action = this.lib.buildElement(element, '-action', ['-show-filter'], {}, `Unhide ${ctrl.metadata.controlType}: ${ctrl.metadata.titleText}`);
            action.addEventListener('click', async () => await this.setControlVisibility(ctrl, true));
        }
    }

    async setControlVisibility(ctrl, visible) {
        this.lib.setClass(ctrl.containerElement, '-hidden', !visible);
        
        if (!ctrl.metadata.isHidden != visible) {
            ctrl.metadata.isHidden = !visible;
            const newValue = visible ? null : ctrl.metadata;
            await this.setPageSetting(window.location, newValue, ctrl.metadata.uniqueId);
        }

        if (visible) {
            this.hiddenControls = this.hiddenControls.filter(c => c.metadata.uniqueId != ctrl.metadata.uniqueId);
        } else {
            this.hiddenControls.push(ctrl);
        }
        const title = this.appHandler.getTitleElement(this.doc);
        this.lib.setAttribute(title, '-hidden-count', this.hiddenControls.length);
        this.rebuildUnhideMenu(this.pageMenu);
    }
}