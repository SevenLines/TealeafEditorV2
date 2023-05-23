import Lab from "../../models/Lab";
import Discipline from "../../models/Discipline";

export default async function fetchLabs(event, disciplineId: number) : Promise<Lab[]> {
    let labs = await Lab.findAll({where: {
            discipline_id: disciplineId,
        }, order: [["order", "ASC"]], raw: true})

    return labs;
}