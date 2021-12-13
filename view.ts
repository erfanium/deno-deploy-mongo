interface Post {
  title: string;
  timeAgo: string;
}

const script = `async function post() {
   const input = document.getElementById("message");
   const title = input.value;

   if (!title) return;

   const response = await fetch("/", {
      method: "POST",
      headers: {
         "Content-Type": "application/json"
      },
      body: JSON.stringify({ title })
   });

   if (response.ok) {
      // Reload the page
      location.reload();
   }
}`;

const head = `<head>
   <title>Deno + Deno Deploy + MongoDB Demo</title>
   <meta charset="utf-8">
   <meta name="viewport" content="width=device-width, initial-scale=1">
   <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
   <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
   <script>${script}</script>
</head>`;

const post = (p: Post) =>
  `<div class="card mb-2">
      <div class="card-body">
         <h5 class="card-title">${p.title}</h5>
         <p class="card-text text-end text-muted">${p.timeAgo}</p>
      </div>
</div>`;

const body = (p: Post[]) =>
  `<div class="container">
   <h1 class="text-center">Deno + Deno Deploy + MongoDB Demo</h1>
   <div class="mt-4 d-flex flex-row">
      <input id="message" type="text" class="form-control" placeholder="Write a message...">
      <button class="btn btn-primary ms-3" onclick="post()">Post</button>
   </div>
   <h2 class="mt-5">Posts</h2>
   <div class="row">
      ${p.map(post).join("")}
   </div>
</div>`;

const footer = `<footer class="footer">
   <div class="container">
      <span class="text-muted">&copy; 2021</span>
   </div>
</footer>`;

export default (p: Post[]) =>
  `<!DOCTYPE html>
<html lang="en">
   ${head}   
   <body>
      ${body(p)}
      ${footer}
   </body>
</html>`;
