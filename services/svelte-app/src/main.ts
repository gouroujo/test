import App from './App.svelte'
import PKCEClient from '@test/client-pkce'

const auth = new PKCEClient({
  client_id: "af04e6cd-7e16-45aa-aa09-4d419757eab1",
  client_secret: "k8Fllm0VX/ERxGQUVbaMa4k6thTFHFJi0Jx2g2JvJcXupa6rvXXt3Ae+tl8RLwLTotESizFzuWi0mKujv254Ig==",
  redirect_uri: "http://localhost:5000/",
  authorization_endpoint: "http://localhost:3000/oauth/authorize",
  token_endpoint: "http://localhost:3000/oauth/token",
  requested_scopes: "profile"
})

const app = new App({
	target: document.body,
	props: {
    auth
  }
});



export default app;