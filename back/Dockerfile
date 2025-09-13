
FROM python:3.13.7-slim


WORKDIR /back


COPY ./requirements.txt /back/requirements.txt


RUN pip install --no-cache-dir --upgrade -r /back/requirements.txt


COPY . /back/


CMD ["fastapi", "run", "./main.py", "--port", "80"]