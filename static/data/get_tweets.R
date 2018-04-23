library(rtweet)


jjstache_likes <- get_favorites("__jsta", n = 3000)

read_latest <- function(){
  archives <- list.files("static/data", pattern = "*likes.rds", 
                         full.names = TRUE, include.dirs = TRUE)
  dates <- sapply(archives, 
               function(x) strsplit(x, "_")[[1]][1])
  dates <- as.Date(
    sapply(dates, function(x) substring(x, nchar(x)-9, nchar(x))))
    
  dt <- readRDS(archives[which.max(dates)])
  dt <- data.frame(dt)
}

dt <- read_latest()
dt2 <- jjstache_likes[1: 
                        which(jjstache_likes$status_id == dt[1, "status_id"]),]
dt2 <- dplyr::select(dt2, -media_url, -mentions_screen_name, 
                     -mentions_user_id, 
                     -hashtags)

res <- dplyr::bind_rows(dt2, dt)


outfile <- file.path("static/data", paste0(Sys.Date(), "_jjstache_likes.rds"))
saveRDS(res, outfile)