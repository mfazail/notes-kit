<script lang="ts">
    import { Toast } from "flowbite-svelte";
    import { notifications, type Notification } from "$lib/stores/notifications";
    import Icon from "@iconify/svelte";
	// return color according to notification type
    const getColor = (t: Notification["type"]) => {
        return t == "error" ? "red" : t == "warn" ? "yellow" : t == "success" ? "green" : "blue";
    };
	// return icon according to notification type
    const getIcon = (t: Notification["type"]) => {
        return t == "error"
            ? "heroicons:x-circle"
            : t == "warn"
            ? "heroicons:exclamation-triangle"
            : t == "success"
            ? "heroicons:check-badge"
            : "heroicons:information-circle";
    };
</script>

<slot />

<div id="notifications" class="fixed top-4 right-4 space-y-2">
    {#each $notifications as notification (notification.id)}
        <Toast class="!py-2" color={getColor(notification.type)}>
            <svelte:fragment slot="icon">
                <Icon icon={getIcon(notification.type)} class="w-4 h-4" />
            </svelte:fragment>
            {notification.content}
        </Toast>
    {/each}
</div>
