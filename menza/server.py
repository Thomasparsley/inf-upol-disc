import datetime
import pathlib
import os

from fastapi import FastAPI

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

from svickova.engine import download_menu
from svickova.enums import Canteen

SATURDAY = 5
N_OF_DAYS_IN_WEEK = 7

app = FastAPI()

chromer_driver_path = os.getcwd() + "/chromedriver"
os.chmod(chromer_driver_path, 0o777)

options = Options()
options.headless = True
service = Service(pathlib.Path(chromer_driver_path))
driver = webdriver.Chrome(service=service, options=options)


@app.get("/")
async def index():
    """
    The weekly menu from the Nov. 17 cafeteria will be pulled. If the current day is Saturday or
    Sunday, the following week's menu will be downloaded.
    """
    today = datetime.date.today()
    first_day_of_week: datetime.date = None

    if today.weekday() >= SATURDAY:
        first_day_of_week = today + \
            datetime.timedelta(days=N_OF_DAYS_IN_WEEK - today.weekday())
    else:
        first_day_of_week = today - datetime.timedelta(days=today.weekday())

    last_download_date = first_day_of_week + datetime.timedelta(days=4)
    week_menu = {}
    items = 0

    for delta in range(0, 5):
        day = first_day_of_week + datetime.timedelta(days=delta)

        if str(day) not in week_menu:
            week_menu[str(day)] = []

        try:
            menu = download_menu(Canteen.LISTOPAD_17, day, driver)
            items = items + len(menu)

            for meal in menu:
                week_menu[str(day)].append(meal.to_json())
        except:
            continue

    return {
        "from_day": str(first_day_of_week),
        "to_day": str(last_download_date),
        "items": items,
        "menu": week_menu,
    }
