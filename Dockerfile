FROM node

COPY . /backend

WORKDIR /backend

run npm install

EXPOSE 5000:5000

CMD ["node", "index.js"]