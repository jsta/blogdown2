# ---- setup ----
library(rtweet)

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

# ---- get tweets ----
jjstache_likes <- get_favorites("__jsta", n = 3000)
jjstache_likes <- jjstache_likes[
  order(jjstache_likes$created_at, decreasing = TRUE),]

dt <- read_latest()
dt2 <- jjstache_likes[1: 
                        which(jjstache_likes$status_id == dt[1, "status_id"]),]
dt2 <- dplyr::select(dt2, -media_url, -mentions_screen_name, 
                     -mentions_user_id, 
                     -hashtags)

res <- dplyr::bind_rows(dt2, dt)


outfile <- file.path("static/data", paste0(Sys.Date(), "_jjstache_likes.rds"))
saveRDS(res, outfile)

# ---- curate following ----
followers <- get_followers("__jsta")

followees <- get_friends("__jsta")
favs <- read_latest() %>% 
  dplyr::select(user_id, created_at, screen_name, text, urls_expanded_url)
bad_followees <- dplyr::filter(followees, !(user_id %in% favs$user_id))
bad_followees <- lookup_users(bad_followees$user_id)
bad_followees <- dplyr::select_if(bad_followees, purrr::negate(is.list))
bad_followees <- dplyr::filter(bad_followees, !(user_id %in% followers$user_id))
bad_followees <- dplyr::mutate(dplyr::group_by(bad_followees, screen_name), 
                               user_interactions = sum(followers_count, friends_count))

# View(bad_followees)
res <- dplyr::filter(bad_followees, (statuses_count < 3 & 
                                       created_at < "2016-01-01") | 
                    (user_interactions < 40 & 
                       account_created_at < "2016-01-01" &
                       created_at < "2017-01-01") | 
                      is.na(created_at) | 
                      created_at < "2017-01-01" |
                      (is.na(url) & 
                         is.na(profile_banner_url) & 
                         is.na(profile_background_url) &
                         created_at < "2018-01-01"))
# View(res)
sapply(res$user_id, function(x) rtweet::post_unfollow_user(x))
