import {
  Application,
  Router,
  Status,
} from "https://deno.land/x/oak@v10.0.0/mod.ts";
import { Bson, MongoClient } from "https://deno.land/x/mongo@v0.29.0/mod.ts";
import { timeAgo } from "https://deno.land/x/time_ago@v1/mod.ts";

import view from "./view.ts";

const MONGO_URI = Deno.env.get("MONGO_URI");
if (!MONGO_URI) throw new Error("MONGO_URI not found");

const app = new Application();
const router = new Router();

const client = new MongoClient();

await client.connect(MONGO_URI);

interface Post {
  _id: Bson.ObjectId;
  title: string;
}

const collection = client.database().collection<Post>("posts");

router.get("/", async (ctx) => {
  const posts = await collection
    .find({}, { noCursorTimeout: false })
    .sort({
      _id: -1,
    })
    .map((post) => ({
      ...post,
      timeAgo: timeAgo(post._id.getTimestamp()),
    }));

  ctx.response.body = view(posts)!;
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
