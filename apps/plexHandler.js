class PlexHandler extends AppHandler {
    schema = 'plex';
    #controlSelectors = {
        'form': '.plex-form .plex-control-group[id]',
        'filter': '.plex-filter .plex-control-group[id]',
    };

    getPageId = (url) => `${url.host}${url.pathname}`;
    getSsoLoginElement = (doc) => doc.getElementById('iamButton');
    getTitleElement = (doc) => doc.querySelector('.plex-page-title');
    *getControlElements(doc) {
        for (const [type, selector] of Object.entries(this.#controlSelectors)) {
            for (const container of doc.querySelectorAll(selector)) {
                const label = container.querySelector('.plex-control-label');
                if (label) {
                    const required = label.getElementsByClassName('required').length > 0;
                    const metadata = new ControlElementMetadata(container.id, type, label.innerText, '#'+container.id, required, false)
                    yield new ControlElementWrapper(container, label, metadata);
                }
            }
        }
    }
}

omni.addServices(new PlexHandler(), [HideShowService]);