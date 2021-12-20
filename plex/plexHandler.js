class PlexHandler extends AppHandler {
    appName = 'plex';

    *getControlElements(doc) {
        const selectors = {
            'form': '.plex-form .plex-control-group[id]',
            'filter': '.plex-filter .plex-control-group[id]'
        };

        for (const [controlType, selector] of Object.entries(selectors)) {
            for (const container of doc.querySelectorAll(selector)) {
                const trigger = container.querySelector('.plex-control-label');
                if (trigger) {
                    const isRequired = trigger.getElementsByClassName('required').length > 0;
                    yield new AppHandlerControlElement(controlType, container, trigger, trigger.innerText, '#' + container.id, isRequired);
                }
            }
        }
    }

    getPageId(url) {
        return `${url.host}${url.pathname}`;
    }
}

const services = [HideShowService];

const lib = new htmlLibrary('omni');
const app = new PlexHandler();
services.forEach(s => new s(document, app, lib).initiate());