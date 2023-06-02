import dataSource from "../../typeorm.config";
import {Lab} from "../../models/lab.entity";

export default async function fetchLab(event, id: number): Promise<Lab | null> {
    return await dataSource.manager.findOneBy(Lab, {id: id});
}


