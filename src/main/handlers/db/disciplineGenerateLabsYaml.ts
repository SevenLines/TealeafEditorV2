import {Discipline} from "../../models/discipline.entity";
import dataSource from "../../typeorm.config";

export default async function disciplineGenerateLabsYaml(event, disciplineId: number) {
    let discipline = await dataSource.manager.findOneBy(Discipline, {id: disciplineId});
    return discipline?.generateLabsYaml()
}