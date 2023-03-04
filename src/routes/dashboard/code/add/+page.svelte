<script lang="ts">
    const CodeMirror = import("svelte-codemirror-editor");
    import { sql } from "@codemirror/lang-sql";
    import { python } from "@codemirror/lang-python";
    import { oneDark } from "@codemirror/theme-one-dark";
    import { Button, Input, Label, Select, Spinner, TabItem, Tabs } from "flowbite-svelte";
    import { renderHtml } from "$lib/utils/markdown";
    import Icon from "@iconify/svelte";
    import { user } from "$lib/stores/auth";
    import { useNotification } from "$lib/stores/notifications";
    import { addCode } from "$lib/stores/codes";
    import { goto } from "$app/navigation";
    import { wrapWithTilde } from "$lib/utils/constant";
    import { onMount } from "svelte";

    const notify = useNotification();

    let lang: "python" | "sql" = "sql";
    let langs = {
        python: python(),
        sql: sql(),
    };
    let languages = [
        {
            value: "python",
            name: "Python",
        },
        {
            value: "sql",
            name: "SQL",
        },
    ];

    let title = "";
    let content = "\n\n\n";
    let preview = false;
    let isSaving = false;
    let isDirty = false;
    $: html = renderHtml(wrapWithTilde(lang, content));
    $: {
        content;
        isDirty = true;
    }

    onMount(() => {
        window.onbeforeunload = function () {
            if (isDirty) return "Confirm before leaving!";
            return undefined;
        };
        isDirty = false;
    });
    const togglePreview = () => {
        preview = !preview;
    };
    const handleSave = async () => {
        if (title == "" || content == "") {
            notify.error({
                content: "Please fill all the required fields",
                duration: 3000,
            });
            return;
        }
        isSaving = true;
        const err = await addCode({
            title,
            content,
            user_id: $user!.id,
            lang,
        });
        if (err) {
            notify.error({
                content: err.message,
                duration: 3000,
            });
            isSaving = false;
            return;
        }
        notify.success({
            content: "Added Successfully",
        });
        isSaving = false;
        goto("/dashboard/code");
    };
</script>

<svelte:window on:beforeunload={() => "Confirm before leaving"} />

<div class="space-y-4 p-4 flex flex-col sm:flex-row sm:space-y-0 sm:space-x-4">
    <div class="space-y-4 mt-4 min-w-[250px]">
        <div>
            <Label for="title">Title</Label>
            <Input bind:value={title} id="title" />
        </div>
        <div>
            <Label for="languages">Language</Label>
            <Select bind:value={lang} items={languages} id="languages" />
        </div>
    </div>
    <div class="w-full space-y-4">
        <Tabs style="underline" class="flex-1 w-full">
            <TabItem open={!preview}>
                <div slot="title" class="flex items-center gap-2">
                    <Icon icon={lang == "sql" ? "simple-icons:mysql" : "mdi:language-python"} />
                    {lang == "sql" ? "SQL" : "Python"}
                </div>
                {#await CodeMirror}
                    <Spinner />
                {:then Comp}
                    <Comp.default bind:value={content} lineWrapping class="w-full" theme={oneDark} lang={langs[lang]} />
                {/await}
            </TabItem>
            <TabItem open={preview}>
                <div slot="title" class="flex items-center gap-2">
                    <Icon icon="heroicons:eye" />
                    Preview
                </div>
                <div class="prose dark:prose-invert">
                    {@html html}
                </div>
            </TabItem>
        </Tabs>
        <Button disabled={isSaving} on:click={handleSave}>
            {#if isSaving}
                <Spinner color="white" size="4" class="mr-2" />
            {/if}
            Sav{isSaving ? "ing" : "e"}
        </Button>
    </div>
</div>
<div class="fixed bottom-8 right-4">
    <Button pill class="!p-3" on:click={togglePreview}>
        {#if preview}
            <Icon icon="heroicons:eye-slash" class="w-5 h-5" />
        {:else}
            <Icon icon="heroicons:eye" class="w-5 h-5" />
        {/if}
    </Button>
</div>
