class PlexHandler extends AppHandler {
    *getControlElements(doc) {
        for (const container of doc.querySelectorAll('.plex-control-group[id]')) {
            const trigger = container.querySelector('.plex-control-label');
            if (trigger) {
                const isRequired = trigger.getElementsByClassName('required').length > 0;
                yield new AppHandlerControlElement(container, trigger, trigger.innerText, container.id, isRequired);
            }
        }
    }

    getUniqueUrl(url) {
        return `${url.host}${url.pathname}`;
    }
}

const lib = new htmlLibrary('omni');
const appHandler = new PlexHandler();
const hideShow = new HideShowService(document, appHandler, lib);
hideShow.initiate();