import dataSource from "../../typeorm.config";
import {Discipline} from "../../models/discipline.entity";

export default async function deleteDiscipline(event, disciplineId: number) {
    await dataSource.getRepository(Discipline).delete({id: disciplineId})
}


