const { faker } = require('@faker-js/faker');

const generateCompensationRecords = (employees) => {
  const compensationRecords = [];
  const today = new Date();

  employees.forEach(employee => {
    const hireDate = new Date(employee.hireDate);
    let currentSalary = faker.number.int({ min: 60000, max: 70000 });
    
    // 初始薪資記錄
    compensationRecords.push({
      employeeId: employee.employeeId,
      type: 'init_salary',
      amount: currentSalary,
      effectiveDate: employee.hireDate
    });

    // 計算第一次調薪的年份
    let reviewYear = hireDate.getFullYear() + 1;
    let reviewDate = new Date(reviewYear, 1, 1); // 2月1日

    // 分紅日期
    const bonusDates = [
      new Date(hireDate.getFullYear(), 1, 1),  // 2月1日
      new Date(hireDate.getFullYear(), 4, 1),  // 5月1日
      new Date(hireDate.getFullYear(), 7, 1),  // 8月1日
      new Date(hireDate.getFullYear(), 10, 1)  // 11月1日
    ];

    // 找到入職後的第一個分紅日期
    let nextBonusIndex = bonusDates.findIndex(date => date > hireDate);
    if (nextBonusIndex === -1) nextBonusIndex = 0;

    while (reviewDate < today || bonusDates[nextBonusIndex] < today) {
      // 處理調薪
      if (reviewDate < today) {
        const salaryIncreasePercentage = faker.number.float({ min: 0.02, max: 0.05, multipleOf: 0.001 });
        currentSalary = Math.round(currentSalary * (1 + salaryIncreasePercentage));

        compensationRecords.push({
          employeeId: employee.employeeId,
          type: 'salary_review',
          amount: currentSalary,  // 這裡現在是新的總薪資
          effectiveDate: reviewDate.toISOString().split('T')[0]
        });

        reviewYear++;
        reviewDate = new Date(reviewYear, 1, 1);
      }

      // 處理分紅
      while (nextBonusIndex < 4 && bonusDates[nextBonusIndex] < today) {
        compensationRecords.push({
          employeeId: employee.employeeId,
          type: 'bonus',
          amount: faker.number.int({ min: 200000, max: 300000 }),
          effectiveDate: bonusDates[nextBonusIndex].toISOString().split('T')[0]
        });

        nextBonusIndex++;
        if (nextBonusIndex === 4) {
          nextBonusIndex = 0;
          bonusDates.forEach(date => date.setFullYear(date.getFullYear() + 1));
        }
      }
    }
  });

  return compensationRecords;
};

module.exports = { generateCompensationRecords };