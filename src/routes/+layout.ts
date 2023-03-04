import { get } from 'svelte/store'
import type { LayoutLoad } from './$types'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { user } from '$lib/stores/auth'

export const load: LayoutLoad = async (event) => {
	const { session } = await getSupabase(event)
	if (session && !get(user)) {
		console.log("called")
		user.set(session.user)
	}
  return { session }
}