import jwt from 'jsonwebtoken';
export function ensureAuthenticated(request, response, next) {
    const { verify } = jwt;
    // Receber o token
    const authToken = request.headers.authorization;
    // Validar se token está preenchido
    if (!authToken) {
        return response.status(401).end();
    }
    const [, token] = authToken.split(' ');
    try {
        // Validar se token é válido
        const { sub } = verify(token, process.env.JWT_SECRET);
        // Recuperar informações do usuário
        request.userId = sub;
        return next();
    }
    catch (err) {
        return response.status(401).end();
    }
}
//# sourceMappingURL=ensureIsAuthenticated.js.map