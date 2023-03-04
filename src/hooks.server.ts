import '$lib/supabase/client'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { redirect, type Handle, type HandleFetch, json } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {	
	// redirect to login page if not logged in
	if (event.url.pathname.startsWith('/dashboard')) {
		const { session } = await getSupabase(event)
		if (!session) {
			throw redirect(303, '/login')
		}
	}
	// allow cache-control header
	const response = await resolve(event, {
		filterSerializedResponseHeaders: (name) => name == 'cache-control',
	});

	return response
}
export const handleFetch: HandleFetch = async ({ request, fetch, event }) => {
	if (event.url.pathname.startsWith('/dashboard')) {
		const { session } = await getSupabase(event)
		if (!session) {
			return json("Access denied")
		}
	}
	return fetch(request);
}