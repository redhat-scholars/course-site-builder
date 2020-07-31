FROM registry.access.redhat.com/ubi8/nodejs-12

USER root

COPY bin/dev.sh /usr/local/bin/dev
COPY bin/site.sh /usr/local/bin/site

RUN  mkdir -p /usr/local/course-site-builder

ADD to-copy/package.json /usr/local/course-site-builder/package.json
ADD to-copy/gulpfile.js /usr/local/course-site-builder/gulpfile.js

RUN cd /usr/local/course-site-builder \
    && npm install

RUN  mkdir -p /usr/src/app/{gh-pages,output,site}

WORKDIR /usr/src/app

RUN \
    chown -R 1001:0 /usr/src/app && \
    chgrp -R 0 /usr/src/app && \
    chmod -R g=u /usr/src/app && \
    chown -R 1001:0 /usr/local/course-site-builder && \
    chgrp -R 0 /usr/local/course-site-builder && \
    chmod -R g=u /usr/local/course-site-builder

EXPOSE  3000

USER 1001

ENV NODE_PATH=/usr/local/course-site-builder