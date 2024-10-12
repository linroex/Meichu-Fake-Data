const fs = require('fs');
const path = require('path');
const parquet = require('parquetjs');
const { generateEmployees, processRandomTerminations } = require('./employeeGenerator');
const { generateRecruitmentRecords } = require('./recruitmentGenerator');
const { generateOnboardingRecords } = require('./onboardingGenerator');
const { generateCompensationRecords } = require('./compensationGenerator');
const { generateLeaveRecords } = require('./leaveGenerator');
const { generateTrainingRecords } = require('./trainingGenerator');
const { generatePerformanceRecords } = require('./performanceGenerator');
const { generateAwardRecords } = require('./awardGenerator');
const { generateJobHistoryRecords } = require('./jobHistoryGenerator');
const { generateSkillsRecords } = require('./skillsGenerator');
const { generateDisciplinaryRecords } = require('./disciplinaryGenerator');

// 確保 output 資料夾存在
const outputDir = 'output';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// 创建写入器函数
const createWriter = async (baseName, header, outputFormat) => {
  if (outputFormat === 'csv') {
    return createCsvWriter(baseName, header);
  } else if (outputFormat === 'parquet') {
    return await createParquetWriter(baseName, header);
  }
};

// CSV 写入器函数
const createCsvWriter = (baseName, header) => {
  const filePath = path.join(outputDir, `${baseName}.csv`);
  const headerRow = header.map(h => `"${h.title}"`).join(',') + '\n';
  fs.writeFileSync(filePath, headerRow);

  return {
    write(records) {
      let fileContent = '';
      records.forEach(record => {
        fileContent += header.map(h => {
          const value = record[h.id];
          // 如果值是 null 或 undefined，返回空字符串
          if (value === null || value === undefined) {
            return '""';
          }
          // 对字符串类型的值进行特殊处理，将双引号替换为两个双引号
          if (typeof value === 'string') {
            return `"${value.replace(/"/g, '""')}"`;
          }
          // 其他类型直接用双引号括起来
          return `"${value}"`;
        }).join(',') + '\n';
      });
      fs.appendFileSync(filePath, fileContent);
    },
    end() {} // CSV 不需要结束操作
  };
};

// Parquet 写入器函数
const createParquetWriter = async (baseName, header) => {
  const schema = new parquet.ParquetSchema(
    Object.fromEntries(header.map(h => [h.id, getParquetType(h.type, h.optional)]))
  );
  const filePath = path.join(outputDir, `${baseName}.parquet`);
  const writer = await parquet.ParquetWriter.openFile(schema, filePath);

  return {
    async write(records) {
      for (const record of records) {
        const convertedRecord = {};
        for (const [key, value] of Object.entries(record)) {
          if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            convertedRecord[key] = new Date(value);
          } else {
            convertedRecord[key] = value;
          }
        }
        await writer.appendRow(convertedRecord);
      }
    },
    async end() {
      await writer.close();
    }
  };
};

// 辅助函数：根据指定的类型返回 Parquet 数据类型
function getParquetType(type, isOptional = false) {
  let parquetType;
  switch (type) {
    case 'STRING':
      parquetType = { type: 'UTF8' };
      break;
    case 'INTEGER':
      parquetType = { type: 'INT32' };
      break;
    case 'FLOAT':
      parquetType = { type: 'FLOAT' };
      break;
    case 'DOUBLE':
      parquetType = { type: 'DOUBLE' };
      break;
    case 'BOOLEAN':
      parquetType = { type: 'BOOLEAN' };
      break;
    case 'DATE':
      parquetType = { type: 'TIMESTAMP_MILLIS' };
      break;
    default:
      parquetType = { type: 'UTF8' }; // 默认使用 UTF8 类型
  }

  if (isOptional) {
    parquetType.optional = true;
  }

  return parquetType;
}

// 定义所有写入器的函数
const createWriters = async (outputFormat) => {
  const writers = {};
  const writerDefinitions = {
    employees: [
      { id: 'employeeId', title: 'Employee ID', type: 'STRING' },
      { id: 'firstName', title: 'First Name', type: 'STRING' },
      { id: 'lastName', title: 'Last Name', type: 'STRING' },
      { id: 'dateOfBirth', title: 'Date_Of_Birth', type: 'DATE' },
      { id: 'hireDate', title: 'Hire_Date', type: 'DATE' },
      { id: 'terminationDate', title: 'Termination_Date', type: 'DATE', optional: true },
      { id: 'status', title: 'Status', type: 'STRING' }
    ],
    recruitment: [
      { id: 'employeeId', title: 'Employee ID', type: 'STRING' },
      { id: 'positionAppliedFor', title: 'Position_Applied_For', type: 'STRING' },
      { id: 'applicationDate', title: 'Application_Date', type: 'DATE' },
      { id: 'interviewDate', title: 'Interview_Date', type: 'DATE' },
      { id: 'status', title: 'Status', type: 'STRING' }
    ],
    onboarding: [
      { id: 'employeeId', title: 'Employee ID', type: 'STRING' },
      { id: 'formCompletionStatus', title: 'Form_Completion_Status', type: 'STRING' },
      { id: 'orientationCompletion', title: 'Orientation_Completion', type: 'BOOLEAN' },
      { id: 'mandatoryTrainingStatus', title: 'Mandatory_Training_Status', type: 'STRING' }
    ],
    compensation: [
      { id: 'employeeId', title: 'Employee ID', type: 'STRING' },
      { id: 'type', title: 'Type', type: 'STRING' },
      { id: 'amount', title: 'Amount', type: 'DOUBLE' },
      { id: 'effectiveDate', title: 'Effective_Date', type: 'DATE' }
    ],
    leave: [
      { id: 'employeeId', title: 'Employee ID', type: 'STRING' },
      { id: 'startDate', title: 'Start_Date', type: 'DATE' },
      { id: 'endDate', title: 'End_Date', type: 'DATE' },
      { id: 'applyDate', title: 'Apply_Date', type: 'DATE' },
      { id: 'leaveType', title: 'Leave_Type', type: 'STRING' },
      { id: 'approvalStatus', title: 'Approval_Status', type: 'STRING' }
    ],
    training: [
      { id: 'employeeId', title: 'Employee ID', type: 'STRING' },
      { id: 'trainingName', title: 'Training Name', type: 'STRING' },
      { id: 'completionDate', title: 'Completion_Date', type: 'DATE' },
      { id: 'expireDate', title: 'Expire_Date', type: 'DATE' }
    ],
    performance: [
      { id: 'employeeId', title: 'Employee ID', type: 'STRING' },
      { id: 'reviewDate', title: 'Review Date', type: 'DATE' },
      { id: 'reviewerId', title: 'Reviewer ID', type: 'STRING' },
      { id: 'score', title: 'Score', type: 'INTEGER' },
      { id: 'feedback', title: 'Feedback', type: 'STRING' }
    ],
    award: [
      { id: 'employeeId', title: 'Employee ID', type: 'STRING' },
      { id: 'awardName', title: 'Award Name', type: 'STRING' },
      { id: 'awardDesc', title: 'Award Description', type: 'STRING' },
      { id: 'awardDate', title: 'Award Date', type: 'DATE' }
    ],
    jobHistory: [
      { id: 'employee_id', title: 'Employee ID', type: 'STRING' },
      { id: 'job_title', title: 'Job Title', type: 'STRING' },
      { id: 'promote_date', title: 'Promote Date', type: 'DATE' }
    ],
    skills: [
      { id: 'employee_id', title: 'Employee ID', type: 'STRING' },
      { id: 'skill_name', title: 'Skill Name', type: 'STRING' },
      { id: 'skill_level', title: 'Skill Level', type: 'STRING' }
    ],
    disciplinary: [
      { id: 'employee_id', title: 'Employee ID', type: 'STRING' },
      { id: 'incident_date', title: 'Incident Date', type: 'DATE' },
      { id: 'incident_type', title: 'Incident Type', type: 'STRING' },
      { id: 'incident_description', title: 'Incident Description', type: 'STRING' },
      { id: 'disciplinary_action_taken', title: 'Disciplinary Action Taken', type: 'STRING' },
      { id: 'disciplinary_action_date', title: 'Disciplinary Action Date', type: 'DATE' }
    ]
  };

  for (const [key, value] of Object.entries(writerDefinitions)) {
    writers[key] = await createWriter(key, value, outputFormat);
  }
  return writers;
};

// 分批处理函数
async function processBatch(batchEmployees, batchIndex, writers) {
  console.log(`開始處理第 ${batchIndex} 批 ${batchEmployees.length} 名員工的數據...`);

  // 首先处理随机离职
  processRandomTerminations(batchEmployees);

  // 然后生成所有其他记录，包括纪律处分记录
  const batchRecruitment = generateRecruitmentRecords(batchEmployees);
  const batchOnboarding = generateOnboardingRecords(batchEmployees);
  const batchCompensation = generateCompensationRecords(batchEmployees);
  const batchLeave = generateLeaveRecords(batchEmployees);
  const batchTraining = generateTrainingRecords(batchEmployees);
  const batchPerformance = generatePerformanceRecords(batchEmployees);
  const batchAward = generateAwardRecords(batchEmployees);
  const batchJobHistory = generateJobHistoryRecords(batchEmployees);
  const batchSkills = generateSkillsRecords(batchEmployees);
  const batchDisciplinary = generateDisciplinaryRecords(batchEmployees);

  await writers.employees.write(batchEmployees);
  await writers.recruitment.write(batchRecruitment);
  await writers.onboarding.write(batchOnboarding);
  await writers.compensation.write(batchCompensation);
  await writers.leave.write(batchLeave);
  await writers.training.write(batchTraining);
  await writers.performance.write(batchPerformance);
  await writers.award.write(batchAward);
  await writers.jobHistory.write(batchJobHistory);
  await writers.skills.write(batchSkills);
  await writers.disciplinary.write(batchDisciplinary);

  console.log(`完成處理第 ${batchIndex} 批員工的數據`);
}

// 主处理函数
async function processAllEmployees(totalEmployees, batchSize = 10000, outputFormat = 'csv') {
  console.log(`開始生成員工數據，輸出格式：${outputFormat}...`);
  
  const writers = await createWriters(outputFormat);
  
  for (let i = 0, batchIndex = 1; i < totalEmployees; i += batchSize, batchIndex++) {
    console.log(`生成第 ${i + 1} 到 ${Math.min(i + batchSize, totalEmployees)} 名員工的數據...`);
    const batchEmployees = generateEmployees(Math.min(batchSize, totalEmployees - i));
    await processBatch(batchEmployees, batchIndex, writers);
    console.log(`已處理 ${Math.min(i + batchSize, totalEmployees)} / ${totalEmployees} 名員工`);
  }

  // 关闭所有写入器
  for (const writer of Object.values(writers)) {
    await writer.end();
  }

  console.log(`所有數據已成功生成並寫入 ${outputFormat.toUpperCase()} 文件。`);
}

// 执行主处理函数
(async () => {
  try {
    const outputFormat = process.argv[2] || 'csv'; // 从命令行参数获取输出格式，默认为 CSV
    if (outputFormat !== 'csv' && outputFormat !== 'parquet') {
      throw new Error('Invalid output format. Please use "csv" or "parquet".');
    }
    await processAllEmployees(500, 1000, outputFormat);
  } catch (err) {
    console.error('處理過程中發生錯誤:', err);
  }
})();