import datetime
import pathlib
import os

from fastapi import FastAPI

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

from svickova.engine import download_menu
from svickova.enums import Canteen

app = FastAPI()

chromer_driver_path = os.getcwd() + "/chromedriver"
os.chmod(chromer_driver_path, 0o777)

options = Options()
options.headless = True
service = Service(pathlib.Path(chromer_driver_path))
driver = webdriver.Chrome(service=service, options=options)

@app.get("/")
async def hello_world():
    menu_today = download_menu(
        Canteen.LISTOPAD_17,
        datetime.date.today() + datetime.timedelta(days=5),
        driver,
    )

    menu_today_json = []

    for meal in menu_today:
        menu_today_json.append(meal.to_json())

    return {
        "menu": menu_today_json,
        "items": len(menu_today),
    }
