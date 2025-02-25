"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userInBlacklist = userInBlacklist;
const prismaClient_1 = require("../database/prismaClient");
async function userInBlacklist(request, response, next) {
    const { userId, ip } = request;
    try {
        const buscaUsuario = await prismaClient_1.prismaClient.user.findFirst({
            where: {
                id: userId,
            },
        });
        console.log(ip);
        const blacklistCheck = await prismaClient_1.prismaClient.blacklist.count({
            where: {
                OR: [
                    {
                        ip,
                    },
                    {
                        userId,
                    },
                    {
                        email: buscaUsuario?.email,
                    },
                    {
                        empresa: buscaUsuario?.empresa,
                    },
                ],
            },
        });
        console.log(blacklistCheck);
        if (blacklistCheck > 0) {
            return response.status(401).end();
        }
        else {
            return next();
        }
    }
    catch (err) {
        return response.status(401).end();
    }
}
//# sourceMappingURL=userInBlacklist.js.map