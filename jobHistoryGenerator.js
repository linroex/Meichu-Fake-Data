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

  // 确定结束日期
  const endDate = employee.terminationDate ? new Date(employee.terminationDate) : new Date();

  while (currentJobIndex <= maxJobLevel && currentDate < endDate) {
    // 入職兩年內不會升遷
    if (currentDate.getFullYear() - new Date(employee.hireDate).getFullYear() > 2) {
      // 基础晋升概率为70%，每上升一级，概率降低15%
      let promotionChance = Math.max(70 - currentJobIndex * 15, 5);

      if (faker.number.int({ min: 1, max: 100 }) <= promotionChance || currentJobIndex === 0) {
        jobHistory.push({
          employee_id: employee.employeeId,
          job_title: jobTitles[currentJobIndex],
          promote_date: currentDate.toISOString().split('T')[0]
        });
        currentJobIndex++;
      }
    }

    // 随机增加1-4年的时间，但不超过结束日期
    let nextDate = new Date(currentDate);
    nextDate.setFullYear(nextDate.getFullYear() + faker.number.int({ min: 1, max: 4 }));
    currentDate = nextDate < endDate ? nextDate : endDate;
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