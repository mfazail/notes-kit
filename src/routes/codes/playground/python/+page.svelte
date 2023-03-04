<script lang="ts">
    import { useNotification } from "$lib/stores/notifications";
    import { codeToRun } from "$lib/stores/playground";
    const CodeMirror = import("svelte-codemirror-editor");
    import { python } from "@codemirror/lang-python";
    import { oneDark } from "@codemirror/theme-one-dark";
    import Icon from "@iconify/svelte";
    import { Button, Heading, Tooltip } from "flowbite-svelte";
    import { onMount } from "svelte";

    const notify = useNotification();

    let value = "print('Hello, World!')";
    let title = "Run your python below";
	let isDirty = false
	$: {
        value;
        isDirty = true;
    }

    onMount(() => {
		window.onbeforeunload = function () {
			if (isDirty) return "Confirm before leaving!";
			return undefined;
		};
		isDirty = false;
        if (!$codeToRun) return;
        value = $codeToRun.content;
        title = $codeToRun.title;
    });

    const compile = () => {
        try {
            // @ts-ignore
            pyscript.runtime.interpreter.runPython(value);
            // @ts-ignore
            // console.log(pyscript);
            notify.success({
                content: "Code Executed",
                duration: 3000,
            });
        } catch (e) {
            console.log(e);
            notify.error({
                content: " " + e,
                duration: 3000,
            });
        }
    };
</script>

<svelte:head>
    <link rel="stylesheet" href="https://pyscript.net/latest/pyscript.css" />
    <script defer src="https://pyscript.net/latest/pyscript.js"></script>
</svelte:head>

<div class="px-4">
    <Heading tag="h3" class="my-4">{title}</Heading>

    <div class="w-full">
        {#await CodeMirror then Comp}
            <Comp.default bind:value theme={oneDark} lineWrapping lang={python()} class="w-full" />
        {/await}
    </div>
    <div class="my-4">
        <py-terminal />
    </div>

    <div class="fixed bottom-8 right-4 z-50">
        <Button pill class="!p-2" on:click={compile}>
            <Icon icon="heroicons:play" class="w-5 h-5 text-white" />
        </Button>
        <Tooltip>Compile</Tooltip>
    </div>
</div>
