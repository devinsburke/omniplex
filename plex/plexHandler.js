class PlexHandler extends AppHandler {
    schema = 'plex';

    #controlSelectors = {
        'form': '.plex-form .plex-control-group[id]',
        'filter': '.plex-filter .plex-control-group[id]'
    };

    *getControlElements(doc) {
        for (const [controlType, selector] of Object.entries(this.#controlSelectors)) {
            for (const container of doc.querySelectorAll(selector)) {
                const label = container.querySelector('.plex-control-label');
                if (label) {
                    yield new ControlElementWrapper(container, label, new ControlElementMetadata(
                        container.id,
                        controlType,
                        label.innerText,
                        '#' + container.id,
                        label.getElementsByClassName('required').length > 0,
                        false,
                    ));
                }
            }
        }
    }

    getPageId(url) {
        return `${url.host}${url.pathname}`;
    }
}

//chrome.runtime.sync.clear();

(async() => {
    const services = [HideShowService];

    const lib = new htmlLibrary('omni');
    const app = new PlexHandler();
    await lib.forEachAsync(services, async (_, s) => await new s(document, app, lib).initiate());

    const allData = await lib.getUserData(null);

    console.log(allData || "nullz");
})();