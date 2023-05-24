'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn(
            'lessons_discipline',
            'archive',
            {
                type: Sequelize.DataTypes.BOOLEAN,
                defaultValue: false,
            }
        )
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn(
            'lessons_discipline',
            'archive'
        );
    }
};
