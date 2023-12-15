import prisma from "../../../lib/prisma";
import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
type Error = {
  error : {
    code: string,
    message: string
  }
}

type Data = {
  codigo: string,
  tipo: string,
  nome: string
}

export default async function handle(req: NextApiRequest,res: NextApiResponse<Error | Data>) {
    const {codigo, nome, tipo} = req.body;

    try {
        const result = await prisma.proponente.create({
            data: {
                codigo: codigo,
                tipo: tipo,
                nome: nome
            }
        });
        res.status(201).json(result);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          // The .code property can be accessed in a type-safe manner
          if (e.code === 'P2002') {
            res.status(409).json({error: {
                code: "VALIDATION_FAILED",
                message: "O CPF/CNPJ já está sendo utilizado"
            }})
          }
        }
        throw e
    }

    

    
}