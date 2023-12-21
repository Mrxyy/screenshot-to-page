import { Application, proxy } from 'https://deno.land/x/oak/mod.ts';

const app = new Application();
app.use(proxy('https://api.openai.com'));

app.listen({ port: 8000 });
