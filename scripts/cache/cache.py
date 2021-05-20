import sys
import subprocess

siteList = open("site_list")
# pass proxy url as parameter
if len(sys.argv) == 1:
    print("Please pass the proxy url")
else:
    proxy = sys.argv[1]
    print(proxy)
    for site in siteList:
        init_url_file = open("../../proxies/cache_proxy_initiating_url", "w")
        init_url_file.write(site)
        init_url_file.close()
        subprocess.run(["java","-jar", "cache_bot.jar", site, proxy, "close"])
    print("Completed cache")
