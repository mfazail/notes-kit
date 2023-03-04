## Screenshots

![Home](/images/home.jpg)

| Python codes/playground | Sql codes/playground |
|-----|-----|
| ![python-codes](/images/lang-python.png) | ![sql-codes](/images/lang-sql.png) |
| ![python-playground](/images/python.png)| ![sql-playground](/images/sql.png)|

## Tech Stack
1. [Sveltekit](https://kit.svelte.dev/)
2. [Supabase](https://supabase.com/)
3. [Tailwindcss](https://tailwindcss.com/)
4. [Flowbite](https://flowbite-svelte.com/)
5. [Shikijs](https://github.com/shikijs/shiki)
6. [Markdown-it](https://github.com/markdown-it/markdown-it)
7. [Codemirror](https://codemirror.net/)
8. [Sql.js](https://sql.js.org/)
9. [Pyscript](https://pyscript.net/)

## Generate supabase types

```bash
supabase gen types typescript --project-id [project-id] > ./src/lib/supabase/schema.ts
```

## Routes

> Public

```
/ -> topic, codes, new topic
/[subject] -> topic of specific subject, perpage=10
/codes/[lang] -> codes of specific language, perpage=10
/search -> search results in topic
/login -> log in page
/codes/playground/python -> python playground
/codes/playground/sql -> sql playground
```

> Loggedin

```
/dashboard -> topics created by loggedin user
/dashboard/add -> add topic
/dashboard/edit-[id] -> edit topic of the given id

/dashboard/code -> codes created by loggedin user
/dashboard/code/add -> add code
/dashboard/code/edit-[id] -> edit code of the given id

/dashboard/reset-password -> reset password of the current user
```

> Api(cached)

```
/api/codes -> get codes, perpage=10
/api/groupedTopic -> get new topics grouped by subject name, only topics added today
/api/search -> get search results, limit results 5
/api/subjects -> get topics, perpage=10
```