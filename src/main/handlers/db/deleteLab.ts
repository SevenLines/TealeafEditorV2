import Lab from "../../models/Lab";

export default async function deleteLab(event, labId: number) {
    await Lab.destroy({where: {id: labId}})
}


