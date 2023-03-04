<script lang="ts">
    import { login } from "$lib/stores/auth";
    import { Card, Label, Input, Button, Spinner } from "flowbite-svelte";
    import { useNotification } from "$lib/stores/notifications";
    import { goto } from "$app/navigation";

    const notify = useNotification();
	
    let isSubmitting = false;
    let email = "";
    let password = "";

    const handleLogin = async () => {
        if (!email && !password) {
            notify.error({
                content: "Fill all the fields",
            });
            return;
        }
        if (!email.includes("@")) {
            notify.error({
                content: "Enter a valid email",
            });
            return;
        }
        isSubmitting = true;
        const err = await login(email, password);
        if (err) {
            notify.error({
                content: err?.message,
                duration: 4000,
            });
			isSubmitting = false;
            return;
        }
        isSubmitting = false;
        goto("/dashboard");
    };
</script>

<Card class="w-80 p-4">
    <div class="flex flex-col space-y-6">
        <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Sign in to Notes</h3>
        <Label class="space-y-2">
            <span>Email</span>
            <Input bind:value={email} type="email" name="email" placeholder="example@notes.com" required />
        </Label>
        <Label class="space-y-2">
            <span>Your password</span>
            <Input bind:value={password} type="password" name="password" placeholder="•••••" required />
        </Label>
        <Button disabled={isSubmitting} on:click={handleLogin} class="w-full">
            {#if isSubmitting}
                <Spinner size="4" class="mr-3" />
            {/if}
            Login to your account
        </Button>
    </div>
</Card>
