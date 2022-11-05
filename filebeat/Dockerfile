FROM docker.elastic.co/beats/filebeat:8.4.3

COPY filebeat.yml /usr/share/filebeat/filebeat.yml
USER root

RUN chown -R root /usr/share/filebeat