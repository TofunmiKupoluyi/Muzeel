import subprocess
import timeit
import sys

track_file = open("eliminated_logs_retry/eliminated_sites.txt", "a")

# Determine offset
offset_start_file = open("eliminated_logs_retry/eliminated_sites.txt", "r")
offset_start = len(offset_start_file.read().split("\n"))-1
offset_start_file.close()

site_list = open("site_list", "r").read().split("\n")
no_of_sites = len(site_list)-offset_start
for in_i, i in enumerate(site_list[offset_start:]):
    url = i
    init_url_file = open("/../../proxies/read_proxy_initiating_url", "w")
    init_url_file.write(url)
    init_url_file.close()
    print("Running DCE for ", in_i+1, "of", no_of_sites, ":", url)
    start = timeit.default_timer()
    subprocess.run("node lacuna.js {} --dbName=\"{}\" --dbHost=\"{}\" --dbUser=\"{}\" --dbPassword=\"{}\" --dbPort=\"{}\" --cacheDirectory=\"{}\" --proxy=\"127.0.0.1:{}\"".format(*sys.argv[1:]).split(" "))
    stop = timeit.default_timer()
    track_file.write(url+", "+str(stop-start)+"\n")
    track_file.flush()
track_file.close()