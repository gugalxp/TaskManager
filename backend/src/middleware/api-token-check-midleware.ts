import { NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { verify, VerifyErrors } from "jsonwebtoken";

export class ApiTokenCheckMiddleware implements NestMiddleware {

    async use(req: Request, res: Response, next: NextFunction) {

        const authToken = req.headers.authorization;

        if (!authToken) {
            return res.status(401).end();
        }

        const [, token] = authToken.split(" ");

        try {
            const { sub } = await this.verifyToken(token);
            req.id = sub;
            next();
        } catch (err) {
            console.error(err);
            return res.status(401).end();
        }
    }

    private verifyToken(token: string): Promise<{ sub: string }> {
        return new Promise((resolve, reject) => {
            verify(token, "24b90f43455e0d6851d0cc9083aaa87b", (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ sub: (decoded as { sub: string }).sub });
                }
            });
        });
    }
}
