---
title: GIS "in the cloud" with R
date: '2015-07-06'
---
After running across [this tutorial](http://deanattali.com/2015/05/09/setup-rstudio-shiny-server-digital-ocean/) by [Dean Attali](https://twitter.com/daattali), I attempted to setup my own R GIS platform "in the cloud". Dean's tutorial was excellent for the most part. I was able to spin up my own server with RStudio installed. The two difficulties that I ran into dealt with [gdal](www.gdal.org) and choosing a server size. 

It was very difficult to track down the Ubuntu system-level dependencies for [rgdal](http://cran.r-project.org/package=rgdal). The solution ultimately was to install the `gdal-bin` and `libgdal-dev` packages using `apt-get`. 

I had to go through a drawn-out trial and error process to find the correct amount of RAM required for my processing. Luckily, it was not too difficult because Digital Ocean offers flexible server resizing. This enabled me to expand the RAM basically "on the fly". You pay more for larger servers and flexible resizing is nice because you can drop it down to a smaller (cheaper) server when not running intensive computations.

Once your system level dependencies are set, you can use `rsync` to transfer datasets and R packages. A command like the following can be used to transfer the contents of your `Data` folder to your remote server.

        rsync -av /home/<user_name>/Data/ <user_name>@<ip_address>:~/Data

I encourage people to try this solution if you find yourself running long computations on your local machine. If you sign up at Digital Ocean using my [referer link](https://www.digitalocean.com/?refcode=cf7a61ffdec0), you will recieve $10 in starter money. This is esentially a free trial!

**Update**

I learned several more details that really made my workflow possible:

1. Using the `Rscript` program rather than direct use of RStudio was neccessary in order to prevent memory issues.
  * Combining `Rscript` with [Makefiles](https://swcarpentry.github.io/make-novice/) allowed for processing comparmentalization.
  * Adding a `-` character before a Makefile command will enable the Makefile to proceed even if errors occur.

[2.](https://serverfault.com/questions/311593/keeping-a-linux-process-running-after-i-logout) The `screen` program will allow you to log out of your server while keeping your processing running.




