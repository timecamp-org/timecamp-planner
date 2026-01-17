#!/bin/bash



for file in "$(pwd)/templates"/*;do 
    fileName="${file##*/}"; 
    absPath="$(pwd)/templates/$fileName"; 
    params=" $params $absPath"; 
done; 


node ./dist/console.js templates:load-templates $params;

 