---
title: "Using the Geopackage Format with R"
date: '2016-07-14'
---

Many (most?) people involved in vector geospatial data analysis work exlusively with shapefiles. However, the [shapefile format](https://en.wikipedia.org/wiki/Shapefile) has a number of drawbacks including the fact that spatial attributes, metadata, and projection information are stored in seperate files. For instance, it can take as much as [45 lines of code](https://github.com/jhollist/miscPackage/blob/master/R/download_shp.R) to ensure a complete "shapefile" download.

In a post to the [R-Sig-Geo listserv](https://stat.ethz.ch/pipermail/r-sig-geo/) (excerpted below) Barry Rowlingson mentions the [GeoPackage format](https://en.wikipedia.org/wiki/GeoPackage) which is an interesting alternative to shapefiles. 


```
Barry Rowlingson b.rowlingson at lancaster.ac.uk
Wed Jul 13 19:44:28 CEST 2016

[...] the agency from which I got the data has been enlightened
enough not to use the clunky, outdated, and limited "shapefile" format
and has released the data as a modern, OGC-standard GeoPackage. My
variables have long names, my metadata is stored with my data, and its
all in one file instead of six. [...]

 Shapefiles are an awful, awful format which Esri didn't think people
would actually use. They should not be encouraged. [...] 

Barry
```

The interested but time-limited geospatial analyst might wonder; Can I easily switch from a shapefile workflow to a GeoPackage workflow? Will my colleagues be able to open and interact with GeoPackage files? Fortunately, the answer is yes because the `rgdal` `R` package [supports reading and writing of vector geospatial data to GeoPackage files](https://gist.github.com/mdsumner/cc9b29692c450fd182cfbf46b85c5365). 

First, lets load some geospatial data into a `SpatialPointsDataFrame` object.

```r
library(rgdal)
cities <- readOGR(system.file("vectors", package = "rgdal")[1], "cities")
class(cities)
```

```
> [1] "SpatialPointsDataFrame"    
> attr(,"package")    
> [1] "sp"
```

Now lets write the data to disk using the GeoPackage format:

```r
# outname <- file.path(tempdir(), "cities.gpkg")
outname <- "cities.gpkg"
writeOGR(cities, dsn = outname, layer = "cities", driver = "GPKG")
```

This file can then be read back into R:

```r
cities_gpkg <- readOGR("cities.gpkg", "cities")
identical(cities, cities_gpkg)
```
```
> [1] TRUE
```

The file can also be opened in your standalone GIS program of choice such as GRASS, QGIS, or even ArcGIS.

Sometimes you may want to directly access the metadata for your spatial data without loading the object geometry. Because GeoPackage files are formatted as SQLite databases you can use the existing `R` tools for SQLite files. One option is to use the slick `dplyr` interface:

```r
library(dplyr)
cities_sqlite <- tbl(src_sqlite("cities.gpkg"), "cities")
print(cities_sqlite, n = 5)
```

```
> Source: sqlite 3.8.6 [cities.gpkg]
> From: cities [606 x 6]

>    fid      geom             NAME COUNTRY POPULATION CAPITAL
>   (int)     (chr)            (chr)   (chr)      (dbl)   (chr)
> 1      1 <raw[29]>         Murmansk  Russia     468000       N
> 2      2 <raw[29]>      Arkhangelsk  Russia     416000       N
> 3      3 <raw[29]> Saint Petersburg  Russia    5825000       N
> 4      4 <raw[29]>          Magadan  Russia     152000       N
> 5      5 <raw[29]>            Perm'  Russia    1160000       N
> ..   ...       ...              ...     ...        ...     ...
```

Another option is to use the more primitive `RSQLite` interface:

```r
library(RSQLite)
con <- dbConnect(RSQLite::SQLite(), dbname = "cities.gpkg")
dbListTables(con)

cities_rsqlite <- dbGetQuery(con, 'select * from cities')
head(cities_rsqlite[, -which(names(cities_rsqlite) == "geom")])
dbGetQuery(con, 'select * from gpkg_spatial_ref_sys')[3,"description"]
```

```
> fid             NAME COUNTRY POPULATION CAPITAL
> 1   1         Murmansk  Russia     468000       N
> 2   2      Arkhangelsk  Russia     416000       N
> 3   3 Saint Petersburg  Russia    5825000       N
> 4   4          Magadan  Russia     152000       N
> 5   5            Perm'  Russia    1160000       N
> 6   6    Yekaterinburg  Russia    1620000       N

> [1] "longitude/latitude coordinates in decimal degrees on the WGS 84 spheroid"
```
