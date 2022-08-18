import datetime
import pathlib
import os
from typing import Any

from fastapi import FastAPI

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

from svickova.engine import download_menu # type: ignore
from svickova.enums import Canteen # type: ignore
from svickova.meal import Meal # type: ignore

app = FastAPI()

import platform

if platform.system() == "Windows":
    chromer_driver_path = os.getcwd() + "/chromedriver_win32.exe"
else:
    chromer_driver_path = os.getcwd() + "/chromedriver"

os.chmod(chromer_driver_path, 0o777)

options = Options()
options.headless = True
service = Service(pathlib.Path(chromer_driver_path)) # type: ignore
driver = webdriver.Chrome(service=service, options=options)


@app.get("/")
async def index():
    """
    The weekly menu from the Nov. 17 cafeteria will be pulled. If the current day is Saturday or
    Sunday, the following week's menu will be downloaded.

    """
    today = datetime.date.today()
    menu: list[Meal] = download_menu(Canteen.LISTOPAD_17, today, driver)

    meals: list[Any] = []
    for meal in menu:
        
        if meal.name in ["Obal na jídlo", "Tatarská omáčka (kečup)"]:
            continue

        count = meal.count
        if count == float("inf") or count == float("-inf"):
            count = 0

        price = meal.price
        if price == float("inf") or price == float("-inf"):
            price = 0

        meals.append({
            "name": meal.name,
            "category": meal.category,
            "count": count,
            "price": price,
        })

    return {
        "menu": meals,
    }
