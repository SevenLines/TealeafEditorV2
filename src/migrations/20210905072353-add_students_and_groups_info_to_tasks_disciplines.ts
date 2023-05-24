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
            'students_info',
            {
                type: Sequelize.DataTypes.JSONB
            }
        )
    await queryInterface.addColumn(
            'lessons_discipline',
            'groups',
            {
                type: Sequelize.DataTypes.JSONB
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
    await queryInterface.removeColumn(
            'lessons_task',
            'students_info',
        )
    await queryInterface.removeColumn(
            'lessons_discipline',
            'groups',
        )
  }
};
