import { getHighlighter, type Highlighter, setCDN, type Lang } from "shiki";
import MarkdownIt from "markdown-it";

let highlighter: Highlighter;
/**
 * initialize shiki for code highlighting
 * default language [sql,py]
 * theme: github-dark
 */
export const initMarkdown = async () => {
	setCDN("https://unpkg.com/shiki/");
	highlighter = await getHighlighter({ langs: ["sql", "py"], theme:'github-dark' });
}
// init markdown with shiki as highlighter
const md = MarkdownIt({
	highlight(str, lang) {
		if (highlighter && lang) {
			if (highlighter.getLoadedLanguages().includes(lang as Lang)) {
				const code = highlighter.codeToHtml(str, { lang });
				return code;
			}
			return str;
		}
		return str;
	},
});
/**
 * render markdown to html
 * @param code 
 * @returns 
 */
export const renderHtml = (code: string|null = "") => {
	return md.render(code??"")
}