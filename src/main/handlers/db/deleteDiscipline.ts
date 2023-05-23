import Lab from "../../models/Lab";
import Discipline from "../../models/Discipline";

export default async function deleteDiscipline(event, disciplineId: number) {
    await Discipline.destroy({where: {id: disciplineId}})
}


