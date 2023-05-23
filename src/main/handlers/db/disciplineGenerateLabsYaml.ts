import Discipline from "../../models/Discipline";

export default async function disciplineGenerateLabsYaml(event, disciplineId: number) {
    let discipline = await Discipline.findByPk(disciplineId);
    return discipline?.generateLabsYaml()
}