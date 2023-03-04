<script lang="ts">
    import { renderHtml } from "$lib/utils/markdown";
    import { formatDate, formatDateForInput } from "$lib/utils/constant";
    import { A, Heading, Hr, P } from "flowbite-svelte";
    import type { PageData } from "./$types";
    import { user } from "$lib/stores/auth";
    export let data: PageData;
</script>

<div class="max-w-7xl mx-auto p-4">
    {#if data.results}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {#each data.results as topic}
                <div>
                    <Heading tag="h3" class="text-xl font-medium mb-3 ">{topic.title}</Heading>
                    <P class="text-xs">{formatDate(topic.from ?? "")} to {formatDate(topic.to ?? "")}</P>
                    <div class="mt-4 prose dark:prose-invert">{@html renderHtml(topic.content)}</div>
                    <Hr class="my-8" height="h-px">
                        <p>
                            <span class="text-xs font-normal"
                                >Last updated {formatDateForInput(topic.updated_at ?? "")}</span>
                            {#if $user}
                                <A href="/dashboard/edit-{topic.id}" class="text-sm text-gray-500">Edit</A>
                            {/if}
                        </p>
                    </Hr>
                </div>
            {/each}
        </div>
    {:else}
        <div class="text-center text-gray-500">Nothing here</div>
    {/if}
</div>
