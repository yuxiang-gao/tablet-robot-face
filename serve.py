import os
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from time import sleep

from selenium import webdriver
from selenium.webdriver.firefox.firefox_binary import FirefoxBinary

os.environ["DISPLAY"] = ":0"
PORT = 8000

Handler = SimpleHTTPRequestHandler

file_path = Path(__file__).resolve(strict=True).parent
cmds = [
    f"devilspie2 --folder={file_path} --debug",
    f"DISPLAY=:0 && x-www-browser http://0.0.0.0:{PORT}",
]


handler = partial(SimpleHTTPRequestHandler, directory=str(file_path))
server = ThreadingHTTPServer(("", PORT), handler)

server_thread = threading.Thread(target=server.serve_forever)
server_thread.daemon = True
server_thread.start()
driver = webdriver.Firefox()

driver.get(f"http://0.0.0.0:{PORT}")
driver.fullscreen_window()
driver.execute_script(
    "var scrollingElement = (document.scrollingElement || document.body);scrollingElement.scrollTop = scrollingElement.scrollHeight;"
)
while True:
    sleep(1)
driver.quit()
