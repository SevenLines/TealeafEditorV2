import Discipline from "../../models/Discipline";

export default async function disciplineCopy(event, disciplineId: number): Promise<Discipline | null> {
    let discipline = await Discipline.findByPk(disciplineId)
    let newDiscipline = await discipline?.copy()
    if (newDiscipline)
        return newDiscipline.toJSON()
    return null
}