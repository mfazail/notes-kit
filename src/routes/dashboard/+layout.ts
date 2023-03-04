import { getSupabase } from "@supabase/auth-helpers-sveltekit";
import type { LayoutLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const csr = true

export const load: LayoutLoad = async (event) => {
	const { session } = await getSupabase(event)
	if(!session) {
		throw redirect(303,'/login')
	}
};