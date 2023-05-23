import Lab from "../../models/Lab";

export default async function upsertLab(event, labDTO: any): Promise<Lab | null> {
    if (labDTO.id) {
        let lab = await Lab.findByPk(labDTO.id)
        if (lab) {
            lab.set(labDTO)
            await lab.save()
            return lab.toJSON()
        }
    }
    return await Lab.create({
        ...labDTO
    })
}


