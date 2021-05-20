from selenium import webdriver
# from webdriver_manager.chrome import ChromeDriverManager
import sys
from selenium.webdriver.common.action_chains import ActionChains

mobile_emulation = { "deviceName": "iPhone X" }
chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument('ignore-certificate-errors')
chrome_options.add_argument('--proxy-server=comnetsad.dyndns.org:9100')
chrome_options.add_argument('--headless')
chrome_options.add_experimental_option("mobileEmulation", mobile_emulation)
chrome_options.add_argument("--disable-notifications")
chrome_options.add_argument("--disable-popup-window")

driver = webdriver.Chrome(options=chrome_options)
driver.execute_cdp_cmd('Network.setCacheDisabled', {'cacheDisabled': True})
driver.set_window_size(1125, 2436)
driver.get("http://comnetsad.dyndns.org:9100/?{0}".format(sys.argv[1]))
driver.close()