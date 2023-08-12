import dataSource from "../typeorm.config";
import {FindOptionsWhere} from "typeorm";
import {Task} from "../models/task.entity";
import TaskGroup from "../models/task_group.entity";
import Student from "../models/student.entity";

export default class StudentRepository {
    static async remove(studentId: number) {
        await dataSource.getRepository(Student).delete({id: studentId})
    }

    static async get(id: number): Promise<Student | null> {
        return await dataSource.manager.findOneBy(Student, {id: id});
    }

    static async list(whereCondition: FindOptionsWhere<Student>): Promise<Student[]> {
        let tasks = await dataSource.manager.find(Student, {
            where: whereCondition,
            order: {second_name: "ASC"}
        })

        return tasks;
    }

    static async upsert(student: Student): Promise<Student | null> {
        if (student.id) {
            await dataSource.manager.update(Student, student.id, student)
        } else {
            student = (await dataSource.manager.insert(Student, student)).raw
        }
        return student
    }

}