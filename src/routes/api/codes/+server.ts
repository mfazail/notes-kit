import { maxAge,perpage } from "$lib/utils/constant";
import { getSupabase } from "@supabase/auth-helpers-sveltekit";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async (event) => {
	const { supabaseClient } = await getSupabase(event)
	// get query params
	const lang = event.url.searchParams.get("lang")
	const from = event.url.searchParams.get("from")
	const to = event.url.searchParams.get("to")
	// check if all params are present
	if (!lang || !from || !to) {
		return json({ error: "lang, from and to are required" }, { status: 400 })
	}
	// fetch data from supabase
	const { data, error: err, count } = await supabaseClient
		.from('codes')
		.select('id,title,lang,content,updated_at', { count: 'exact' })
		.eq('lang', lang)
		.limit(perpage)
		.range(parseInt(from), parseInt(to))

	// return error if any
	if (err) {
		return json({ error: err.message }, { status: 500 })
	}

	// set cache-control header
	event.setHeaders({
		'cache-control': maxAge
	})
	return json({ data, count })
};