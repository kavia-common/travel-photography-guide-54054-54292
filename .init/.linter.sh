#!/bin/bash
cd /home/kavia/workspace/code-generation/travel-photography-guide-54054-54292/WebFrontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

