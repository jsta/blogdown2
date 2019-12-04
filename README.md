This is Joseph Stachelek's personal website based on [**blogdown**](https://github.com/rstudio/blogdown) and the [Hugo](https://gohugo.io) theme [hugo-lithium-theme](https://github.com/yihui/hugo-lithium-theme). 

## Usage

Create a new blog post using:

```
blogdown::new_post("This is a post title", ext = ".Rmd", subdir = "blog")
```

Commit Rmd + html at `content/blog/*` as well as image files at `static/blog/title`

Preview/build post with:

```
blogdown::serve_site()
```

The Hugo template is licensed under MIT, and the content of all pages is licensed under [CC BY-NC-SA 4.0](http://creativecommons.org/licenses/by-nc-sa/4.0/).
