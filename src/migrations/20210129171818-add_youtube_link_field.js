'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.addColumn(
            'lessons_task',
            'youtube_link',
            {
                type: Sequelize.DataTypes.STRING
            }
        )
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        queryInterface.removeColumn(
            'lessons_task',
            'youtube_link'
        );
    }
};
