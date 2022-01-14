class LoginService extends Service {
    schema = 'login';

    async onDocumentIdle() {
        this.appHandler.getSsoLoginElement().click();
    }
}