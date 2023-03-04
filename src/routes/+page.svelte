<script lang="ts">
    import { subjects } from "$lib/utils/constant";
    import type { Topic } from "$lib/stores/topics";
    import { renderHtml } from "$lib/utils/markdown";
    import { Modal, Card } from "flowbite-svelte";
    import Icon from "@iconify/svelte";
    import type { PageData } from "./$types";
    export let data: PageData;
    let content = "";

    let currentTopic: Topic | undefined = undefined;

    let codes = [
        { link: "/codes/python", name: "Python", icon: "mdi:language-python" },
        { link: "/codes/sql", name: "SQL", icon: "simple-icons:mysql" },
    ];

    const handleTopic = (topic: Topic) => {
        currentTopic = topic;
        content = renderHtml(currentTopic.content!);
    };
</script>

<div class="max-w-7xl mx-auto p-4">
    <h3 class="text-3xl text-blue-400 my-4">New Topics</h3>
    <Card class="!w-full !max-w-none">
        <ul>
            {#each data.results as update}
                <li
                    class="before:content-['*'] before:pt-2 before:pr-2 dark:text-white flex flex-wrap items-center space-x-2">
                    <p>{update.subject}:</p>
                    {#each update.topics as topic}
                        <button
                            class="text-sm underline underline-offset-2 text-blue-400 hover:text-blue-500"
                            on:click={() => handleTopic(topic)}>{topic.title}</button>
                    {/each}
                </li>
            {:else}
                <li>Nothing today...</li>
            {/each}
        </ul>
    </Card>

    <h3 class="text-3xl text-blue-400 my-4">Notes</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each subjects as subject}
            <Card href={subject.link}>
                <div class="flex items-start justify-between border-b border-blue-400">
                    <div>
                        <h3 class="text-xl font-medium mb-3">
                            {subject.name} <span class="text-xs">({subject.code})</span>
                        </h3>
                        <p class="text-sm">{subject.teacher}</p>
                    </div>
                    <div class="flex items-center justify-center  rounded-full w-10 h-10">
                        <Icon icon={subject.icon} class="w-6 h-6" />
                    </div>
                </div>
            </Card>
        {/each}
    </div>
    <h3 class="text-3xl text-blue-400 my-4">Codes</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each codes as code}
            <Card href={code.link}>
                <div class="flex items-start justify-between border-b border-blue-400">
                    <div>
                        <h3 class="text-xl font-medium mb-3">
                            {code.name}
                        </h3>
                    </div>
                    <div class="flex items-center justify-center  rounded-full w-10 h-10">
                        <Icon icon={code.icon} class="w-6 h-6" />
                    </div>
                </div>
            </Card>
        {/each}
    </div>
</div>

<Modal size="md" open={currentTopic ? true : false} title={currentTopic ? currentTopic.title ?? "" : ""}>
    <div class="prose dark:prose-invert max-h-[70vh] overflow-y-auto">
        {@html content}
    </div>
</Modal>
