This is Joseph Stachelek's personal website based on [**blogdown**](https://github.com/rstudio/blogdown) and the [Hugo](https://gohugo.io) theme [hugo-lithium-theme](https://github.com/yihui/hugo-lithium-theme). Main features:

The Hugo template is licensed under MIT, and the content of all pages is licensed under [CC BY-NC-SA 4.0](http://creativecommons.org/licenses/by-nc-sa/4.0/).

You can clone this repository with 

```
git clone --recursive https://github.com/jsta/jsta.rbind.io.git
```

## Usage

Create a new blog post using:

```
blogdown::new_post("This is a post title", ext = ".Rmd", subdir = "blog")
```

Preview/build post with:

```
blogdown::serve_site()
```
