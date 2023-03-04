import { getSupabase } from "@supabase/auth-helpers-sveltekit";
import type { PageLoad } from "./$types";
import { error, redirect } from "@sveltejs/kit";

export const load: PageLoad = async (event) => {
	const { session, supabaseClient } = await getSupabase(event)
	if (!session) {
		redirect(303, '/login')
	}

	const id = event.params.id

	const { data, error: err } = await supabaseClient
		.from('codes')
		.select('*')
		.eq('id', id)
		.maybeSingle()

	if (err) {
		throw error(parseInt(err.code), { "message": err.message })
	}
	
	if (!data) {
		throw error(404, { "message": "No Code found" })
	}

	return {
		code: data
	}
};