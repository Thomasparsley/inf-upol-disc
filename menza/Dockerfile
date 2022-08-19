FROM python:3.10-alpine

RUN apk update
RUN apk add build-base

RUN mkdir /app
WORKDIR /app
COPY . /app

RUN pip install -U setuptools pip
RUN pip install -r /app/requirements.txt
RUN pip install git+https://github.com/mikulatomas/svickova/

EXPOSE 8000
CMD [ "uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2" ]
