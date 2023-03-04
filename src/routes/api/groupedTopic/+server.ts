import type { GBSubject } from "$lib/stores/topics";
import { maxAge } from "$lib/utils/constant";
import { getSupabase } from "@supabase/auth-helpers-sveltekit";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async (event) => {
	const { supabaseClient } = await getSupabase(event)
	var date = new Date();
	date.setDate(date.getDate() - 1);
	const { data, error: err } = await supabaseClient
		.from('topics')
		.select('*')
		.eq('draft', false)
		.gte('created_at', date.toISOString())
	
	if (err) {
		return json({ "error": err.message }, { status: 500 });
	}

	let groupedBySubject: GBSubject[] = []

	data.forEach((topic) => {
		const subject = groupedBySubject.find((gb) => gb.subject === topic.subject)
		if (subject) {
			subject.topics.push(topic)
		} else {
			groupedBySubject.push({
				subject: topic.subject!,
				topics: [topic]
			})
		}
	})
	event.setHeaders({
		'cache-control': maxAge
	})
	return json({ results: groupedBySubject });
};