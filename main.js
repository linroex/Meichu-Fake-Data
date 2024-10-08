const fs = require('fs');
const path = require('path');
const { generateEmployees } = require('./employeeGenerator');
const { generateRecruitmentRecords } = require('./recruitmentGenerator');
const { generateOnboardingRecords } = require('./onboardingGenerator');
const { generateCompensationRecords } = require('./compensationGenerator');
const { generateLeaveRecords } = require('./leaveGenerator');
const { generateTrainingRecords } = require('./trainingGenerator');
const { generatePerformanceRecords } = require('./performanceGenerator');
const { generateAwardRecords } = require('./awardGenerator');

// 確保 output 資料夾存在
const outputDir = 'output';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// 創建 CSV 寫入器函數
const createCsvWriter = (baseName, header) => {
  const filePath = path.join(outputDir, `${baseName}.csv`);
  const headerRow = header.map(h => h.title).join(',') + '\n';
  fs.writeFileSync(filePath, headerRow);

  return {
    write(records) {
      let fileContent = '';
      records.forEach(record => {
        fileContent += header.map(h => record[h.id]).join(',') + '\n';
      });
      fs.appendFileSync(filePath, fileContent);
    }
  };
};

// 定義所有 CSV 寫入器
const csvWriters = {
  employees: createCsvWriter('employees', [
    { id: 'employeeId', title: 'Employee ID' },
    { id: 'firstName', title: 'First Name' },
    { id: 'lastName', title: 'Last Name' },
    { id: 'dateOfBirth', title: 'Date_Of_Birth' },
    { id: 'hireDate', title: 'Hire_Date' },
    { id: 'terminationDate', title: 'Termination_Date' },
    { id: 'status', title: 'Status' }
  ]),
  recruitment: createCsvWriter('recruitment', [
    { id: 'employeeId', title: 'Employee ID' },
    { id: 'positionAppliedFor', title: 'Position_Applied_For' },
    { id: 'applicationDate', title: 'Application_Date' },
    { id: 'interviewDate', title: 'Interview_Date' },
    { id: 'status', title: 'Status' }
  ]),
  onboarding: createCsvWriter('onboarding', [
    { id: 'employeeId', title: 'Employee ID' },
    { id: 'formCompletionStatus', title: 'Form_Completion_Status' },
    { id: 'orientationCompletion', title: 'Orientation_Completion' },
    { id: 'mandatoryTrainingStatus', title: 'Mandatory_Training_Status' }
  ]),
  compensation: createCsvWriter('compensation', [
    { id: 'employeeId', title: 'Employee ID' },
    { id: 'type', title: 'Type' },
    { id: 'amount', title: 'Amount' },
    { id: 'effectiveDate', title: 'Effective_Date' }
  ]),
  leave: createCsvWriter('leave', [
    { id: 'employeeId', title: 'Employee ID' },
    { id: 'startDate', title: 'Start_Date' },
    { id: 'endDate', title: 'End_Date' },
    { id: 'applyDate', title: 'Apply_Date' },
    { id: 'leaveType', title: 'Leave_Type' },
    { id: 'approvalStatus', title: 'Approval_Status' }
  ]),
  training: createCsvWriter('training', [
    { id: 'employeeId', title: 'Employee ID' },
    { id: 'trainingName', title: 'Training Name' },
    { id: 'completionDate', title: 'Completion_Date' },
    { id: 'expireDate', title: 'Expire_Date' }
  ]),
  performance: createCsvWriter('performance', [
    { id: 'employeeId', title: 'Employee ID' },
    { id: 'reviewDate', title: 'Review Date' },
    { id: 'reviewerId', title: 'Reviewer ID' },
    { id: 'score', title: 'Score' },
    { id: 'feedback', title: 'Feedback' }
  ]),
  award: createCsvWriter('award', [
    { id: 'employeeId', title: 'Employee ID' },
    { id: 'awardName', title: 'Award Name' },
    { id: 'awardDesc', title: 'Award Description' },
    { id: 'awardDate', title: 'Award Date' }
  ])
};

// 分批處理函數
function processBatch(batchEmployees, batchIndex) {
  console.log(`開始處理第 ${batchIndex} 批 ${batchEmployees.length} 名員工的數據...`);

  const batchRecruitment = generateRecruitmentRecords(batchEmployees);
  const batchOnboarding = generateOnboardingRecords(batchEmployees);
  const batchCompensation = generateCompensationRecords(batchEmployees);
  const batchLeave = generateLeaveRecords(batchEmployees);
  const batchTraining = generateTrainingRecords(batchEmployees);
  const batchPerformance = generatePerformanceRecords(batchEmployees);
  const batchAward = generateAwardRecords(batchEmployees);

  csvWriters.employees.write(batchEmployees);
  csvWriters.recruitment.write(batchRecruitment);
  csvWriters.onboarding.write(batchOnboarding);
  csvWriters.compensation.write(batchCompensation);
  csvWriters.leave.write(batchLeave);
  csvWriters.training.write(batchTraining);
  csvWriters.performance.write(batchPerformance);
  csvWriters.award.write(batchAward);

  console.log(`完成處理第 ${batchIndex} 批員工的數據`);
}

// 主處理函數
function processAllEmployees(totalEmployees, batchSize = 5000) {
  console.log('開始生成員工數據...');
  
  for (let i = 0, batchIndex = 1; i < totalEmployees; i += batchSize, batchIndex++) {
    console.log(`生成第 ${i + 1} 到 ${Math.min(i + batchSize, totalEmployees)} 名員工的數據...`);
    const batchEmployees = generateEmployees(Math.min(batchSize, totalEmployees - i));
    processBatch(batchEmployees, batchIndex);
    console.log(`已處理 ${Math.min(i + batchSize, totalEmployees)} / ${totalEmployees} 名員工`);
  }

  console.log('所有數據已成功生成並寫入 CSV 文件。');
}

// 執行主處理函數
try {
  processAllEmployees(150000);
} catch (err) {
  console.error('處理過程中發生錯誤:', err);
}