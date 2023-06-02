import dataSource from "../../typeorm.config";
import {Lab} from "../../models/lab.entity";

export default async function updateLabsOrder(event, labs: Lab[]) {
    let orders = labs.map((x, index) => ({...x, order: index}))
    await dataSource.getRepository(Lab).save(orders)
}