FROM python:3.10-alpine

RUN apk update
RUN apk add git
RUN apk add build-base
RUN apk add tzdata

RUN cp /usr/share/zoneinfo/Europe/Brussels /etc/localtime
RUN echo "Europe/Brussels" >  /etc/timezone

RUN apk del tzdata

RUN mkdir /app
WORKDIR /app
COPY . /app

RUN pip install -U setuptools pip
RUN pip install -r /app/requirements.txt

EXPOSE 8000
CMD [ "uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2" ]
