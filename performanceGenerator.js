const { faker } = require('@faker-js/faker');

const generatePerformanceRecords = (employees) => {
  const performanceRecords = [];
  const today = new Date();

  const generateScore = () => {
    const random = faker.number.int(100);
    if (random < 50) return 3;  // 50% 的機率得到 3 分
    if (random < 85) return 2;  // 35% 的機率得到 2 分
    if (random < 95) return 4;  // 10% 的機率得到 4 分
    if (random < 100) return 5; // 5% 的機率得到 5 分
    return 1;  // 剩下的 5% 機率得到 1 分
  };

  employees.forEach(employee => {
    const hireDate = new Date(employee.hireDate);
    let reviewYear = hireDate.getFullYear();
    
    while (reviewYear <= today.getFullYear()) {
      // 確保審核日期不早於入職日期
      const reviewDate = new Date(Math.max(
        new Date(reviewYear, 11, 1), // 12月1日
        hireDate
      ));

      // 如果審核日期晚於今天,跳過這一年
      if (reviewDate > today) break;

      // 選擇一個不同的員工作為審核者
      let reviewer;
      do {
        reviewer = faker.helpers.arrayElement(employees);
      } while (reviewer.employeeId === employee.employeeId);

      // 生成分數
      const score = generateScore();
      const feedback = faker.lorem.paragraph().slice(0, 100); // 確保不超過100字

      performanceRecords.push({
        employeeId: employee.employeeId,
        reviewDate: reviewDate.toISOString().split('T')[0],
        reviewerId: reviewer.employeeId,
        score: score,
        feedback: feedback
      });

      reviewYear++;
    }
  });

  return performanceRecords;
};

module.exports = { generatePerformanceRecords };