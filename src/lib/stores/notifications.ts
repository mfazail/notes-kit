import { writable } from "svelte/store";

export type Notification = {
	id?: number,
	content: string,
	type?: 'error' | 'success' | 'warn' | 'info',
	duration?: number,
	closable?: boolean,
}
// store notifications
export const notifications = writable<Notification[]>([])

export const useNotification = () => {
	return {
		success,
		error,
		info,
		warn
	}
}
// default notification value
const def: Notification = {
	type: 'info',
	content: '',
	duration: 3000
}

const error = (n: Notification) => {
	create({ ...def, ...n, id: randomId(), type: 'error', })
}
const info = (n: Notification) => {
	create({ ...def, ...n, id: randomId(), type: 'info' })
}
const warn = (n: Notification) => {
	create({ ...def, ...n, id: randomId(), type: 'warn' })
}
const success = (n: Notification) => {
	create({ ...def, ...n, id: randomId(), type: 'success' })
}

const randomId = () => {
	return Math.floor(Math.random() * 100000000000)
}

const create = (n: Notification) => {
	const id = n.id
	// create notification
	notifications.update(_n => {
		_n.push(n)
		return _n;
	})
	// after the given duration remove notification
	setTimeout(() => {
		notifications.update(_n => {
			const i = _n.findIndex((no) => no.id == id)
			_n.splice(i, 1)
			return _n
		})
	}, n.duration)
}