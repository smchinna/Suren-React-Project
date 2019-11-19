##############################################################################################################
# Docker Multi Staging 
# Build Stage
##############################################################################################################
FROM node:8.12.0-alpine as builder

# Set environmental variable for Application Root
RUN mkdir -p /adapt && chmod -R 777 /adapt
RUN mkdir -p /usr/src/app/adapt && chmod -R 777 /usr/src/app/adapt

ENV APP_PATH /usr/src/app/adapt

# Download dependencies
COPY package.json $APP_PATH/package.json
WORKDIR $APP_PATH

RUN npm config set unsafe-perm true
RUN npm config set -g production false && \
npm config set strict-ssl false && npm config set registry http://registry.npmjs.org && \
  npm install  

# Copy Source Files
COPY ./ $APP_PATH

# Test and Build the code
WORKDIR $APP_PATH

# Build the code
RUN npm run build

##############################################################################################################
# Deployment to Nginx
##############################################################################################################
FROM nginx:1.15.2-alpine

# Set environmental variable for Application Root
ENV APP_PATH /usr/src/app/adapt

# Copy configurations
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy output of previous stage
COPY --from=builder $APP_PATH/build /usr/share/nginx/html

# Default port exposure
EXPOSE 80

# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html


# Add bash
RUN apk add --no-cache bash

# Start Nginx server

CMD ["/bin/bash","-c", "/usr/share/nginx/html/setEnv.sh && nginx -g \"daemon off;\""]
# CMD [ "/bin/bash", "-c", "/opt/bin/nginx.sh" ]

