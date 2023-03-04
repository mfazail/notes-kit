import { writable } from "svelte/store";
import type { Code } from "./codes";
/** 
store code that will be running
user clicks on the play button(/codes/[lang])
store that code
and set this code to editor(/codes/playground/[lang])
*/
export const codeToRun = writable<Code>()