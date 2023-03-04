<script lang="ts">
    const CodeMirror = import("svelte-codemirror-editor");
    import Icon from "@iconify/svelte";
    import { sql } from "@codemirror/lang-sql";
    import { python } from "@codemirror/lang-python";
    import { oneDark } from "@codemirror/theme-one-dark";
    import { Button, Input, Label, Select, Spinner, TabItem, Tabs } from "flowbite-svelte";
    import { renderHtml } from "$lib/utils/markdown";
    import type { PageData } from "./$types";
    import { deleteCode, updateCode, type Code } from "$lib/stores/codes";
    import { useNotification } from "$lib/stores/notifications";
    import { goto } from "$app/navigation";
    import { wrapWithTilde } from "$lib/utils/constant";
    import { onMount } from "svelte";

    export let data: PageData;

    const notify = useNotification();

    let code: Code = data.code;
    let content = "\n\n\n";
    // let lang: "python" | "sql" = code.lang;
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
    let preview = false;
    let isSaving = false;
    let isDeleting = false;
    let confirmDeleteModal = false;
	let isDirty =false
    $: html = renderHtml(wrapWithTilde(code.lang, code.content));

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
        if (code.title == "" || code.content == "") {
            notify.error({
                content: "Please fill all the required fields",
                duration: 3000,
            });
            return;
        }
        isSaving = true;
        const err = await updateCode({
            ...code,
            updated_at: new Date().toISOString(),
        });
        if (err) {
            notify.error({
                content: err.message,
                duration: 3000,
            });
            isSaving = false;
            return;
        }
        isSaving = false;
        notify.success({
            content: "Updated Successfully",
        });
        goto("/dashboard/code");
    };

    const confirmDelete = () => {
        confirmDeleteModal = true;
    };
    const handleDelete = async () => {
        isDeleting = true;
        const err = await deleteCode(code.id);
        if (err) {
            notify.error({
                content: err.message,
                duration: 3000,
            });
            isDeleting = false;
            return;
        }
        notify.success({
            content: "Successfully deleted",
        });
        isDeleting = false;
        goto("/dashboard/code");
    };
</script>

<svelte:window on:beforeunload={() => "Confirm before leaving"} />

<div class="space-y-4 p-4 flex flex-col sm:flex-row sm:space-y-0 sm:space-x-4">
    <div class="space-y-4 min-w-[250px]">
        <div>
            <Label for="title">Title</Label>
            <Input bind:value={code.title} id="title" />
        </div>
        <div>
            <Label for="languages">Language</Label>
            <Select bind:value={code.lang} items={languages} id="languages" />
        </div>
    </div>
    <div class="w-full space-y-4">
        <Tabs style="underline" class="flex-1 w-full">
            <TabItem open={!preview}>
                <div slot="title" class="flex items-center gap-2">
                    <Icon icon={code.lang == "sql" ? "simple-icons:mysql" : "mdi:language-python"} />
                    {code.lang == "sql" ? "SQL" : "Python"}
                </div>
                {#await CodeMirror}
                    <Spinner />
                {:then Comp}
                    <Comp.default
                        bind:value={code.content}
                        lineWrapping
                        class="w-full"
                        theme={oneDark}
                        lang={langs[code.lang]} />
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
        <div class="flex items-center space-x-4">
            <Button disabled={isDeleting} color="red" on:click={confirmDelete}>
                {#if isDeleting}
                    <Spinner color="white" size="4" class="mr-2" />
                {/if}
                Delet{isDeleting ? "ing" : "e"}
            </Button>
            <Button disabled={isSaving} on:click={handleSave}>
                {#if isSaving}
                    <Spinner color="white" size="4" class="mr-2" />
                {/if}
                Sav{isSaving ? "ing" : "e"}
            </Button>
        </div>
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

{#if confirmDeleteModal}
    {#await import("flowbite-svelte") then Comp}
        <Comp.Modal bind:open={confirmDeleteModal} title="Confirm delete?" size="xs" autoclose>
            <div class="flex flex-col items-center justify-center">
                <Icon icon="heroicons:information-circle" class="w-12 h-12 text-red-400" />
                <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete this code?
                </h3>
                <div>
                    <Button color="red" class="mr-2" on:click={handleDelete}>Yes, I'm sure</Button>
                    <Button color="alternative">No, cancel</Button>
                </div>
            </div>
        </Comp.Modal>
    {/await}
{/if}
