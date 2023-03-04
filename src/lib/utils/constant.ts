export type Subject = {
	link: string,
	name: string,
	teacher: string,
	icon: string,
	code: string,
}
// subjects list
export const subjects: Subject[] = [
	{
		link: '/python',
		name: "Python",
		teacher: "Raktim Banarjee",
		icon: "mdi:language-python",
		code:"BCAC403"
	},
	{
		link: '/dbms',
		name: "DBMS",
		teacher: "Raktim Banarjee",
		icon: "material-symbols:database",
		code: "BCAC401"
	},
	{
		link: '/se',
		name: "Software Engineering",
		teacher: "Shameek Bhattacharya",
		icon: "material-symbols:engineering",
		code: "BCAC402"
	},
	{
		link: '/entrepreneurship',
		name: "Entrepreneurship",
		teacher: "Shomnath Laha",
		icon: "ph:users-three",
		code: "BCAS401"
	},
	{
		link: '/dt',
		name: "Digital Transformation",
		teacher: "Shameek Bhattacharya",
		icon: "mingcute:laptop-line",
		code: "GE1B-22"
	},
]

// max-age for cache-control header 1800s = 30min
export const maxAge = "max-age=1800"

// perpage 
export const perpage = 10

// function to get subject name from link
export const getSubjectName = (link: string) => {
	return subjects.find((subject) => subject.link.substring(1) === link)?.name
}

// function to format date with Intl.DateTimeFormat
export const formatDate = (date: string) => {
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(new Date(date))
}

// function to format date for input type=date
export const formatDateForInput = (date: string) => {
	return new Date(date).toISOString().split("T")[0]
}
/**
 * function to calculate range of data to fetch from supabase
 * (0,10) -> 1-10 row
 * @param page 
 * @param size 
 * @returns 
 */
export const paginate = (page: number, size: number) => {
	const limit = size ? + size : 10;
	const from = page ? page * limit : 0;
	const to = page ? from + size : size;
	return { from, to }
}
// wrap the fetched code in fenced to highlight it code block
export const wrapWithTilde = (lang:string,content:string) => {
	return "```" + lang + "\n" + content + "\n```"
}
