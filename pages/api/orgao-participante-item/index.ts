import prisma from "../../../lib/prisma";
import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { OrgaoParticipanteItem, HTTPError } from "utils/types";

export default async function handle(req: NextApiRequest,res: NextApiResponse<Error | OrgaoParticipanteItem>) {
    const data:OrgaoParticipanteItem = req.body;
    
    

    try {
        const result = await prisma.orgaoParticipanteItem.create({
            data,
            include:{
              numero_licitacao: true,
              numero_item: true,
              numero_lote: true,
              orgao_participante: true
            }
        });
        res.status(201).json(result);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          // The .code property can be accessed in a type-safe manner
          if (e.code === 'P2002') {
            res.status(409).json({error: {
                code: "VALIDATION_FAILED",
                message: "O id já está sendo utilizado"
            }})
          }
        }
        throw e
    }

    

    
}