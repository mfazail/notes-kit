<script lang="ts">
    import { renderHtml } from "$lib/utils/markdown";
    import { Card, Button, A, P } from "flowbite-svelte";
    import { formatDate } from "$lib/utils/constant";
	import { adminTopics } from "$lib/stores/topics";

</script>

<div class="p-4">
    <Button href="/dashboard/add">Add topic</Button>
    <Button href="/dashboard/code/add">Add code</Button>
    <Button href="/dashboard/reset-password">Reset password</Button>
    <Button href="/dashboard/code">Codes</Button>
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
    {#each $adminTopics as topic}
        <Card class="!w-full !max-w-none">
            <h5 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                {topic.title} <span class="text-xs">({topic.subject})</span>
            </h5>
            <p class="text-xs pb-2 ">{formatDate(topic.from ?? "")} - {formatDate(topic.to ?? "")}</p>
            <p class="prose dark:prose-invert my-3 max-h-96 overflow-hidden">
                {@html renderHtml(topic.content)}
            </p>
            <div class="flex items-center justify-between">
                <p class="text-xs">
                    Last updated <span class="font-medium"> {formatDate(topic.updated_at ?? "")}</span>
                </p>
                <A class="w-fit self-end" href={`/dashboard/edit-${topic.id}`}>
                    Edit <span class="text-xl -mt-1 pl-1">&rarr;</span>
                </A>
            </div>
        </Card>
    {:else}
        <P>No Topics <A href="/dashboard/add">Add one here</A></P>
    {/each}
</div>
