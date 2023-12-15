import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next'
import type { OrgaoParticipanteItem } from "utils/types";


export default async function handle(req: NextApiRequest,res: NextApiResponse<OrgaoParticipanteItem>) {
    const id = parseInt(req.query.id as string);
    const data: OrgaoParticipanteItem = req.body;

    if (req.method === "DELETE") {
        const item: OrgaoParticipanteItem = await prisma.orgaoParticipanteItem.delete({
            where: {id}
        })
        res.json(item)
        return
    } else if (req.method === "PUT") {
        const item = await prisma.orgaoParticipanteItem.update({
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