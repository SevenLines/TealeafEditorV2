import Discipline from "../../models/Discipline";
import Lab from "../../models/Lab";

export default async function fetchDisciplines() : Promise<Discipline[]> {
    let disciplines = await Discipline.findAll({order: [["title", "DESC"]], raw: true})

    return disciplines;
}


