import { client } from "$lib/supabase/client";
import type { Database } from "$lib/supabase/schema";
import { writable } from "svelte/store";
import { checkSession } from "./auth";

export type Topic = Database['public']['Tables']['topics']['Row']
export type TopicInsert = Database['public']['Tables']['topics']['Insert']
export type TopicUpdate = Database['public']['Tables']['topics']['Update']
export type GBSubject = {
	subject: string,
	topics: Topic[]
}

// store topics created by logged in user
export const adminTopics = writable<Topic[]>([])

// add topic 
export const addTopic = async (topic: TopicInsert) => {
	// check session
	const sessionErr = await checkSession()
	if (sessionErr) return sessionErr
	// insert topic to supabase
	const { data, error } = await client.from('topics').insert(topic).select().maybeSingle()
	if (error) {
		return error
	}
	// update topics list
	adminTopics.update((topics) => {
		return [data as Topic, ...topics]
	})
}

// update topic
export const updateTopic = async (topic: TopicUpdate) => {
	// check session
	const sessionErr = await checkSession()
	if (sessionErr) return sessionErr
	// update topic with topic's id
	const { error } = await client.from('topics').update(topic).eq('id', topic.id)
	if (error) {
		return error
	}
	// update topics list
	adminTopics.update((topics) => {
		return topics.map((t) => {
			if (t.id === topic.id) {
				return { ...t, ...topic }
			}
			return t
		})
	})
}
// delete topic
export const deleteTopic = async (id: number) => {
	// check session
	const sessionErr = await checkSession()
	if (sessionErr) return sessionErr
	// delete topic with topic's is
	const { error } = await client.from('topics').delete().eq('id', id)
	if (error) {
		return error
	}
	// update topics list
	adminTopics.update((topics) => {
		return topics.filter((t) => t.id !== id)
	})
}