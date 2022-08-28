# https://docs.docker.com/develop/develop-images/multistage-build/#stop-at-a-specific-build-stage
# https://docs.docker.com/compose/compose-file/#target


# https://docs.docker.com/engine/reference/builder/#understand-how-arg-and-from-interact
ARG NODE_VERSION=16
ARG NGINX_VERSION=1.17


# "development" stage
FROM node:${NODE_VERSION}-alpine AS api_platform_angular_development

EXPOSE 4200

WORKDIR /usr/src/angular

#npm install -g @angular/cli

CMD ["docker/cmd.sh"]

