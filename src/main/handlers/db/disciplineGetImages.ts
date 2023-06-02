import dataSource from "../../typeorm.config";
import {Discipline} from "../../models/discipline.entity";

export default async function disciplineGetImages(disciplineId: number) {
    let discipline = await dataSource.manager.findOneBy(Discipline, {id: disciplineId})
    return discipline?.getImages()
}