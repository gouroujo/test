export default class Client {
    private readonly config;
    constructor(config: any);
    authenticate(): Promise<void>;
    callback(): void;
    private sendPostRequest;
    private parseQueryString;
    private generateRandomString;
    private sha256;
    private base64urlencode;
    private pkceChallengeFromVerifier;
}
