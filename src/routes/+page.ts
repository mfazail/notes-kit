import type { GBSubject } from "$lib/stores/topics";
import type { PageLoad } from "./$types";
import { error } from "@sveltejs/kit";


export const load: PageLoad = async ({ fetch }) => {
	const response = await fetch("/api/groupedTopic");
	const data = await response.json();
	if (!response.ok) {
		throw error(500, data.message)
	}
	return {
		results: data.results as GBSubject[]
	}
};