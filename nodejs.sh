#!/bin/bash

NODE=node
SERVER_JS_FILE=server.js
USER=root
OUT=/root/PROJETS/playground-mouth/logs/node_out.log
ERR=/root/PROJETS/playground-mouth/logs/node_error.log

case "$1" in

start)
    echo "starting node: $NODE $SERVER_JS_FILE"
	sudo -u $USER forever -o $OUT -e $ERR start $SERVER_JS_FILE
    ;;

stop)
    sudo -u $USER forever stop $SERVER_JS_FILE
    ;;

*)
    echo "usage: $0 (start|stop)"
esac

exit 0
