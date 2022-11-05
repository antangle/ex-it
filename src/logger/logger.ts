import { consts } from "src/consts/consts";
import winston from "winston";

export const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
    data: 7,
};

export const passData = winston.format((info, opts) => {
    if (info.level != consts.DATA) { return false; }
    return info;
});