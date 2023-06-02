import dataSource from "../../typeorm.config";
import {Lab} from "../../models/lab.entity";

export default async function deleteLab(event, labId: number) {
    await dataSource.getRepository(Lab).delete({id: labId})
}


