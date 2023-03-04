import type { Topic } from "$lib/stores/topics";
import type { PageLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async ({ fetch, url }) => {
	const search = url.searchParams.get("q");
	if (!search) return;
	const response = await fetch("/api/search?q=" + search);
	const data = await response.json();
	if (!response.ok) {
		throw error(500, data.message)
	}
	return {
		results: data.results as Topic[]
	}
};