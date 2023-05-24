'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.addColumn(
            'lessons_discipline',
            'deploy_command',
            {
                type: Sequelize.DataTypes.TEXT
            }
        )
    },

    down: async (queryInterface, Sequelize) => {
        queryInterface.removeColumn(
            'lessons_discipline',
            'deploy_command'
        );
    }
};
