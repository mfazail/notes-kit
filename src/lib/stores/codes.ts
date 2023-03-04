import { client } from "$lib/supabase/client"
import type { Database } from "$lib/supabase/schema"
import { writable } from "svelte/store"
import { checkSession } from "./auth"


export type Code = Database['public']['Tables']['codes']['Row']
export type CodeInsert = Database['public']['Tables']['codes']['Insert']
export type CodeUpdate = Database['public']['Tables']['codes']['Update']

// store loggedin user codes
export const adminCodes = writable<Code[]>([])

// add code to supabase
export const addCode = async (code: CodeInsert) => {
	// check seesion
	const sessionErr = await checkSession()
	if (sessionErr) {
		return sessionErr;
	}
	// insert code
	const { error } = await client
		.from('codes')
		.insert(code)

	if (error) {
		return error
	}
	// update stored code
	adminCodes.update((codes) => {
		return [code as Code, ...codes]
	})
}

// function to update code 
export const updateCode = async (code: CodeUpdate) => {
	// check session
	const sessionErr = await checkSession()
	if (sessionErr) {
		return sessionErr;
	}
	// update code with code's id
	const { error } = await client
		.from('codes')
		.update(code)
		.eq('id', code.id)

	if (error) {
		return error
	}
	// update stored code
	adminCodes.update((codes) => {
		return codes.map((c) => {
			if (c.id === code.id) {
				return { ...c, ...code }
			}
			return c
		})
	})
}

// delete code with code's id
export const deleteCode = async (id: number) => {
	// check session
	const sessionErr = await checkSession()
	if (sessionErr) {
		return sessionErr;
	}
	const { error } = await client
		.from('codes')
		.delete()
		.eq('id', id)

	if (error) {
		return error
	}
	adminCodes.update((codes) => {
		return codes.filter((c) => c.id !== id)
	})
}