---
title: Convert electrical conductivity to salinity
date: '2015-08-05'
---

*I recently authored my first **R Shiny** app. What follows is a reproduction of the intro tab of the app which can be accessed "live" at: [https://jsta.shinyapps.io/cond2sal_shiny](https://jsta.shinyapps.io/cond2sal_shiny). The [source](https://github.com/jsta/cond2sal_shiny/blob/master/helpers.R) for this app is on github where you can [report issues and post feature requests](https://github.com/jsta/cond2sal_shiny/issues).*

# What is Salinity?

Salinity is a numeric measure of water saltiness. Standard oceanic seawater is about 35. The salinty of natural waters can vary from 0 in freshwater lakes, river, and streams to upwards of 50 in hypersaline brine pools.

# Calculation from Conductivity

Modern salinity measurements are generally calculated from direct measurement of electrical conductivity. These direct conductivity measurements are sometimes supplemented by other measurements such as temperature and pressure when high prescision is desired. High precision salinity measurements are important in many oceanographic applications such as density, mixing, and flow modelling.

This app calculates salinity from conductivity data using the PSS-78 practical salinity equation. In its current form temperature and hydrostatic pressure are assumed to be 25 deg C and 0 dBar respectively.

![condmeaurement](../images/normal_iil_ian_bf_376.JPG)  
Image credit: http://ian.umces.edu/imagelibrary/displayimage-1996.html  
**Figure: Direct measurement of conductivity using a handheld meter**

Use the navigation links at [https://jsta.shinyapps.io/cond2sal_shiny](https://jsta.shinyapps.io/cond2sal_shiny) in order to convert your data.

# References

[IOC, SCOR and IAPSO, 2010: The international thermodynamic equation of seawater – 2010: Calculation and use of thermodynamic properties. Intergovernmental Oceanographic Commission, Manuals and Guides No. 56, UNESCO (English), 196 pp](http://www.teos-10.org/pubs/TEOS-10_Manual.pdf)

[Alan D. Jassby and James E. Cloern (2015). wq: Some tools for exploring water quality monitoring data. R package version 0.4.4. See the wq::ec2pss function.](http://cran.r-project.org/package=wq)
