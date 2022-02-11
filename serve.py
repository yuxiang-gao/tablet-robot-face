#! /usr/bin/env python3
import os
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from time import sleep

from selenium import webdriver

os.environ["DISPLAY"] = ":0"
PORT = 8000

Handler = SimpleHTTPRequestHandler

file_path = Path(__file__).resolve(strict=True).parent
# cmds = [
#     f"devilspie2 --folder={file_path} --debug",
#     f"DISPLAY=:0 && x-www-browser http://0.0.0.0:{PORT}",
# ]

# start htt server
handler = partial(SimpleHTTPRequestHandler, directory=str(file_path))
server = ThreadingHTTPServer(("", PORT), handler)
server_thread = threading.Thread(target=server.serve_forever, daemon=True)
server_thread.start()

# start browser
driver = webdriver.Firefox()

sleep(5)
driver.fullscreen_window()
sleep(1)
driver.get(f"http://0.0.0.0:{PORT}")
sleep(1)
driver.execute_script(
    "var scrollingElement = (document.scrollingElement || document.body);scrollingElement.scrollTop = scrollingElement.scrollHeight;"
)
driver.fullscreen_window()
server_thread.join()
driver.quit()
