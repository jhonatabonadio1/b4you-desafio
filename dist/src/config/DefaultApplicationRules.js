"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultApplicationRules = void 0;
/* eslint-disable no-irregular-whitespace */
exports.defaultApplicationRules = {
    storage: {
        limit: 50 * 1024, // 50 MB
    },
    documents: {
        uploadFiles: 5,
        maxSize: 10 * 1024, // 10 MB
    },
    sessions: {
        maxSessionsPerFile: 50,
    },
};
