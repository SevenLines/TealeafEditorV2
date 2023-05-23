import Discipline from "../../models/Discipline";

export default async function disciplineRemoveUnusedImages(disciplineId: number) {
    let discipline = await Discipline.findByPk(disciplineId)
    return discipline?.removeUnusedImages();
}