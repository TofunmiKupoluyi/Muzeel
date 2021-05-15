# Muzeel

## First start the cache and read proxy:

In "proxies" folder, run:

```mitmdump -s cache_proxy.py --listen-port 9100 --set dbHost=host --set dbPort=port  --set dbName=name --set dbUser=user --set dbPassword=password --set cacheDirectory=directory```

```mitmdump -s read_proxy.py --listen-port 9101 --set dbHost=host --set dbPort=port  --set dbName=name --set dbUser=user --set dbPassword=password --set cacheDirectory=directory```

The cache directory option is where the proxy will cache the page, it defaults to the "data/" directory of current folder but you can set to any folder. Be sure to end the cache directory with "/".

## Next, cache the page you want to run dce on

In "scripts/cache" folder, put the sites you want to cache in the site_list file (newline separated) and then run:

```python3 cache.py __port_of_cache_proxy```

In above example, the port of cache proxy is set to 9100

## Next, run dce

In "scripts/eliminate" folder, put the sites you want to cache in the site_list file (newline separated) and then run:

```python3 eliminate.py dbName dbHost dbUser dbPassword dbPort cacheDirectory __port_of_read_proxy```

In the above example __port_of_read_proxy is set to 9101. Be sure to end the cache directory in "/" and start with "/" if you're using absolute path.