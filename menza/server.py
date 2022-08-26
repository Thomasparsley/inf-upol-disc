import os
import pathlib
import datetime
import platform
from typing import Any

from fastapi import FastAPI

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

from svickova.engine import download_menu  # type: ignore
from svickova.enums import Canteen  # type: ignore

if platform.system() == "Windows":
    chromer_driver_path = pathlib.Path(os.getcwd() + "/chromedriver_win32.exe")
else:
    chromer_driver_path = pathlib.Path(os.getcwd() + "/chromedriver")

os.chmod(chromer_driver_path, 0o777)

options = Options()
options.headless = True
service = Service(str(chromer_driver_path))
driver = webdriver.Chrome(  # type: ignore
    service=service,
    options=options,
)

app = FastAPI()

@app.get("/")
async def index():
    today = datetime.date.today()
    menu = download_menu(Canteen.LISTOPAD_17, today, driver)

    meals: list[Any] = []
    for meal in menu:
        if meal.name in ["Obal na jídlo", "Tatarská omáčka (kečup)"]:
            continue

        meals.append(meal.__dict__)

    return {
        "menu": meals,
    }
