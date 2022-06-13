FROM node
WORKDIR /app
COPY . /var/www
WORKDIR /var/www
RUN npm install
EXPOSE 8080
CMD ["npm", "start"]
