<script lang="ts">
	import { A, Button, Heading, Hr, P, PaginationItem, Tooltip } from "flowbite-svelte";
    import { formatDate, formatDateForInput } from "$lib/utils/constant";
    import { renderHtml } from "$lib/utils/markdown";
    import type { PageData } from "./$types";
    import { user } from "$lib/stores/auth";
    import { goto } from "$app/navigation";
    import Icon from "@iconify/svelte";
    import { page } from "$app/stores";
    export let data: PageData;

    $: activeUrl = parseInt($page.url.searchParams.get("page") ?? "0");
    let readingMode = false;

    const previous = () => {
        if (activeUrl != 0) goto(`/${data.subject}?page=${activeUrl - 1}`);
    };
    const next = () => {
        if (activeUrl < data.total) goto(`/${data.subject}?page=${activeUrl + 1}`);
    };
    const toggleReadingMode = () => {
        readingMode = !readingMode;
    };
</script>

<div class="max-w-7xl mx-auto p-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {#each data.notes as topic}
            <div>
                <Heading tag="h3" class="text-xl font-medium mb-3 ">{topic.title}</Heading>
                {#if !readingMode}
                    <P class="text-xs">{formatDate(topic.from ?? "")} to {formatDate(topic.to ?? "")}</P>
                {/if}
                <div class="mt-4 prose dark:prose-invert">{@html renderHtml(topic.content)}</div>
                <Hr class="my-8" height="h-px">
                    {#if !readingMode}
                        <p>
                            <span class="text-xs font-normal"
                                >Last updated {formatDateForInput(topic.updated_at ?? "")}</span>
                            {#if $user}
                                <A href="/dashboard/edit-{topic.id}" class="text-sm text-gray-500">Edit</A>
                            {/if}
                        </p>
                    {/if}
                </Hr>
            </div>
        {:else}
            <div class="text-center text-gray-500">No notes found</div>
        {/each}
    </div>
    <div class="fixed right-4 bottom-8">
        <Button on:click={toggleReadingMode} pill class="!p-3">
            <Icon icon={!readingMode ? "heroicons:eye" : "heroicons:eye-slash-solid"} class="w-5 h-5" />
        </Button>
        <Tooltip placement="left">Reading Mode</Tooltip>
    </div>
    <!-- Pagination -->
    {#if data.total > 1}
        <div class="flex space-x-3">
            <PaginationItem disabled={activeUrl == 0} class="flex items-center" on:click={previous}>
                <Icon icon="heroicons:chevron-left" />
                Previous
            </PaginationItem>
            <PaginationItem disabled={activeUrl >= data.total} class="flex items-center" on:click={next}>
                Next
                <Icon icon="heroicons:chevron-right" />
            </PaginationItem>
        </div>
    {/if}
</div>
