import dataSource from "../../typeorm.config";
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";
import child_process from "child_process";
import {app, shell} from "electron";
import path from "path";

export default async function backupDatabase() {
    let options: PostgresConnectionOptions = dataSource.options as PostgresConnectionOptions;
    console.dir(options)
    let fileName = `backup${(new Date().toISOString()).replace(/[-:\\.]/g, "_")}.sql`

    // let main_command = `pg_dump -p ${options.port} -h ${options.host} -U ${options.username} --create --if-exists --clean --file="${fileName}" -v ${options.database}`;
    let main_command = `pg_dump --dbname=postgresql://${options.username}:${options.password}@${options.host}:${options.port}/${options.database} --create --if-exists --clean --file="${fileName}" -v`;
    let encoding = "cp1251";
    console.log(main_command)

    let child = child_process.spawn(main_command, {
        detached: true,
        shell: true,
        cwd: app.getPath('userData'),
    });

    child.on('exit', function() {
        shell.showItemInFolder(path.join(app.getPath('userData'), fileName))
    })

}