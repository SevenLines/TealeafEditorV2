import Discipline from "../../models/Discipline";

export default async function disciplineGetImages(disciplineId: number) {
    let discipline = await Discipline.findByPk(disciplineId)
    return discipline?.getImages()
}