import { maxAge } from "$lib/utils/constant";
import { getSupabase } from "@supabase/auth-helpers-sveltekit";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async (event) => {
	const search = event.url.searchParams.get("q");
	if (!search) return json({ "error": "No search term provided" }, { status: 400 });
	const { supabaseClient } = await getSupabase(event)
	const { data, error: err } = await supabaseClient
		.from("topics")
		.select("id,title,subject,content,updated_at,from,to")
		.ilike("title", `%${search}%`)
		.limit(5);

	if (err) {
		return json({ "error": err.message }, { status: 500 });
	}
	event.setHeaders({
		'cache-control': maxAge
	})
	return json({ results: data });
};