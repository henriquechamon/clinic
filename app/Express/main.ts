import express, { Request, Response } from 'express';
import path from 'path';
import AdminLogin from '../Admin/Login'; 
import Pacientes from '../Paciente/Paciente';
const app = express();
const PORT = 2308;
const rootDir = path.resolve(__dirname, '../..');

async function setExpress() {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.post('/checklogin', async (req: Request, res: Response) => {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const response = await AdminLogin.tryLogin(email, password);
            if (response === "success") {
                res.cookie('admin', email, { maxAge: 900000, httpOnly: true });
                res.redirect('/Dashboard'); 
            } else {
                res.send("Sua conta de admin não foi encontrada. Acesso ao painel negado.")
            }
            console.log(`Houve uma tentativa de login, obteve: ${response}`)
        } catch (error) {
            console.error("error found", error);
            res.status(500).send("Internal Server Error");
        }
    });
    app.post('/resultPaciente', async (req: Request, res: Response) => {
        try {
            const idPaciente = parseInt(req.body.id);
         const response = await Pacientes.searchPaciente(idPaciente);
         if (response === "error") {
            const errorMessage = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Paciente não encontrado</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f8f9fa;
                            text-align: center;
                            padding-top: 50px;
                        }
                        .container {
                            max-width: 400px;
                            margin: 0 auto;
                            background-color: #fff;
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        h1 {
                            color: #333;
                        }
                        .message {
                            margin-bottom: 20px;
                        }
                        .back-button {
                            background-color: #007bff;
                            color: #fff;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 5px;
                            cursor: pointer;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Paciente não encontrado</h1>
                        <p class="message">O paciente que você está procurando não foi encontrado.</p>
                        <button class="back-button" onclick="window.history.back()">Voltar</button>
                    </div>
                </body>
                </html>
            `;
            res.send(errorMessage);
        } else {
            const successMessage = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${response.name} - ClinicApp</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f8f9fa;
                            text-align: center;
                            padding-top: 50px;
                        }
                        .container {
                            max-width: 400px;
                            margin: 0 auto;
                            background-color: #fff;
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        h1 {
                            color: #333;
                        }
                        .message {
                            margin-bottom: 20px;
                        }
                        .back-button {
                            background-color: #007bff;
                            color: #fff;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 5px;
                            cursor: pointer;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>${response.name}</h1>
                        <p class="message">Idade: ${response.age}</p>
                        <p class="message">Estado de saúde: ${response.health}</p>
                        <p class="message">Deficiências: ${response.problems} </p>
                        <button class="back-button" onclick="window.history.back()">Voltar</button>
                    </div>
                </body>
                </html>
            `;
            res.send(successMessage);
        }
        
        } catch (error) {

        }
    })
    app.get('/Login', (req: Request, res: Response) => {
        res.sendFile(path.join(rootDir, 'public', 'Login', 'Login.html'));
    });
    app.get('/Dashboard', (req: Request, res: Response) => {
        res.sendFile(path.join(rootDir, 'public', 'Dashboard', 'Dashboard.html'));
    });
    app.get('/SearchPaciente', (req: Request, res: Response) => {
        res.sendFile(path.join(rootDir, 'public', 'SearchPaciente', 'SearchPaciente.html'));
    });

    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}

export default {
    setExpress
}
