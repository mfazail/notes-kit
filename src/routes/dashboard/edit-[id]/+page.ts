import { getSupabase } from "@supabase/auth-helpers-sveltekit";
import type { PageLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { formatDateForInput } from "$lib/utils/constant";

export const load: PageLoad = async (event) => {
	const { session, supabaseClient } = await getSupabase(event)
	if (!session) {
		throw error(403, { "message": "Not Authorized" })
	}
	const { data, error: err } = await supabaseClient
		.from('topics')
		.select('*')
		.eq('id', event.params.id)
		.maybeSingle()
	
	if (err) {
		throw error(500,{"message":err.message})
	}
	if (!data) {
		throw error(404,{"message":"Topic Not Found"})
	}
	data.from = formatDateForInput(data.from!)
	data.to = formatDateForInput(data.to!)
	return {
		topic: data
	}
};