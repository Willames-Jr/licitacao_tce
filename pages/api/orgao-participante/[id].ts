import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next'
import type { OrgaoParticipante } from "utils/types";


export default async function handle(req: NextApiRequest,res: NextApiResponse<OrgaoParticipante>) {
    const id = parseInt(req.query.id as string);
    const data: OrgaoParticipante = req.body;

    if (req.method === "DELETE") {
        const item: OrgaoParticipante = await prisma.orgaoParticipante.delete({
            where: {id}
        })
        res.json(item)
        return
    } else if (req.method === "PUT") {
        const item = await prisma.orgaoParticipante.update({
            where: {id},
            data: data
        })
        res.json(item);
        return;
    } else {
        throw new Error(
          `The HTTP ${req.method} method is not supported at this route.`,
        );
    }

} 