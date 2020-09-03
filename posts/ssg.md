# 2020-08-26: The Making of This Blog: A Custom Static Site Generator
{unlisted}
I have a blog now! It’s a static site hosted using [Netlify](https://www.netlify.com). Rather than using an existing static site generator, I decided to create my own in vanilla JavaScript. I did this for several reasons. I try to always do something I’ve never done before each time I do a personal project. Writing a custom SSG would also make a good topic for my first post (which you’re reading!). And, of course, writing a bunch of code is a good excuse to delay writing actual blog posts.

## Guiding principles
<!--
- inspiration: Jekyll, Gatsby
- do as much with my own code as is reasonable
- Not OSS
- in every project I try to do at least one new thing
- spend a bunch of time making the site so I don’t have to write blog posts
- have something worth writing about so I have a topic for my first blog post
-->
I’ve used [Jekyll](https://jekyllrb.com) and [Gatsby](https://www.gatsbyjs.com) in the past to create static websites, so I was inspired by how these tools worked. I think the clearest influences are how I carried over Jekyll’s no-frills approach of simply rendering the HTML you give it, and my framework-free interpretation of Gatsby’s JS-based templates and data flow.
While there are many tools available for making a blog, I wanted to do as much with my own code as was reasonable (perhaps a bit more than was reasonable in certain places) rather than just installing something pre-built from npm. This was definitely easier to do at the start of the project than at the end, but I still only have 88 packages in my `node_modules` directory, and (excluding dev dependencies not required to build the site) it comes out at a little over 5 MB, with about half of that coming from [highlight.js](https://highlightjs.org).
Although many of my projects are open-source, and I will be hosting this blog in a public repo on GitHub, I decided not to release this project under an open-source license for several reasons. I want to retain control over my writing and how it is displayed. I also want to have some personal branding (largely identical to my homepage at [jedfox.com](https://jedfox.com) which is similarly not under an open-source license) that can’t just be adopted by others. I also don’t think my blog engine is the kind of tool that should be widely used, because it’s tuned for my use case, which enables me to avoid configurability and make breaking changes whenever I like without worrying about usage outside of my personal blog.

## Initial exploration
<!--
- Write it in Swift? I’ve been using Swift a lot recently but haven’t made a website using it
	- there’s pretty much only one SSG and I kinda wanted to make my own
	- I don’t actually know it *that* well and I like to use something I’m at least somewhat familiar with instead of starting from scratch
	- I made an Attempt™ but it didn’t work out
- Write it as a bash/fish script?
	- I’m sure this is possible but the low-levelness of the language means it would probably be a pain and not have many of the syntactic niceties I crave
	- I feel pretty confident writing scripts at the level I typically use them (ie not super difficult; I’ll switch to a scripting language if I need to do something complicated like an SSG)
- Write it in raw WebAssembly and/or run it directly in-browser?
	- This was mostly a joke I made to a friend, although I think it would be cool to see people use service workers as servers more
	- see my todomvc thing (TODO: LINK)
- Gatsby
	- enormous, complex
	- maybe the company behind Gatsby isn’t the greatest?
	- uses react which I like but I like vanilla stuff more, especially for something non-interactive like a blog
	- I already used (abused?) it for read262, so I wouldn’t be learning something new
	- I actually set up a Gatsby blog a while back but never deployed it; I tried to run it again recently and it didn’t work ¯\\\_(ツ)\_/¯
		- I’m more confident that my stuff will work because the dependencies are not central to the website
		- the biggest risk is that I’d have to rewrite the Markdown parsing/rendering part which would be annoying but likely only take a few minutes
- Jekyll?
	- less complex than Gatsby but still does a ton of stuff I’ll never need
	- robust plugin ecosystem but I’ll learn more by writing stuff on my own
	- uses Liquid for templating. I know and love JS so using JS to do the templates isn’t a huge deal for me
	- I’ve used it before for several different things, so less of a learning experience
-->
I didn’t immediately settle on writing my own blog engine in JavaScript. Since I’ve been using a lot of Swift recently, I looked for SSGs in that space. There seemed to be only one that was actively maintained, and I briefly experimented on creating my own before realizing that I wasn’t really sure how to start, and I knew the set of tools available in JavaScript much better than Swift. In a couple of years when the server-side Swift ecosystem has matured, I might switch this blog over!
My next step was to consider writing a set of shell scripts (probably in [Fish](https://fishshell.com)) that would build my site. Shell scripting is great, and the shell is very well integrated with the file system, but I couldn’t easily find a good, configurable Markdown renderer. Additionally, my proficiency in shell scripts matches my usage of them — I’m not an expert, and I use them occasionally for simple tasks. A static site generator is not a simple task in a shell scripting language.
I joked with a friend about writing the engine in raw WebAssembly and then running it in the browser, but that would be a terrible idea for many reasons so I quickly abandoned it. However, I do think there is a future in using [service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) for some tasks traditionally handled by servers — check out my [TodoMVC implementation](https://todomvc-service-worker.jedfox.com) that does almost all the work in a service worker, with the HTML containing only a few inline scripts to implement some minor features ([read the source code here](https://github.com/j-f1/todomvc-service-worker)) and a ton of HTML forms (both hidden and visible) that sent commands to the service worker.
Then I considered using Gatsby. I’ve [used it in the past](https://read262.jedfox.com) with some success, so I wouldn’t be learning anything new. (In fact, I made myself a simple blog in Gatsby that I never published a while back, so I would likely have just used that. My attempt to resurrect the blog failed with a large number of errors that made me feel less confident my own blog would continue to build into the future.) Gatsby is an enormous, complex tool that has the capability to do many things I’ll never need for my blog. It also generates somewhat large JS bundles by default that I don’t feel like I need for a simple, non-interactive site like this one. And, around the time I was starting this project, a former Gatsby employee [posted a thread on Twitter](https://twitter.com/tesseralis/status/1293679185169244160?s=20) detailing a variety of issues with both the software and the company behind it.
I then considered Jekyll. I’ve [used it](https://charcoal-se.org) for sites before, but I don’t think I’ve ever built a Jekyll site from scratch. It’s a lot simpler than Gatsby, but it still has a lot of functionality I don’t need. It also uses a template language called [Liquid](http://shopify.github.io/liquid/) to assemble its layouts, but I felt comfortable using a real programming language to render HTML. Plus, Liquid is another layer of indirection between the rendered output and the files on disk that I don’t need for this project.
After this exploration and briefly browsing [staticgen.com](https://www.staticgen.com), I decided to make my own site.

## Visual Design
<!--
- took design from jedfox.com
- use the system font keywords to match the rest of the OS
- Date format: just use the JS default. Easy!
- Automatic dark mode for everything
- no comments because that’s likely to lead to spam which I don’t want to maintain.
-->
I start out the HTML file by linking to the stylesheet for [jedfox.com](https://jedfox.com), so I should probably talk about the design of that first. I wanted the site to be simple, clean, and responsive. Where possible, I use system fonts. Instead of having a dark mode toggle, I just adopt the system setting where available. Page content is limited to a readable width of 650px on desktop. I use modern CSS, since I expect a technical audience will have an up-to-date browser.
I made a few tweaks to the styling of both websites while building the blog, but most of the work was already done when I started the blog. One of the things I had to contend with was date formatting. I’m using ISO8601-style dates in my source files as it’s easy to parse and I prefer to use it, but I wanted to have something a little more friendly on the frontend. I could’ve used a date-formatting library like [moment](https://momentjs.com) or [date-fns](https://date-fns.org) but it turns out JavaScript provides a handy method on `Date` objects to format them: `new Date().toDateString()` outputs “Thu Sep 03 2020.” This format is not configurable, but it’s human-readable and suffices for my purposes.
One last design decision that I made was to not enable comments. There are a variety of tools available for static sites, but I decided that I didn’t want to either include an enormous third-party embed like Discus or manually handle spam, so I decided to just put a note at the bottom of all the posts with a variety of ways to get in contact with me. I don’t expect to receive a ton of comments, so this should be manageable.

## Rendering posts
<!--
- remark
- ulysses for writing
- syntax highlighting
-->
At first I just wrote my SSG to only support plain-text content. This is, of course, a terrible idea since it’s important to be able to use at least some formatting in blog posts. I could’ve rolled my own markup language but that’s a complex endeavor. I could also have used raw HTML but that’s less nice than Markdown, and I wanted to be able to write in [Ulysses](https://ulysses.app) (see [the section on writing](#writing-posts)). I’ve read about [remark](https://remark.js.org) before so I decided to give it a shot. It was really easy to set up and use, and I added a couple of plugins to do syntax highlighting and allow linking to specific headers.
For syntax highlighting, I run [highlight.js](https://highlightjs.org) at build time. It generates tokenized HTML which requires a CSS file to be loaded on the client side for the code to actually be highlighted. As an [Atom](https://atom.io) user (even as it loses out to VS Code in the editor wars),  I’m rather partial to the built-in Atom One Light and Dark syntax themes. Fortunately, highlight.js offers CSS files that mimic these themes. I’m also among the heathen that use light themes in their code editors (although I have it set up to switch to dark mode when the sun goes down, if that makes it more acceptable to you) and I wanted the theme of the code to match the rest of the page. To achieve this, I used the `media` attribute of the `<link>` tag to only enable the themes in light or dark mode, respectively. This works fairly well, although it does mean that browsers that don’t support the `prefers-color-scheme` media query won’t see any syntax highlighting at all, a risk I’m willing to take. Here’s the code I used, which also serves as a handy demonstration of its function. (try switching your computer to dark mode or light mode!)
```html
<link
  rel="stylesheet"
  href="/atom-one-light.css"
  media="(prefers-color-scheme: light)"
/>
<link
  rel="stylesheet"
  href="/atom-one-dark.css"
  media="(prefers-color-scheme: dark)"
/>
```

## Feeds
<!--
- why a feed?
- rss is important but complicated
- JSON feeds are quite widely supported and extremely simple to create with JS
-->
You might have noticed (on the homepage or at the end of this article) a link to [the JSON Feed](/feed.json) for this blog. The amazing resource [About Feeds](https://aboutfeeds.com) provides an amazing brief introduction to what feeds are on the web and how you can subscribe to them. (You should check it out before continuing with this section if you don’t know much about feeds). If you’ve been around the Internet for a while, you’ve probably heard of RSS feeds. RSS is an XML-based format that has been around for many years. It's a very well-supported format that is available from many websites. However, technological advances have mostly pushed XML to the side, so a new feed format called JSON Feed was created as a more modern alternative that uses JSON instead of XML. It’s supported by many newsreaders (I personally use and recommend [NetNewsWire](https://ranchero.com/netnewswire/) and [Feedly](https://feedly.com), which both support JSON Feeds) and is much easier to generate using JavaScript (you can simply [create an object literal](https://github.com/j-f1/blog/blob/bcb5e43/src/feed.js), then stringify it instead of having to worry about XML and escaping). I might add an RSS or Atom feed too if people want it though.

## Developer Experience
<!--
- watch source files and re-run the build when something changes
	- in the future, could do incremental builds but right now it’s \<1s to build the whole thing so ¯\\\_(ツ)\_/¯
- Uses chalk to make things colorful
- the same script runs in dev and prod
- `html` template tag
	- automatic escaping by default
	- explicit `safe()` function to mark text that intentionally contains HTML
	- returns a `safe()` object, which has a `toString()` method for turning it back into a string before outputting it
	- automatically flattens arrays
- Using Prettier with default settings
	- I like single quotes and dislike semicolons but it really doesn’t matter as Prettier automatically adjusts those things anyway
	- started using the default settings a while ago and it hasn’t really been a big deal.
-->
I probably spent too much time on the DX for my build script. The end result is quite nice, if I do say so myself! I use the [`watch`](https://npmjs.com/package/watch) package to run the build script whenever a file is changed. Currently it just rebuilds the whole site when any file is changed, but since it only takes around 250-350ms to do that I don’t see the need to make it any smarter than it is. The script uses [`chalk`](https://github.com/chalk/chalk) to produce colorful output:
![Build script output showing success and failure](/posts/ssg/build-script-output.png)
An advantage of keeping the build script relatively simple is that I’m able to run the same code in both development and on Netlify’s build servers. This is great because I often make mistakes, and having only one piece of code to do the work reduces the chance that I’ll miss something.
On the code side, I’m pretty proud of the `html` template tag I’ve created. By calling it `html`, Atom highlights it as HTML and I’m able to have Prettier (discussed below) automatically format its contents. But the benefit extends beyond that: The template tag also handles escaping for me. Any string interpolated into the HTML is assumed to be unsafe by default, and characters like `<`, `"`, and `&` are escaped to prevent injection attacks (although that shouldn’t be too huge of an issue since I control all the inputs to the code). If I instead wrap the string in a call to `safe()` before interpolating it, the contents will not be escaped, which is used when rendering posts. The `html` template tag wraps its result in `safe()` before returning it, since the HTML markup inside of the output was either hardcoded or already marked as safe. Here’s a quick demo of how it can be used:
```js
const renderedPost = html`
  <h1>${post.title}</h1>
  <article>${safe(post.content_html)}</article>
`;

const postPage = html`
  <html>
    <body>
      <main>${renderedPost}</main>
    </body>
  </html>
`;

fs.writeFileSync(`posts/${post.slug}.html`, postPage.toString());
```
For formatting, I’m using Prettier with its default settings. I personally prefer using single quotes instead of double quotes and don’t like using semicolons, but the difference isn’t very significant and it saved me a few seconds not having to type out the settings into the config file. It provides enormous benefit to me by not forcing me to think about formatting, though!
Although I’m not using TypeScript directly, I am benefiting from `atom-ide`’s TypeScript support and have installed `@types/node`. Most of my code is simple enough that type information would not provide very much utility, although I would definitely use it on larger projects.

## Writing Posts
<!--
- Ulysses is a great WYSIWYG-ish editor for markdown files
- but it doesn’t use standard paragraph breaks
	- so I had to write a custom transform to preserve the editing experience in Ulysses while still getting my desired output
- Metadata
	- Originally started off with a Jekyll-inspired simplified YAML front matter
	- Rather than a free-form document I wanted to ensure it was somewhat type checked, so I made special handlers for each metadata key
- Then I threw all this out and went back to the drawing board
	- the title could just go into an h1
	- The date could go right before the title
		- This differs from Jekyll and such because those ones put the date in the title
		- depending on how I feel in the future this may change
	- “tags” go underneath the title and specify optional additional metadata
		- originally used `[brackets]` but switched to `{braces}` because brackets are part of the link syntax. I don’t know how I didn’t think of that at first
		- currently the only one is `{unlisted}` which hides the post from  the home page and feed
-->
I wanted to write the posts in Ulysses, which I’ve been using for college notes and assignments in the past year. It’s a nice Markdown-adjacent sort-of-WYSIWYG editor. I was able to add my `posts` directory as an External Folder in the sidebar, and view a list of all the posts there.
Unfortunately, Ulysses does not output standard Markdown. There are two main issues:paragraph spacing and front matter support. Ulysses does not put a blank line between paragraphs by default, causing normal Markdown renderers to combine adjacent paragraphs into one. I looked around and could not find a remark plugin to fix this issue. However, it didn’t turn out to be very difficult to write a custom plugin that detects paragraphs containing a newline (that is not part of a line break) and splits them apart. With that enabled, what I see in Ulysses is pretty close to what I get on the website.
The other issue was with front matter. While there isn’t as big of an incompatibility with front matter as there was with paragraph spacing, Ulysses treats the front matter as prose rather than code. I briefly tried wrapping it in a code block instead, but I realized that I might not actually need front matter. YAML is a simple-looking format that is actually very complex and potentially dangerous to parse. Plus it allows for a degree of customizability I don’t need. I realized that I only really needed four pieces of metadata about a blog post: the title, the publish date, the [slug](https://en.wikipedia.org/wiki/Clean_URL#Slug) (for its URL), and whether or not the post should be listed on the homepage. I briefly tried making a simplified form of YAML but soon realized that there was a better, more human-readable way. I start off each article with a level 1 heading containing the date and title. Next, there is an optional line with “tags” surrounded by curly braces, like `{unlisted}`. Currently there's just `{unlisted}` but I may add more in the future and the current design of the parsing code requires that each one have its own explicit syntax.