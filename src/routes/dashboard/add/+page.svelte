<script lang="ts">
    import { renderHtml } from "$lib/utils/markdown";
    import { subjects } from "$lib/utils/constant";
    import { addTopic } from "$lib/stores/topics";
    import { user } from "$lib/stores/auth";
    import { Input, Label, Button, Select, Toggle, Spinner, Tabs, TabItem } from "flowbite-svelte";
    import { useNotification } from "$lib/stores/notifications";
    import { goto } from "$app/navigation";
    import Icon from "@iconify/svelte";
    const CodeMirror = import("svelte-codemirror-editor");
    import { markdown } from "@codemirror/lang-markdown";
    import { oneDark } from "@codemirror/theme-one-dark";
    import { onMount } from "svelte";

    const notify = useNotification();

    const subs = subjects.map((sub) => ({
        value: sub.name,
        name: sub.name,
    }));
    const value = "### Hello World\n\n";
    let title = "";
    let from = "";
    let to = "";
    let subject = "Python";
    let draft = true;
    let content = value;
    let isSaving = false;
    let preview = false;
    let isDirty = false;
    $: result = renderHtml(content!);
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

    const handleSave = async () => {
        if (title == "" || content == "" || subject == "") {
            notify.error({
                content: "Fill required fields",
                duration: 3000,
            });
            return;
        }
        isSaving = true;
        const err = await addTopic({
            user_id: $user?.id!,
            content,
            from: from ? new Date(from).toISOString() : new Date().toISOString(),
            to: to ? new Date(to).toISOString() : new Date().toISOString(),
            subject,
            title,
            draft,
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
            content: "Successfully created!",
        });
        goto("/dashboard");
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
            <Input bind:value={title} required placeholder="topic title" type="text" name="title" id="title" />
        </div>
        <div>
            <Label for="from" class="mb-2">Topic started from</Label>
            <Input bind:value={from} id="from" type="date" placeholder="Select date" />
        </div>
        <div>
            <Label for="to" class="mb-2">Topic ended to</Label>
            <Input bind:value={to} id="to" type="date" placeholder="Select date" />
        </div>
        <div>
            <Label for="subject" class="mb-2">Subject</Label>
            <Select required items={subs} bind:value={subject} name="subject" id="subject" />
        </div>
        <div>
            <Toggle bind:checked={draft}>Draft</Toggle>
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
                    <Comp.default bind:value={content} lineWrapping class="w-full" theme={oneDark} lang={markdown()} />
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
        <Button disabled={isSaving} on:click={handleSave} class="">
            {#if isSaving}
                <Spinner color="white" size="4" class="mr-2" />
            {/if}
            Sav{isSaving ? "ing" : "e"}
        </Button>
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
