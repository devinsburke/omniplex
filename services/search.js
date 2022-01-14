class SearchService extends Service {
    schema = 'search';

    async onDocumentStart() {
        const settings = await this.getPageSettings(window.location);
    }

    async onDocumentIdle() {
        const settings = await this.getPageSettings(window.location);
    }
}