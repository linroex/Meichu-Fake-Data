const { faker } = require('@faker-js/faker');

const jobTitles = [
  'Assistant Engineer',
  'Engineer',
  'Senior Engineer',
  'Staff Engineer',
  'Principal Engineer',
  'Engineering Manager',
  'Senior Engineering Manager',
  'Director of Engineering'
];

function generateJobHistory(employee) {
  const jobHistory = [];
  let currentDate = new Date(employee.hireDate);
  let currentJobIndex = 0;

  // 随机决定这个员工的最高职级
  const maxJobLevel = faker.number.int({ min: 0, max: jobTitles.length - 1 });

  while (currentJobIndex <= maxJobLevel && currentDate < new Date()) {
    // 基础晋升概率为80%，每上升一级，概率降低10%
    let promotionChance = Math.max(70 - currentJobIndex * 15, 5);

    if (faker.number.int({ min: 1, max: 100 }) <= promotionChance || currentJobIndex === 0) {
      jobHistory.push({
        employee_id: employee.employeeId,
        job_title: jobTitles[currentJobIndex],
        promote_date: currentDate.toISOString().split('T')[0]
      });
      currentJobIndex++;
    }

    // 随机增加1-4年的时间
    currentDate.setFullYear(currentDate.getFullYear() + faker.number.int({ min: 1, max: 4 }));
  }

  return jobHistory;
}

function generateJobHistoryRecords(employees) {
  let allJobHistory = [];

  for (const employee of employees) {
    const employeeJobHistory = generateJobHistory(employee);
    allJobHistory = allJobHistory.concat(employeeJobHistory);
  }

  return allJobHistory;
}

module.exports = { generateJobHistoryRecords };