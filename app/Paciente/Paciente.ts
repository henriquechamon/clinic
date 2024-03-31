import { PrismaClient } from '@prisma/client';
const client = new PrismaClient();

async function searchPaciente(id: number) {
    try {
        const paciente = await client.pacientes.findUnique({
            where: {
                id: id

            }
        });


        if (paciente) {
            return paciente; 
        } else {
            return "error"; 
        }
    } catch (error) {
        console.error("Erro ao procurar paciente", error);
        throw error; 
    }
}

export default {
    searchPaciente
}
