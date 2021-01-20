FROM node:12.18.2

WORKDIR /usr/src/app/

RUN ["chmod", "+x", "/usr/src/app/"]

COPY /package*.json . 

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["node ","server.js"]   