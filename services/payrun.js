class PayrunService extends Service {
    schema = 'payrun';

    async onDocumentStart() {
        const settings = await this.getPageSettings(window.location);
    }

    async onDocumentIdle() {
        const settings = await this.getPageSettings(window.location);
    }
}