const { faker } = require('@faker-js/faker');

const generateOnboardingRecords = (employees) => {
  return employees.map(employee => {
    // 使用 5% 的機率生成 'Pending' 狀態
    const formCompletionStatus = faker.number.int(100) < 5 ? 'Pending' : 'Completed';
    const mandatoryTrainingStatus = faker.number.int(100) < 5 ? 'Pending' : 'Completed';

    // 使用 2% 的機率生成 false 狀態
    const orientationCompletion = faker.number.int(100) >= 2;

    return {
      employeeId: employee.employeeId,
      formCompletionStatus: formCompletionStatus,
      orientationCompletion: orientationCompletion,
      mandatoryTrainingStatus: mandatoryTrainingStatus
    };
  });
};

module.exports = { generateOnboardingRecords };