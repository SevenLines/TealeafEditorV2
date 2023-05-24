'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn(
            'lessons_discipline',
            'site_url',
            {
                type: Sequelize.DataTypes.STRING
            }
        )
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn(
            'lessons_discipline',
            'site_url'
        );
    }
};
