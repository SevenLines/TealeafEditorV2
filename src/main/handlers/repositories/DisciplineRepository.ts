import dataSource from "../../typeorm.config";
import {Discipline} from "../../models/discipline.entity";

export default class DisciplineRepository {
    async remove(event, disciplineId: number) {
        await dataSource.getRepository(Discipline).delete({id: disciplineId})
    }

    async get(event, id: number): Promise<Discipline | null> {
        return await dataSource.manager.findOneBy(Discipline, {id: id});
    }

    async list() : Promise<Discipline[]> {
        let disciplines = await dataSource.manager.find(Discipline, {
            order: {
                title: "DESC"
            }
        })
        return disciplines;
    }

    async upsert(event, discipline: Discipline): Promise<Discipline | null> {
        if (discipline.id) {
            discipline.modified_at = new Date()
            await dataSource.manager.update(Discipline,  discipline.id, discipline)
        } else {
            discipline.modified_at = new Date()
            discipline = (await dataSource.manager.insert(Discipline, discipline)).raw
        }
        return discipline;
    }

    async disciplineCopy(event, disciplineId: number): Promise<Discipline | null> {
        let discipline = await dataSource.manager.findOneBy(Discipline, {id: disciplineId})
        let newDiscipline = await discipline?.copy()
        if (newDiscipline)
            return newDiscipline
        return null
    }

    async disciplineGenerateLabsYaml(event, disciplineId: number) {
        let discipline = await dataSource.manager.findOneBy(Discipline, {id: disciplineId});
        return discipline?.generateLabsYaml()
    }

    async disciplineGetImages(disciplineId: number) {
        let discipline = await dataSource.manager.findOneBy(Discipline, {id: disciplineId})
        return discipline?.getImages()
    }

    async disciplineRemoveUnusedImages(disciplineId: number) {
        let discipline = await dataSource.manager.findOneBy(Discipline, {id: disciplineId})
        return discipline?.removeUnusedImages();
    }


}