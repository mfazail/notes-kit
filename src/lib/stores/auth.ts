import { client } from "$lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { writable } from "svelte/store";

// store current loggedin user data 
export const user = writable<User | null>(null)

// function to login user with email and password
export const login = async (email: string, password: string) => {
	const { data, error } = await client.auth.signInWithPassword({
		email,
		password
	})
	if (error) {
		return error
	}
	// if user successfully logged in store user data
	user.set(data.user)
	return null
}

// function to logout user
export const logout = async () => {
	const { error } = await client.auth.signOut()
	if (error) {
		return error
	}
}

// check if user has session to add, edit or delete operations
export const checkSession = async() => {
	const { data, error: sessionErr } = await client.auth.getSession()
	if (sessionErr) {
		return sessionErr
	}
	if (!data.session) {
		return {
			message: 'Not Authorized'
		}
	}
}