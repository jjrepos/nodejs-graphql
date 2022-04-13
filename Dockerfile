FROM node:16-slim

ENV API_HOME=/usr/local/facilities-api
ENV TZ=America/New_York

ARG API_USER=facilities-api
ARG UID=777
ARG GROUP=facilities-api
ARG GID=777

WORKDIR ${API_HOME}

RUN chown ${UID}:${GID} $API_HOME \
    && groupadd -g ${GID} ${GROUP} \
    && useradd -d "$API_HOME" -u ${UID} -g ${GROUP} -m -s /bin/bash  ${API_USER}

COPY ["package.json", "package-lock.json", "${API_HOME}/"]
COPY "node_modules" "${API_HOME}/node_modules/"
COPY "dist" "${API_HOME}/dist/"

RUN chown -R ${API_USER} "${API_HOME}" \
    && npm set unsafe-perm true \
    && npm prune --production

USER ${API_USER}

CMD ["npm", "start"]