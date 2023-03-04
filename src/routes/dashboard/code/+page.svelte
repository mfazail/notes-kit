<script lang="ts">
    import { formatDate, wrapWithTilde } from "$lib/utils/constant";
    import { renderHtml } from "$lib/utils/markdown";
    import { A, Button, Card } from "flowbite-svelte";
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<div class="p-4">
    <Button href="/dashboard/code/add">Add code</Button>
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
    {#each data.codes as topic}
        <Card class="!w-full !max-w-none">
            <h5 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                {topic.title} <span class="text-xs">({topic.lang})</span>
            </h5>
            <p class="prose dark:prose-invert my-3 max-h-96 overflow-hidden">
                {@html renderHtml(wrapWithTilde(topic.lang, topic.content))}
            </p>
            <div class="flex items-center justify-between">
                <p class="text-xs">
                    Last updated <span class="font-medium"> {formatDate(topic.updated_at ?? "")}</span>
                </p>
                <A class="w-fit self-end" href={`/dashboard/code/edit-${topic.id}`}>
                    Edit <span class="text-xl -mt-1 pl-1">&rarr;</span>
                </A>
            </div>
        </Card>
    {:else}
        <span>No Topics</span>
    {/each}
</div>
