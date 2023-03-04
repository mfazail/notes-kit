import { getSupabase } from "@supabase/auth-helpers-sveltekit";
import { json, type RequestHandler } from "@sveltejs/kit";
import { maxAge,perpage } from "$lib/utils/constant";

export const GET: RequestHandler = async (event) => {
	const { supabaseClient } = await getSupabase(event)
	// get all params
	const subject = event.url.searchParams.get("subject")
	const from = event.url.searchParams.get("from")
	const to = event.url.searchParams.get("to")

	// check if all params are present
	if (!subject || !from || !to) {
		return json({ error: "subject, from and to are required" }, { status: 400 })
	}

	// get data from supabase
	const { data, error: err, count } = await supabaseClient
		.from('topics')
		.select('id,title,from,to,content,updated_at', { count: 'exact' })
		.eq('subject', subject)
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
	// return data and count
	return json({
		data,
		count
	})
};