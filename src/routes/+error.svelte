<script lang="ts">
    import { page } from "$app/stores";
	import { A } from 'flowbite-svelte'
</script>

<section class="bg-white dark:bg-gray-900 h-full">
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div class="mx-auto max-w-screen-sm text-center">
            <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">{$page.status}</h1>
            <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">{$page.error?.message}</p>
            <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">contact <A href="https://wa.me/+918709792517" target="_blank">@fazail_alam</A> on whatsapp</p>
        </div>   
    </div>
</section>