<script lang="ts">
    const CodeMirror = import("svelte-codemirror-editor");
    import {
        Button,
        Heading,
        Tooltip,
        Table,
        TableBody,
        TableHead,
        TableBodyCell,
        TableBodyRow,
        TableHeadCell,
    } from "flowbite-svelte";
    import { onMount } from "svelte";
    import { sql } from "@codemirror/lang-sql";
    import { oneDark } from "@codemirror/theme-one-dark";
    import Icon from "@iconify/svelte";
    import { codeToRun } from "$lib/stores/playground";
    import type { Database, QueryExecResult } from "sql.js";
    import { useNotification } from "$lib/stores/notifications";

    const notify = useNotification();

    let db: Database;
    let value = "";
    let title = "Execute your sql below";
    let output: QueryExecResult[] = [];
    let isDirty = false;
    $: {
        value;
        isDirty = true;
    }

    onMount(async () => {
        window.onbeforeunload = function () {
            if (isDirty) return "Confirm before leaving!";
            return undefined;
        };
        if ($codeToRun) {
            value = $codeToRun.content;
            title = $codeToRun.title;
        }
        const { default: SQL } = await import("sql.js");
        const Sql = await SQL({
            locateFile: (name: string) => `/dist/${name}`,
        });
        db = new Sql.Database();
        isDirty = false;
        // db.run() // optional to seed db
        return () => {
            db.close();
        };
    });

    const run = () => {
        if (db) {
            try {
                output = db.exec(value.trim());
                // console.log({ output });
                notify.success({
                    content: "Query Executed",
                    duration: 3000,
                });
            } catch (e) {
                // console.log(e);
                notify.error({
                    content: " " + e,
                    duration: 3000,
                });
            }
        }
    };
</script>

<div class="px-4 ">
    <Heading tag="h3" class="my-4">{title}</Heading>

    <div class="w-full">
        {#await CodeMirror then Comp}
            <Comp.default bind:value lineWrapping theme={oneDark} lang={sql()} class="w-full" />
        {/await}
    </div>

    {#if output.length > 0}
        <Table>
            <TableHead>
                {#each output[0].columns as head}
                    <TableHeadCell>
                        {head}
                    </TableHeadCell>
                {/each}
            </TableHead>
            <TableBody>
                {#each output[0].values as cells}
                    <TableBodyRow>
                        {#each cells as cell}
                            <TableBodyCell>{cell}</TableBodyCell>
                        {/each}
                    </TableBodyRow>
                {/each}
            </TableBody>
        </Table>
    {/if}
    <div class="fixed bottom-8 right-4 z-50">
        <Button pill class="!p-2" on:click={run}>
            <Icon icon="heroicons:play" class="w-5 h-5 text-white" />
        </Button>
        <Tooltip>Execute</Tooltip>
    </div>
</div>
