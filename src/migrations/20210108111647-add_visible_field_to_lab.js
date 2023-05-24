'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn(
            'lessons_lab',
            'visible',
            {
                type: Sequelize.DataTypes.BOOLEAN
            }
        )
    },

    down: async (queryInterface, Sequelize) => {
        queryInterface.removeColumn(
            'lessons_lab',
            'visible'
        );
    }
};
