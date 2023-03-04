<script lang="ts">
	import { A, Badge, Button, Heading, Hr, P, PaginationItem } from "flowbite-svelte";
    import type { PageData } from "./$types";
    import { goto } from "$app/navigation";
    import Icon from "@iconify/svelte";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { formatDateForInput, wrapWithTilde } from "$lib/utils/constant";
    import { codeToRun } from "$lib/stores/playground";
    import { renderHtml } from "$lib/utils/markdown";
    import type { Code } from "$lib/stores/codes";
    import { user } from "$lib/stores/auth";
    export let data: PageData;

    $: activeUrl = 0;
    onMount(() => {
        activeUrl = parseInt($page.url.searchParams.get("page") ?? "0");
    });

    const previous = () => {
        if (activeUrl != 0) goto(`/${data.lang}?page=${activeUrl - 1}`);
    };
    const next = () => {
        if (activeUrl < data.total) goto(`/${data.lang}?page=${activeUrl + 1}`);
    };
    const openPlayground = async (code:Code) => {
		$codeToRun = code
		await goto(`/codes/playground/${code.lang}`)
	};
</script>

<div class="max-w-7xl mx-auto p-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {#each data.codes as code}
            <div class="">
                <Heading tag="h3" class="text-xl font-medium mb-3 ">{code.title}</Heading>
                <div class="mt-4 prose dark:prose-invert">
                    {@html renderHtml(wrapWithTilde(code.lang, code.content))}
                </div>
                <div class="flex items-center justify-between">
                    <P class="relative">
						Run in playground
						<Badge color="yellow" class="">beta</Badge>
					</P>
                    <Button pill class="!p-2 mt-1" on:click={()=>openPlayground(code)}>
                        <Icon icon="heroicons:play" class="w-4 h-4 text-white" />
						
                    </Button>
                </div>
                <Hr class="my-8" height="h-px">
                    <p>
                        <span class="text-xs font-normal"
                            >Last updated {formatDateForInput(code.updated_at ?? "")}</span>
                        {#if $user}
                            <A href="/dashboard/code/edit-{code.id}" class="text-sm text-gray-500">Edit</A>
                        {/if}
                    </p>
                </Hr>
            </div>
        {:else}
            <div class="text-center text-gray-500">No code found</div>
        {/each}
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
