FROM node:16
WORKDIR /pizza
COPY . /pizza
COPY /backend/.env /pizza/backend
WORKDIR /pizza/backend
RUN npm install
WORKDIR /pizza/client
RUN npm install
RUN npm run build
WORKDIR /pizza
CMD ["npm" , "start"]