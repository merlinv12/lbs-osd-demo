FROM ubuntu:22.04

RUN apt-get update && apt-get install -y

RUN apt-get install -y \
	openslide-tools \
	libvips-dev

# This is needed for the nodejs installation
RUN apt-get -y install ca-certificates curl gnupg
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt-get update && apt-get install -y \
	nodejs \
	build-essential
RUN npm install npm --global

WORKDIR /app

COPY . /app

# install dependencies
RUN npm install
RUN npm run build

# Expose port 8000 
EXPOSE 8000


# Run the app
CMD ["npm", "start"]
