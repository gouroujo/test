export default class Client {
  constructor(
    private readonly config: any
  ) {}

  public async authenticate (): Promise<void> {
    // Create and store a random "state" value
    var state = this.generateRandomString();
    localStorage.setItem("pkce_state", state);
  
    // Create and store a new PKCE code_verifier (the plaintext random secret)
    var code_verifier = this.generateRandomString();
    localStorage.setItem("pkce_code_verifier", code_verifier);
  
    // Hash and base64-urlencode the secret to use as the challenge
    var code_challenge = await this.pkceChallengeFromVerifier(code_verifier);
  
    // Build the authorization URL
    var url = this.config.authorization_endpoint 
        + "?response_type=code"
        + "&client_id="+encodeURIComponent(this.config.client_id)
        + "&client_secret="+encodeURIComponent(this.config.client_secret)
        + "&state="+encodeURIComponent(state)
        + "&scope="+encodeURIComponent(this.config.requested_scopes)
        + "&redirect_uri="+encodeURIComponent(this.config.redirect_uri)
        + "&code_challenge="+encodeURIComponent(code_challenge)
        + "&code_challenge_method=S256"
        ;
  
    // Redirect to the authorization server
    window.location.assign(url);
  }

  public callback() {
    // Handle the redirect back from the authorization server and
    // get an access token from the token endpoint
  
    var q = this.parseQueryString(window.location.search.substring(1))
  
    // Check if the server returned an error string
    if(q.error) {
      alert("Error returned from authorization server: "+q.error);
      console.error(q.error+"\n\n"+q.error_description)
    }
  
    // If the server returned an authorization code, attempt to exchange it for an access token
    if(q.code) {
  
      // Verify state matches what we set at the beginning
      if(localStorage.getItem("pkce_state") != q.state) {
          alert("Invalid state");
      } else {
  
          // Exchange the authorization code for an access token
          this.sendPostRequest(this.config.token_endpoint, {
              grant_type: "authorization_code",
              code: q.code,
              client_id: this.config.client_id,
              redirect_uri: this.config.redirect_uri,
              code_verifier: localStorage.getItem("pkce_code_verifier")
          }, function(_: unknown, body: any) {
  
              // Initialize your application now that you have an access token.
              console.log(body.access_token)
          }, function(_: unknown, error: any) {
              // This could be an error response from the OAuth server, or an error because the 
              // request failed such as if the OAuth server doesn't allow CORS requests
              console.error(error.error+"\n\n"+error.error_description)
          });
      }
      // Replace the history entry to remove the auth code from the browser address bar
      window.history.replaceState({}, '', "/")
      // Clean these up since we don't need them anymore
      localStorage.removeItem("pkce_state")
      localStorage.removeItem("pkce_code_verifier")
    }
  }
  
  //////////////////////////////////////////////////////////////////////
  // GENERAL HELPER FUNCTIONS
  
  // Make a POST request and parse the response as JSON
  private sendPostRequest(url: string, params: any, success: Function, error: Function) {
    var request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.withCredentials = true;
    request.onload = function() {
        var body = {};
        try {
            body = JSON.parse(request.response);
        } catch(e) {}
  
        if(request.status == 200) {
            success(request, body);
        } else {
            error(request, body);
        }
    }
    request.onerror = function() {
        error(request, {});
    }
    var body = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    request.send(body);
  }
  
  // Parse a query string into an object
  private parseQueryString(str: string): any {
    if(str == "") {
      return {}
    }
    var segments = str.split("&").map(s => s.split("=") );
    var queryString: Record<string, string> = {};
    segments.forEach(s => queryString[s[0]] = s[1]);
    return queryString;
  }
  
  
  //////////////////////////////////////////////////////////////////////
  // PKCE HELPER FUNCTIONS
  
  // Generate a secure random string using the browser crypto functions
  private generateRandomString() {
    const array = new Uint32Array(28);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
  }
  
  // Calculate the SHA256 hash of the input text. 
  // Returns a promise that resolves to an ArrayBuffer
  private sha256(plain: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
  }
  
  // Base64-urlencodes the input string
  private base64urlencode(str: ArrayBuffer) {
    // Convert the ArrayBuffer to string using Uint8 array to conver to what btoa accepts.
    // btoa accepts chars only within ascii 0-255 and base64 encodes them.
    // Then convert the base64 encoded to base64url encoded
    //   (replace + with -, replace / with _, trim trailing =)
    return btoa(
      new Uint8Array(str)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    ).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  
  // Return the base64-urlencoded sha256 hash for the PKCE challenge
  private async pkceChallengeFromVerifier(v: string) {
    const hashed = await this.sha256(v);
    return this.base64urlencode(hashed);
  }
}