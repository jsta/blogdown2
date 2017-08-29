---
title: Compose true color Landsat 7 images using R
date: '2015-09-18'
---

If you are familiar with Landsat 7 (1999 - 2013), you know that there was [failure](http://landsat.usgs.gov/products_slcoffbackground.php) with the Scan Line Corrector instrument early in the mission deployment. The end result is that a sizable portion (~22 %) of each "scene" has been lost. People interested in creating true color images without these missing data gaps might find themselves at the USGS page describing how to [fill gaps for display](http://landsat.usgs.gov/filling_the_gaps_for_display.php).

![landsat](/public/images/landsat_miss.png)  

However, after reading the page you might think that the only solutions for gap-filling involve using very expensive proprietary software (ERDAS, Photoshop) or paying for corrected imagery from a _Landsat business partner_. Not having access to these software programs, I unsuccessfully attempted to use the _Dust-and-Scratches_ solution albeit with open-source imaging programs. After quite a bit of struggling I discoved an easy alternative which I will now share. 

First we need to acquire some Landsat data. I found [this](http://earthobservatory.nasa.gov/blogs/elegantfigures/2013/05/31/a-quick-guide-to-earth-explorer-for-landsat-8/) guide by Robert Simmon to be an excellent introduction to the topic. (On a side-note, the [`landsat-util`](http://landsat-util.readthedocs.org/en/latest/index.html) program looks excellent. It is too bad it only provides access to Landsat 8 data.) 

In this case we have downloaded our compressed achive to the `/home` folder. Landsat 7 data archives have the following file/folder structure and for the purposes of creating true color images we are only concerned with bands 1-3. One important thing to note is the presence of a **gap_mask** folder. The tif files within the **gap_mask** archives contain the missing data from the top level band files.

        LE70150432010.tar.gz
        │   LE70150432010_B1.TIF
        │   LE70150432010_B2.TIF
        │   LE70150432010_B3.TIF
        │
        └───gap_mask
            ├───LE70150432010_GM_B1.TIF.gz
            │   │   LE70150432010_GM_B1.TIF
            ├───LE70150432010_GM_B2.TIF.gz
            │   │   LE70150432010_GM_B2.TIF
            ├───LE70150432010_GM_B3.TIF.gz
            │   │   LE70150432010_GM_B3.TIF
    


The following `R` code chunk loops through each band/mask combination and uses the `gdal_fillnodata.py` script (ships with `gdal` by default) to replace missing data in each band with the corresponding data in the mask file. Next, the resulting rasters are cropped according to a custom defined extent. Finally, the bands are combined and plotted using the `plotRGB` function.

Before running this workflow on your own landsat 7 data ensure that you have `gdal` installed and available to the `base::system` command. You can check this by running `gdal-config --version` from the command line. Also make sure that you have the `rgdal` and `raster` packages installed.

        untar(paste0("~/LE70260412007180EDC00.tar.gz"), exdir = "landsat")
        
        tifs <- list.files("landsat", pattern = "*.TIF$",
          include.dirs = TRUE, full.names = TRUE)[1:3]
        ctifs<-paste0(unlist(strsplit(tifs,".TIF")), "_f", ".TIF")
        masks <- list.files("landsat/gap_mask", include.dirs = TRUE, full.names = TRUE)[1:3]
        
        library(raster)
        library(rgdal)
                
        for(i in 1:length(tifs)){
          system(paste("gdal_fillnodata.py -mask", paste0("/vsigzip/", masks[i]), "-of GTiff", tifs[i], ctifs[i]))
          }
                
        rstack <- raster::stack(ctifs)
                
        #raster::drawExtent()
        extent <- raster::extent(625508, 673853, 3072252, 3096110)
        rstack <- raster::crop(rstack, extent)
                  
        raster::plotRGB(rstack,r=3,g=2,b=1)
        rect(extent[1], extent[3], extent[2], extent[4], lwd = 1.5)
        
        #file.remove(list.files("landsat", include.dirs = TRUE, full.names = TRUE,
          recursive = TRUE))

![landsat](/public/images/landsat.png)  