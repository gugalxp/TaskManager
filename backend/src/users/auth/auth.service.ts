import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { sign, verify } from "jsonwebtoken";
import { compare } from "bcryptjs";
import prismaClient from 'src/prisma';

@Injectable()
export class AuthService {
    async execute({ email, password }: CreateAuthDto) {
        try {
            const user = await prismaClient.user.findFirst({
                where: {
                    email: email
                },
            });

            if (!user) {
                throw new Error("Email/senha incorreto");
            }

            const passwordMatch = await compare(password, user?.password);

            if (!passwordMatch) {
                throw new Error("Email/senha incorreto");
            }

            const token = sign(
                {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
                process.env.JWT_SECRET,
                {
                    subject: user.id,
                    expiresIn: '30d'
                }
            );

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                token: token,
                created_at: user?.created_at,
                updated_at: user?.updated_at,
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
