<script lang="ts">
    import { Navbar, NavBrand, Button, DarkMode, Kbd, Modal, Input } from "flowbite-svelte";
    import { goto, invalidate } from "$app/navigation";
    import { navigating } from "$app/stores";
    import { onMount } from "svelte";
    import Icon from "@iconify/svelte";
    import NProgress from "nprogress";
    import { client } from "$lib/supabase/client";
    import { user, logout } from "$lib/stores/auth";
    import NotificationProvider from "$lib/components/NotificationProvider.svelte";
    import { useNotification } from "$lib/stores/notifications";
    import { initMarkdown } from "$lib/utils/markdown";
    import "nprogress/nprogress.css";
    import "../app.postcss";

    NProgress.configure({
        minimum: 0.16,
        showSpinner: false,
    });
    $: {
        if ($navigating) {
            NProgress.start();
        }
        if (!$navigating) {
            NProgress.done();
        }
    }

    const notify = useNotification();
    let isLoggingOut = false;
    let searchModal = false;
    let search = "";
    onMount(async () => {
        await initMarkdown();
        const {
            data: { subscription },
        } = client.auth.onAuthStateChange((e, s) => {
			if (e == 'SIGNED_IN'){
				if (s) $user = s.user;
			}else if(e == 'SIGNED_OUT'){
				$user = null;
			}
            invalidate("supabase:auth");
        });

        return () => {
            subscription.unsubscribe();
        };
    });
    const handleLogout = async () => {
        isLoggingOut = true;
        const err = await logout();
        if (err) {
            notify.error({
                content: err.message,
                duration: 3000,
            });
            isLoggingOut = false;
            return;
        }
        isLoggingOut = false;
        $user = null;
        invalidate("supabase:auth");
        window.location.replace("/");
    };

    const handleSearch = async () => {
        searchModal = false;
        goto(`/search?q=${search}`);
    };
    const handleShortcut = (e: KeyboardEvent) => {
        // Ctrl+K to open search modal
        // preventDefault if shortcut(ctrl+k) is used
        if (e.ctrlKey && e.key == "k") {
            e.preventDefault();
            searchModal = true;
            return;
        }
        return e;
    };
</script>

<svelte:head>
    <title>4th sem notes</title>
    <meta name="description" content="Notes for 4th sem BCA" />
</svelte:head>

<svelte:body on:keydown={handleShortcut} />

<div class="app bg-slate-100 dark:bg-slate-800 w-full min-h-screen">
    <Navbar>
        <NavBrand href="/">
            <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"> Notes </span>
        </NavBrand>
        <div class="flex space-x-2 md:order-2">
            <Button
                color="alternative"
                class="!px-2 !py-1"
                on:click={() => {
                    searchModal = true;
                }}>
                <Icon icon="heroicons:magnifying-glass-20-solid" class="w-5 h-5 mr-2" />
                Search
                <Kbd class="ml-2 px-2 py-1 text-xs">Ctrl+K</Kbd>
            </Button>
            <DarkMode class="text-lg">
                <svelte:fragment slot="lightIcon">
                    <Icon icon="line-md:moon-rising-filled-alt-loop" class="w-5 h-5 text-white" />
                </svelte:fragment>
                <svelte:fragment slot="darkIcon">
                    <Icon icon="line-md:sun-rising-filled-loop" class="w-5 h-5" />
                </svelte:fragment>
            </DarkMode>
            {#if $user}
                <Button color="alternative" href="/dashboard" size="sm"
                    ><Icon icon="ic:round-space-dashboard" /></Button>
                <Button disabled={isLoggingOut} on:click={handleLogout} size="sm"
                    ><Icon icon="ic:twotone-logout" /></Button>
            {:else}
                <Button href="/login" size="sm">Login</Button>
            {/if}
        </div>
    </Navbar>

    <NotificationProvider>
        <main>
            <slot />
        </main>
    </NotificationProvider>
    <Modal bind:open={searchModal} title="Search notes" placement="top-center" size="lg" autoclose>
        <form on:submit|preventDefault={handleSearch} class="relative min-w-[300px]">
            <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <Icon icon="heroicons:magnifying-glass-20-solid" class="w-5 h-5" />
            </div>
            <Input bind:value={search} class="pl-10" placeholder="Search..." />
        </form>
    </Modal>
</div>
