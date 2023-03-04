import type { PageLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { paginate } from "$lib/utils/constant";
import type { Code } from "$lib/stores/codes";

const langs = ['sql', 'python']

export const load: PageLoad = async ({ params, fetch, url }) => {
	// get current language from route params 
	const lang = params.lang
	// if language is not in supported throw error
	if (!langs.includes(lang)) {
		throw error(404, { "message": `${lang} codes are not available.` })
	}
	const page = parseInt(url.searchParams.get('page') ?? "0")
	const perPage = 10
	const { from, to } = paginate(page, perPage)
	// fetch from api and cache it
	const response = await fetch(`/api/codes?lang=${lang}&from=${from}&to=${to}`)
	const data = await response.json()
	if (!response.ok) {
		throw error(500, { "message": data.message })
	}
	return {
		codes: data.data as Code[],
		lang: params.lang,
		total: Math.ceil((data.count ?? 0) / perPage)
	}

};