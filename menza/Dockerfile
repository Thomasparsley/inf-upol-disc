FROM python:3.10-alpine

RUN apk update

RUN mkdir /app
WORKDIR /app
COPY . /app

RUN pip install -r /app/requirements.txt

EXPOSE 8000
CMD [ "uvicor", "/app/server:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2" ]
