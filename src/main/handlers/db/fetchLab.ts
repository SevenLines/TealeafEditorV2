import Discipline from "../../models/Discipline";
import Lab from "../../models/Lab";

export default async function fetchLab(event, id: number): Promise<Lab | null> {
    return await Lab.findByPk(id, {raw: true});
}


