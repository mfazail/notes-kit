import { getSupabase } from "@supabase/auth-helpers-sveltekit";
import type { PageLoad } from "./$types";
import { error, redirect } from "@sveltejs/kit";

export const load: PageLoad = async (event) => {
	const { session, supabaseClient } = await getSupabase(event)
	if (!session) {
		throw redirect(303, '/login')
	}
	const { data,error:err } =await supabaseClient
		.from('codes')
		.select('id,title,lang,content,updated_at')
		.eq('user_id', session.user.id)
	if (err) {
		throw error(500,{"message":err.message})
	}
	return {
		codes: data
	}
};