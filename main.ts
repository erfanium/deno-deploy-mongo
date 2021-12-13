import {
  Application,
  Router,
  Status,
} from "https://deno.land/x/oak@v10.0.0/mod.ts";
import { Bson, MongoClient } from "https://deno.land/x/mongo@v0.28.1/mod.ts";

const MONGO_URI = Deno.env.get("MONGO_URI");
if (!MONGO_URI) throw new Error("MONGO_URI not found");

const app = new Application();
const router = new Router();

const client = new MongoClient();

await client.connect(MONGO_URI);
const collection = client.database().collection("posts");

router.get("/", async (ctx) => {
  const posts = await collection.find({}, { noCursorTimeout: false })
    .toArray();

  ctx.response.body = posts;
});

router.post("/", async (ctx) => {
  if (!ctx.request.hasBody) ctx.throw(Status.BadRequest, "Bad Request");

  const body = await ctx.request.body().value;
  if (!body) ctx.throw(Status.BadRequest, "Bad Request");

  const title = body.title;
  if (!title) ctx.throw(Status.BadRequest, "Title is required");

  const post = {
    _id: new Bson.ObjectId(),
    title,
  };

  await collection.insertOne(post);

  ctx.response.body = post;
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8000 });
