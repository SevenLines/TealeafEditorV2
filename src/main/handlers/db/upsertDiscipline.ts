import Discipline from "../../models/Discipline";

export default async function upsertDiscipline(event, disciplineDTO: any): Promise<Discipline | null> {
    if (disciplineDTO.id) {
        let discipline = await Discipline.findByPk(disciplineDTO.id)
        if (discipline) {
            discipline.set(disciplineDTO)
            await discipline.save()
            return discipline.toJSON()
        }
    }
    return await Discipline.create({
        ...disciplineDTO
    })
}


