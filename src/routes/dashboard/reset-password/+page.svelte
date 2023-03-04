<script lang="ts">
    import { Card, Label, Input, Button, Spinner } from "flowbite-svelte";
    import { useNotification } from "$lib/stores/notifications";
    import { goto } from "$app/navigation";
    import { client } from "$lib/supabase/client";
    import { user } from "$lib/stores/auth";

    let isSubmitting = false;
    let password = "";
    let confirmPassword = "";
    const notify = useNotification();

    const handleUpdate = async () => {
        // return if the fields are empty or the passwords don't match

        if (!password && !confirmPassword) {
            notify.error({
                content: "Fill all the fields",
            });
            return;
        }
        if (password !== confirmPassword) {
            notify.error({
                content: "Passwords don't match",
            });
            return;
        }
        isSubmitting = true;
        const { data, error } = await client.auth.updateUser({ password });
        if (error) {
            notify.error({
                content: error.message,
                duration: 4000,
            });
            return;
        }
        isSubmitting = false;
        notify.success({
            content: "Password updated successfully",
            duration: 4000,
        });
        $user = data.user;
        goto("/dashboard");
    };
</script>

<section class="w-full h-[90vh] flex items-center justify-center">
    <Card class="w-80 p-4">
        <div class="flex flex-col space-y-6">
            <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Reset password</h3>
            <Label class="space-y-2">
                <span>New password</span>
                <Input bind:value={password} type="password" name="password" placeholder="•••••" required />
            </Label>
            <Label class="space-y-2">
                <span>Confirm password</span>
                <Input
                    bind:value={confirmPassword}
                    type="password"
                    name="confirmPassword"
                    placeholder="•••••"
                    required />
            </Label>
            <Button disabled={isSubmitting} on:click={handleUpdate} class="w-full">
                {#if isSubmitting}
                    <Spinner size="4" class="mr-3" />
                {/if}
                Change password
            </Button>
        </div>
    </Card>
</section>
