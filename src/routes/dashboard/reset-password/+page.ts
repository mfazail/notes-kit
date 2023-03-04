import { getSupabase } from "@supabase/auth-helpers-sveltekit";
import type { PageLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageLoad = async (event) => {
	const { session } = await getSupabase(event)
	if (!session) {
		throw redirect(303, "/");
	}
};
