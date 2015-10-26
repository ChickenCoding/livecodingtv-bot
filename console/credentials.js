#!usr/bin/node
import {join} from "path";
import {readFile, writeFile, exists, unlinkSync} from "fs";

const
    minimist = require("minimist")
;

let
    credentialsFile,
    credentialsHelp,
    validation,
    format,
    execute,
    args
;

credentialsFile = join(__dirname, "..", "credentials.js");
credentialsHelp = join(__dirname, "..", "console", "credentials.md");

validation = {
    "scheme": {
        "botname": true,
        "username": true,
        "password": true,
    },
    "length": 3
}

format = (botname, username, password) => {
    let template = `
var username =  ${botname};
var password = ${password};
var room = ${username};

module.exports = {
    room: ${username},
    username: ${botname},
    jid: ${botname}@livecoding.tv,
    password: ${password},
    roomJid: ${username}@chat.livcoding.tv
};`
    ;
    return template.trim();

};

execute = (botname, username, password, file=credentialsFile) => {
    exists(file, (exists)  => {
        if (exists) {
            if ("test" !== process.env.NODE_ENV) {
                console.log("file already exists, will be overwrited");
            }
            // TODO [accessibility] Adds a confirmOverwrite function
            // TODO [performance] Adds an updateFile function using stream
            unlinkSync(file);
        }
        writeFile(
            file,
            format(botname, username, password),
            "utf-8"
        );
        if ("test" !== process.env.NODE_ENV) {
            console.info(`${file} credentials.js file created!`);
        }
    });
};

if ("test" !== process.env.NODE_ENV) {
    class Args {
        validate (request) {
            let isValid;
            let data;
            isValid = true;
            for (data in request) {
                isValid = isValid &&
                    null != request[data] &&
                    0 < request[data].length &&
                    true === validation.scheme[data]
                ;
            }
            if (false !== isValid) {
                execute(
                    request.botname,
                    request.username,
                    request.password
                );
                return request;
            }
            if ("test" !== process.env.NODE_ENV) {
                console.error(
                    `Error in arguments, launch "node console/app.js creds help" for help`
                );
                this.help();
                return;
            }
            return {error: `error: ${request}`};
        }
        fetch (request=minimist(process.argv)) {
            return args.validate({
                "botname": request.botname,
                "username": request.username,
                "password": request.password
            });
        }
        help (){
            // @TODO: pipe the content into unix less command
            readFile(credentialsHelp, "utf-8", (err, content) => {
                if (err) {
                    return err;
                }
                console.log(content);
            });
        }
    };
    args = new Args();
    args.fetch();
}

export {credentialsFile, format, execute};
