import { getSupabase } from "@supabase/auth-helpers-sveltekit";
import type { PageLoad } from "./$types";
import { error, redirect } from "@sveltejs/kit";
import { get } from "svelte/store";
import { adminTopics, type Topic } from "$lib/stores/topics";

export const load: PageLoad = async (event) => {
	const { session, supabaseClient } = await getSupabase(event)
	if (!session) {
		throw redirect(303, '/login')
	}
	if (get(adminTopics).length == 0) {
		const { data, error: err } = await supabaseClient
			.from('topics')
			.select('id,title,subject,from,to,content,updated_at')
			.eq('user_id', session.user.id)
			.order('updated_at', { ascending: false })

		if (err) {
			throw error(500, { "message": err.message })
		}
		adminTopics.set(data as Topic[])
	}
};