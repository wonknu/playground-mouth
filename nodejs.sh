#!/bin/bash

NODE=node
SERVER_JS_FILE=server.js
USER=root
OUT=/root/PROJETS/mouthnode/leaderboard/www/nodejs.log

case "$1" in

start)
    echo "starting node: $NODE $SERVER_JS_FILE"
    sudo -u $USER $NODE $SERVER_JS_FILE > $OUT 2>$OUT &
    ;;

stop)
    killall $NODE
    ;;

*)
    echo "usage: $0 (start|stop)"
esac

exit 0