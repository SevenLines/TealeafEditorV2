import Lab from "../../models/Lab";
import disciplineGenerateLabsYaml from "./disciplineGenerateLabsYaml";

export default async function updateLabsOrder(event, labs: Lab[]) {
    let orders = labs.map((x, index) => ({...x, order: index}))
    await Lab.bulkCreate(orders, {
        updateOnDuplicate: ['order', 'modified_at']
    })
}