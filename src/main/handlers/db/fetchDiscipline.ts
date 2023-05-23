import Discipline from "../../models/Discipline";
import Lab from "../../models/Lab";

export default async function fetchDiscipline(event, id: number): Promise<Discipline | null> {
    return await Discipline.findByPk(id, {raw: true});
}


