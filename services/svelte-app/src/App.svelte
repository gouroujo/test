
<script lang="ts">
  import type PKCEClient from '@test/client-pkce'
  export let auth: PKCEClient;
  function handleClick(e) {
    e.preventDefault()
    auth.authenticate()
  }
</script>

<main>
  <button on:click={handleClick}>
    Get an acces_token with PKCE flow
  </button>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>