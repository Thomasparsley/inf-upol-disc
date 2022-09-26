import dateutil.tz
from datetime import datetime

from fastapi import FastAPI

from svickova.meal import Meal
from svickova.enums import Canteen
from svickova.engine import download_menu


app = FastAPI()


@app.get("/")
async def index():
    today = datetime.now(dateutil.tz.gettz("Prague"))
    menu = download_menu(Canteen.LISTOPAD_17, today)

    meals: list["Meal"] = []
    for meal in menu:
        if meal.name in ["Obal na jídlo", "Tatarská omáčka (kečup)"]:
            continue

        meals.append(meal.__dict__)

    return {
        "menu": meals,
    }
