<script lang="ts">
    import { renderHtml } from "$lib/utils/markdown";
    import { subjects } from "$lib/utils/constant";
    import { deleteTopic, updateTopic, type Topic } from "$lib/stores/topics";
    import { Input, Label, Button, Select, Toggle, Spinner, Tabs, TabItem, Modal } from "flowbite-svelte";
    import { useNotification } from "$lib/stores/notifications";
    import { goto } from "$app/navigation";
    import type { PageData } from "./$types";
    import Icon from "@iconify/svelte";
    const CodeMirror = import("svelte-codemirror-editor");
    import { markdown } from "@codemirror/lang-markdown";
    import { oneDark } from "@codemirror/theme-one-dark";
    import { onMount } from "svelte";

    export let data: PageData;

    const notify = useNotification();

    const subs = subjects.map((sub) => ({
        value: sub.name,
        name: sub.name,
    }));
    let topic: Topic = data.topic;

    let isSaving = false;
    let isDeleting = false;
    let preview = false;
    let confirmDeleteModal = false;
    let isDirty = false;
    $: result = renderHtml(topic.content!);

    $: {
        topic;
        isDirty = true;
    }

    onMount(() => {
        window.onbeforeunload = function () {
            if (isDirty) return "Confirm before leaving!";
            return undefined;
        };
        isDirty = false;
    });

    const handleSave = async () => {
        if (topic.title == "" || topic.content == "" || topic.subject == "") {
            notify.error({
                content: "Fill required fields",
                duration: 3000,
            });
            return;
        }
        isSaving = true;
        const err = await updateTopic({
            ...topic,
            from: new Date(topic.from!).toISOString(),
            to: new Date(topic.to!).toISOString(),
            updated_at: new Date().toISOString(),
        });
        isSaving = false;
        if (err) {
            notify.error({
                content: err.message,
                duration: 3000,
            });
            console.log({ err });
            return;
        }
        notify.success({
            content: "Successfully updated!",
        });
        goto("/dashboard");
    };
    const confirmDelete = () => {
        confirmDeleteModal = true;
    };
    const handleDelete = async () => {
        const err = await deleteTopic(topic.id!);
        if (err) {
            notify.error({
                content: err.message,
                duration: 3000,
            });
            console.log({ err });
            return;
        }
		goto('/dashboard')
    };
    const togglePreview = () => {
        preview = !preview;
    };
</script>

<svelte:window on:beforeunload={() => "Confirm before leaving"} />

<div class="flex flex-col sm:flex-row sm:space-x-4">
    <div class="space-y-4 p-4 min-w-[300px]">
        <div>
            <Label for="title" class="mb-2">Title</Label>
            <Input bind:value={topic.title} required placeholder="topic title" type="text" name="title" id="title" />
        </div>
        <div>
            <Label for="from" class="mb-2">Topic started from</Label>
            <Input bind:value={topic.from} id="from" type="date" placeholder="Select date" />
        </div>
        <div>
            <Label for="to" class="mb-2">Topic ended to</Label>
            <Input bind:value={topic.to} id="to" type="date" placeholder="Select date" />
        </div>
        <div>
            <Label for="subject" class="mb-2">Subject</Label>
            <Select required items={subs} bind:value={topic.subject} name="subject" id="subject" />
        </div>
        <div>
            <Toggle bind:checked={topic.draft}>Draft</Toggle>
        </div>
    </div>
    <div class="space-y-4 p-4 flex-1">
        <Tabs style="underline" class="flex-1 w-full">
            <TabItem open={!preview}>
                <div slot="title" class="flex items-center gap-2">
                    <Icon icon="ri:markdown-fill" />
                    Markdown
                </div>
                {#await CodeMirror}
                    <Spinner />
                {:then Comp}
                    <Comp.default
                        bind:value={topic.content}
                        lineWrapping
                        class="w-full"
                        theme={oneDark}
                        lang={markdown()} />
                {/await}
            </TabItem>
            <TabItem open={preview}>
                <div slot="title" class="flex items-center gap-2">
                    <Icon icon="heroicons:eye" />
                    Preview
                </div>
                <div class="prose dark:prose-invert">
                    {@html result}
                </div>
            </TabItem>
        </Tabs>
        <div class="flex items-center  space-x-4 ">
            <Button disabled={isDeleting} color="red" on:click={confirmDelete}>
                {#if isDeleting}
                    <Spinner color="white" size="4" class="mr-2" />
                {/if}
                <Icon icon="heroicons:trash" class="mr-2" />
                Delet{isDeleting ? "ing" : "e"}
            </Button>
            <Button disabled={isSaving} on:click={handleSave} class="self-end">
                {#if isSaving}
                    <Spinner color="white" size="4" class="mr-2" />
                {/if}
                Updat{isSaving ? "ing" : "e"}
            </Button>
        </div>
    </div>
    <div class="fixed bottom-8 right-4">
        <Button pill class="!p-3" on:click={togglePreview}>
            {#if preview}
                <Icon icon="ri:markdown-fill" class="w-5 h-5" />
            {:else}
                <Icon icon="heroicons:eye" class="w-5 h-5" />
            {/if}
        </Button>
    </div>
</div>

<Modal title="Confirm delete?" bind:open={confirmDeleteModal} size="xs" autoclose>
    <div class="flex flex-col items-center justify-center">
        <Icon icon="heroicons:information-circle" class="w-12 h-12 text-red-400" />
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this note?
        </h3>
        <div>
            <Button color="red" class="mr-2" on:click={handleDelete}>Yes, I'm sure</Button>
            <Button color="alternative">No, cancel</Button>
        </div>
    </div>
</Modal>
