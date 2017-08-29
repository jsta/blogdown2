---
title: "Practical Docker"
date: '2016-02-12'
---

Docker is a tool that has been getting a lot of attention in the reproducible research comminity. Basically, it is used to create a computer within a computer. These creations aree built with a `Dockerfile` that specifies an image name and a sequence of commands for installing software, downloading files, and running scripts. Ultimately, Docker aims to solve the problem of fully reproducing a specific computing environment.

The [getting started guide](https://docs.docker.com/linux/) on the Docker landing page is good for familiarlizing yourself as a new user. Also, I recommend [this paper](http://arxiv.org/pdf/1410.0846) by Carl Boettig for learning how to get started with Docker. However as I was preparing my first _real_ Docker image, I found these resources to be lacking an explanation of:

 * How to access files interal to an image
 
 ** How to interact with external files within an image**
 
In order to demontrate how to perform these operations lets begin by creating the dummy Docker image in the [getting started guide](https://docs.docker.com/linux/). Our Dockerfile should read as follows:

> FROM docker/whalesay:latest 
> RUN apt-get -y update && apt-get install -y fortunes 
> CMD /usr/games/fortune -a | cowsay 

Lets add a line that downloads a file to our image:

> RUN wget https://docs.docker.com/dist/assets/images/logo.png logo.png


# Additional Resources

[ReScience paper](https://github.com/ReScience-Archives/Stachelek-2016/raw/master/article/article.pdf)
Link to:



  [achubaty docker images](https://hub.docker.com/u/achubaty/)
  discuss docker cp etc
