'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('lessons_discipline', {
            id: Sequelize.INTEGER,
            title: Sequelize.TEXT,
            jekyll_folder: Sequelize.TEXT,
            modified_at: Sequelize.DATE,
        });
        await queryInterface.createTable('lessons_lab', {
            id: Sequelize.INTEGER,
            title: Sequelize.TEXT,
            content: Sequelize.TEXT,
            discipline_id: Sequelize.INTEGER,
            group_id: Sequelize.INTEGER,
            type: Sequelize.TEXT,
            alias: Sequelize.TEXT,
            order: Sequelize.INTEGER,
            icon: Sequelize.TEXT,
            content_additional: Sequelize.TEXT,
            remark: Sequelize.TEXT,
            modified_at: Sequelize.DATE,
        });
        await queryInterface.createTable('lessons_taskgroup', {
            id: Sequelize.INTEGER,
            title: Sequelize.TEXT,
            lab_id: Sequelize.INTEGER,
            type: Sequelize.INTEGER,
            order: Sequelize.INTEGER,
        });
        await queryInterface.createTable('lessons_task', {
            id: Sequelize.INTEGER,
            title: Sequelize.TEXT,
            complexity: Sequelize.INTEGER,
            lab_id: Sequelize.INTEGER,
            content: Sequelize.TEXT,
            order: Sequelize.INTEGER,
            tags: Sequelize.INTEGER,
            visible: Sequelize.INTEGER,
            group_id: Sequelize.INTEGER,
            additional_content: Sequelize.TEXT,
            custom_class: Sequelize.TEXT,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('lessons_task');
        await queryInterface.dropTable('lessons_taskgroup');
        await queryInterface.dropTable('lessons_lab');
        await queryInterface.dropTable('lessons_discipline');
    }
};
