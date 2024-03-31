import { PrismaClient } from '@prisma/client';
const client = new PrismaClient();

async function tryLogin(email: string, password: string) {
    try {
        const admin = await client.admin.findUnique({
            where: {
                email: email, 
                password: password,

            }
        });


        if (admin) {
            return "success"; 
        } else {
            return "error"; 
        }
    } catch (error) {
        console.error("Erro ao tentar fazer login:", error);
        throw error; 
    }
}

export default {
    tryLogin
}
