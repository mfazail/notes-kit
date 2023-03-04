import type { PageLoad } from "./$types";
import { getSubjectName, paginate } from "$lib/utils/constant";
import { error } from "@sveltejs/kit";
import type { Topic } from "$lib/stores/topics";

export const csr = true;

export const load: PageLoad = async ({ params, fetch, url }) => {
	// get subject from route param and then get its name
	const subject = getSubjectName(params.subject)
	// if no subject found or not passed in params
	// throw error
	if (!subject) {
		throw error(404, { "message": `${params.subject} subject is not available` })
	}
	// get page no from searchParams
	const page = parseInt(url.searchParams.get('page') ?? "0")
	const perPage = 10
	const { from, to } = paginate(page, perPage)
	// fetch from api and cache it response
	const response = await fetch(`/api/subjects?subject=${subject}&from=${from}&to=${to}`)
	const data = await response.json()
	if (!response.ok) {
		throw error(500, { "message": data.error })
	}
	return {
		notes: data.data as Topic[],
		subject: params.subject,
		total: Math.ceil((data.count ?? 0) / perPage)
	}
};