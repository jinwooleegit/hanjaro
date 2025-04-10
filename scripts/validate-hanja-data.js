/**
 * 한자 데이터 유효성 검사 및 최적화 스크립트
 * 
 * 이 스크립트는 다음 작업을 수행합니다:
 * 1. 모든 한자 데이터 파일의 유효성 검사
 * 2. 필수 필드 존재 확인
 * 3. 데이터 일관성 검사
 * 4. 중복 제거 및 최적화
 * 5. 검사 결과 보고서 생성
 */

const fs = require('fs');
const path = require('path');

// 경로 설정
const DATA_ROOT = path.join(process.cwd(), 'data');
const NEW_STRUCTURE_ROOT = path.join(DATA_ROOT, 'new-structure');
const CHARACTERS_DIR = path.join(NEW_STRUCTURE_ROOT, 'characters');
const GRADES_DIR = path.join(NEW_STRUCTURE_ROOT, 'grades');
const REPORTS_DIR = path.join(DATA_ROOT, 'reports');

// 필수 필드 정의
const REQUIRED_CHARACTER_FIELDS = [
  'id', 'character', 'unicode', 'grade', 'category', 'order_in_grade',
  'meaning', 'pronunciation', 'stroke_count', 'metadata'
];

const REQUIRED_GRADE_FIELDS = [
  'grade', 'name', 'description', 'category', 
  'character_count', 'character_ids', 'metadata'
];

// 유틸리티 함수들
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`디렉토리 생성: ${dir}`);
  }
}

function validateIdFormat(id) {
  // HJ-XX-XXXX-XXXX 형식 검증
  const idPattern = /^HJ-\d{2}-\d{4}-[0-9A-F]{4,5}$/;
  return idPattern.test(id);
}

// 메인 함수 - 전체 프로세스 실행
async function main() {
  console.log('한자 데이터 유효성 검사 및 최적화 시작...');
  
  // 디렉토리 구조 확인
  ensureDirectoryExists(NEW_STRUCTURE_ROOT);
  ensureDirectoryExists(CHARACTERS_DIR);
  ensureDirectoryExists(GRADES_DIR);
  ensureDirectoryExists(REPORTS_DIR);
  
  // 검사 실행
  const characterResults = await validateCharacterData();
  const gradeResults = await validateGradeData();
  const consistencyResults = await checkConsistency(characterResults.validData, gradeResults.validData);
  
  // 최적화 실행
  const optimizationResults = await optimizeData(
    characterResults.validData, 
    gradeResults.validData,
    consistencyResults
  );
  
  // 보고서 생성
  generateReport(
    characterResults, 
    gradeResults, 
    consistencyResults,
    optimizationResults
  );
  
  console.log('한자 데이터 유효성 검사 및 최적화 완료!');
  console.log(`보고서는 ${REPORTS_DIR} 디렉토리에서 확인할 수 있습니다.`);
}

// 한자 파일 유효성 검사
async function validateCharacterData() {
  console.log('한자 데이터 파일 유효성 검사 중...');
  
  const results = {
    total: 0,
    valid: 0,
    invalid: 0,
    errors: [],
    warnings: [],
    validData: {}
  };
  
  // 모든 한자 파일 읽기
  const files = fs.readdirSync(CHARACTERS_DIR)
    .filter(file => file.endsWith('.json'));
  
  results.total = files.length;
  
  for (const file of files) {
    const filePath = path.join(CHARACTERS_DIR, file);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      
      // 파일명과 ID 일치 확인
      if (!file.startsWith(data.id)) {
        results.errors.push(`파일명과 ID 불일치 - ${file}`);
        results.invalid++;
        continue;
      }
      
      // ID 형식 확인
      if (!validateIdFormat(data.id)) {
        results.errors.push(`잘못된 ID 형식 - ${data.id} (${file})`);
        results.invalid++;
        continue;
      }
      
      // 필수 필드 확인
      const missingFields = REQUIRED_CHARACTER_FIELDS.filter(field => !(field in data));
      if (missingFields.length > 0) {
        results.errors.push(`필수 필드 누락 - ${file}: ${missingFields.join(', ')}`);
        results.invalid++;
        continue;
      }
      
      // 유니코드 값 확인
      const calculatedUnicode = data.character.codePointAt(0).toString(16).toUpperCase();
      if (data.unicode !== calculatedUnicode) {
        results.warnings.push(`유니코드 불일치 - ${file}: ${data.unicode} != ${calculatedUnicode}`);
        // 유니코드 수정
        data.unicode = calculatedUnicode;
      }
      
      // 급수가 숫자인지 확인
      if (typeof data.grade !== 'number' || data.grade < 1 || data.grade > 15) {
        results.warnings.push(`잘못된 급수 값 - ${file}: ${data.grade}`);
      }
      
      // ID에서 급수와 파일의 급수 값 일치 확인
      const idParts = data.id.split('-');
      const idGrade = parseInt(idParts[1], 10);
      if (idGrade !== data.grade) {
        results.warnings.push(`ID의 급수와 데이터의 급수 불일치 - ${file}: ${idGrade} != ${data.grade}`);
      }
      
      // 유효한 데이터 저장
      results.validData[data.id] = data;
      results.valid++;
    } catch (error) {
      results.errors.push(`파일 파싱 오류 - ${file}: ${error.message}`);
      results.invalid++;
    }
  }
  
  console.log(`한자 데이터 검사 완료 - 총 ${results.total}개 중 ${results.valid}개 유효, ${results.invalid}개 무효`);
  return results;
}

// 급수 파일 유효성 검사
async function validateGradeData() {
  console.log('급수 데이터 파일 유효성 검사 중...');
  
  const results = {
    total: 0,
    valid: 0,
    invalid: 0,
    errors: [],
    warnings: [],
    validData: {}
  };
  
  // 모든 급수 파일 읽기
  const files = fs.readdirSync(GRADES_DIR)
    .filter(file => file.startsWith('grade_') && file.endsWith('.json'));
  
  results.total = files.length;
  
  for (const file of files) {
    const filePath = path.join(GRADES_DIR, file);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      
      // 파일명과 급수 일치 확인
      const fileGrade = file.replace('grade_', '').replace('.json', '');
      if (data.grade.toString() !== fileGrade) {
        results.errors.push(`파일명과 급수 불일치 - ${file}: ${fileGrade} != ${data.grade}`);
        results.invalid++;
        continue;
      }
      
      // 필수 필드 확인
      const missingFields = REQUIRED_GRADE_FIELDS.filter(field => !(field in data));
      if (missingFields.length > 0) {
        results.errors.push(`필수 필드 누락 - ${file}: ${missingFields.join(', ')}`);
        results.invalid++;
        continue;
      }
      
      // 문자 수와 ID 목록 길이 일치 확인
      if (data.character_count !== data.character_ids.length) {
        results.warnings.push(`문자 수와 ID 목록 길이 불일치 - ${file}: ${data.character_count} != ${data.character_ids.length}`);
        // 수정
        data.character_count = data.character_ids.length;
      }
      
      // 유효한 데이터 저장
      results.validData[data.grade] = data;
      results.valid++;
    } catch (error) {
      results.errors.push(`파일 파싱 오류 - ${file}: ${error.message}`);
      results.invalid++;
    }
  }
  
  console.log(`급수 데이터 검사 완료 - 총 ${results.total}개 중 ${results.valid}개 유효, ${results.invalid}개 무효`);
  return results;
}

// 데이터 일관성 검사
async function checkConsistency(characterData, gradeData) {
  console.log('데이터 일관성 검사 중...');
  
  const results = {
    characterGradeMismatch: [],
    missingCharactersInGrades: [],
    extraCharactersInGrades: [],
    duplicateCharacters: [],
    duplicateIds: [],
    fixableIssues: 0
  };
  
  // 중복 ID 및 한자 확인
  const idMap = {};
  const characterMap = {};
  
  for (const [id, data] of Object.entries(characterData)) {
    // ID 중복 확인
    if (idMap[id]) {
      results.duplicateIds.push(id);
    } else {
      idMap[id] = true;
    }
    
    // 한자 중복 확인
    if (characterMap[data.character]) {
      results.duplicateCharacters.push({
        character: data.character,
        ids: [characterMap[data.character], id]
      });
    } else {
      characterMap[data.character] = id;
    }
    
    // 한자 급수와 ID의 급수 일치 확인
    const idParts = id.split('-');
    const idGrade = parseInt(idParts[1], 10);
    
    if (idGrade !== data.grade) {
      results.characterGradeMismatch.push({
        id,
        character: data.character,
        idGrade,
        dataGrade: data.grade
      });
      results.fixableIssues++;
    }
  }
  
  // 급수별 한자 ID 확인
  for (const [grade, data] of Object.entries(gradeData)) {
    // 급수 파일에는 있지만 한자 파일에는 없는 ID 확인
    const missingIds = data.character_ids.filter(id => !characterData[id]);
    if (missingIds.length > 0) {
      results.extraCharactersInGrades.push({
        grade,
        missingIds
      });
      results.fixableIssues += missingIds.length;
    }
    
    // 한자 파일에는 있지만 급수 파일에는 없는 ID 확인
    const expectedIds = Object.keys(characterData)
      .filter(id => characterData[id].grade === parseInt(grade, 10));
    
    const missingInGrade = expectedIds
      .filter(id => !data.character_ids.includes(id));
    
    if (missingInGrade.length > 0) {
      results.missingCharactersInGrades.push({
        grade,
        missingIds: missingInGrade
      });
      results.fixableIssues += missingInGrade.length;
    }
  }
  
  console.log(`데이터 일관성 검사 완료 - ${results.fixableIssues}개의 수정 가능한 문제 발견`);
  return results;
}

// 데이터 최적화
async function optimizeData(characterData, gradeData, consistencyResults) {
  console.log('데이터 최적화 중...');
  
  const results = {
    gradeMismatchFixed: 0,
    missingCharactersAdded: 0,
    extraCharactersRemoved: 0,
    duplicatesResolved: 0,
    totalChanges: 0
  };
  
  // 한자 급수 불일치 수정
  for (const mismatch of consistencyResults.characterGradeMismatch) {
    const data = characterData[mismatch.id];
    if (data) {
      // 파일 경로
      const oldFilePath = path.join(CHARACTERS_DIR, `${mismatch.id}.json`);
      
      // 새 ID 생성 (급수 업데이트)
      const idParts = mismatch.id.split('-');
      idParts[1] = data.grade.toString().padStart(2, '0');
      const newId = idParts.join('-');
      
      // 데이터 업데이트
      data.id = newId;
      
      // 새 파일 저장
      const newFilePath = path.join(CHARACTERS_DIR, `${newId}.json`);
      fs.writeFileSync(newFilePath, JSON.stringify(data, null, 2), 'utf-8');
      
      // 이전 파일 삭제 (새 파일과 다른 경우)
      if (oldFilePath !== newFilePath) {
        fs.unlinkSync(oldFilePath);
      }
      
      results.gradeMismatchFixed++;
      results.totalChanges++;
    }
  }
  
  // 급수에 누락된 한자 추가
  for (const missing of consistencyResults.missingCharactersInGrades) {
    const grade = parseInt(missing.grade, 10);
    const gradeObj = gradeData[grade];
    
    if (gradeObj && missing.missingIds.length > 0) {
      // 유효한 ID만 추가
      const validIds = missing.missingIds.filter(id => characterData[id]);
      
      gradeObj.character_ids.push(...validIds);
      gradeObj.character_count = gradeObj.character_ids.length;
      gradeObj.metadata.last_updated = new Date().toISOString();
      
      // 파일 저장
      const filePath = path.join(GRADES_DIR, `grade_${grade}.json`);
      fs.writeFileSync(filePath, JSON.stringify(gradeObj, null, 2), 'utf-8');
      
      results.missingCharactersAdded += validIds.length;
      results.totalChanges++;
    }
  }
  
  // 급수에 잘못 포함된 한자 제거
  for (const extra of consistencyResults.extraCharactersInGrades) {
    const grade = parseInt(extra.grade, 10);
    const gradeObj = gradeData[grade];
    
    if (gradeObj && extra.missingIds.length > 0) {
      // 존재하지 않는 ID 제거
      gradeObj.character_ids = gradeObj.character_ids
        .filter(id => !extra.missingIds.includes(id));
      
      gradeObj.character_count = gradeObj.character_ids.length;
      gradeObj.metadata.last_updated = new Date().toISOString();
      
      // 파일 저장
      const filePath = path.join(GRADES_DIR, `grade_${grade}.json`);
      fs.writeFileSync(filePath, JSON.stringify(gradeObj, null, 2), 'utf-8');
      
      results.extraCharactersRemoved += extra.missingIds.length;
      results.totalChanges++;
    }
  }
  
  // 중복 한자 처리 - 가장 낮은 급수 유지, 다른 것 제거
  for (const duplicate of consistencyResults.duplicateCharacters) {
    const ids = duplicate.ids;
    const characters = ids.map(id => characterData[id]);
    
    // 급수 기준 정렬 (오름차순)
    characters.sort((a, b) => a.grade - b.grade);
    
    // 첫 번째 항목 (가장 낮은 급수) 유지, 나머지 제거
    for (let i = 1; i < characters.length; i++) {
      const idToRemove = characters[i].id;
      const filePath = path.join(CHARACTERS_DIR, `${idToRemove}.json`);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        results.duplicatesResolved++;
        results.totalChanges++;
      }
    }
  }
  
  console.log(`데이터 최적화 완료 - 총 ${results.totalChanges}개 변경사항 적용`);
  return results;
}

// 보고서 생성
function generateReport(characterResults, gradeResults, consistencyResults, optimizationResults) {
  console.log('검사 및 최적화 보고서 생성 중...');
  
  const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
  const reportPath = path.join(REPORTS_DIR, `validation-report-${timestamp}.json`);
  
  const report = {
    timestamp,
    summary: {
      character_files: {
        total: characterResults.total,
        valid: characterResults.valid,
        invalid: characterResults.invalid
      },
      grade_files: {
        total: gradeResults.total,
        valid: gradeResults.valid,
        invalid: gradeResults.invalid
      },
      consistency_issues: {
        grade_mismatches: consistencyResults.characterGradeMismatch.length,
        missing_characters: consistencyResults.missingCharactersInGrades.reduce(
          (total, item) => total + item.missingIds.length, 0
        ),
        extra_characters: consistencyResults.extraCharactersInGrades.reduce(
          (total, item) => total + item.missingIds.length, 0
        ),
        duplicate_characters: consistencyResults.duplicateCharacters.length,
        duplicate_ids: consistencyResults.duplicateIds.length,
        total_issues: consistencyResults.fixableIssues
      },
      optimization_results: {
        grade_mismatches_fixed: optimizationResults.gradeMismatchFixed,
        missing_characters_added: optimizationResults.missingCharactersAdded,
        extra_characters_removed: optimizationResults.extraCharactersRemoved,
        duplicates_resolved: optimizationResults.duplicatesResolved,
        total_changes: optimizationResults.totalChanges
      }
    },
    details: {
      character_errors: characterResults.errors,
      character_warnings: characterResults.warnings,
      grade_errors: gradeResults.errors,
      grade_warnings: gradeResults.warnings,
      consistency_details: {
        grade_mismatches: consistencyResults.characterGradeMismatch,
        missing_characters: consistencyResults.missingCharactersInGrades,
        extra_characters: consistencyResults.extraCharactersInGrades,
        duplicate_characters: consistencyResults.duplicateCharacters,
        duplicate_ids: consistencyResults.duplicateIds
      }
    }
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
  
  // 요약 보고서 (텍스트 파일로)
  const summaryPath = path.join(REPORTS_DIR, `validation-summary-${timestamp}.txt`);
  
  const summaryText = `
한자 데이터 유효성 검사 및 최적화 요약 보고서
생성일시: ${timestamp}

== 파일 검사 결과 ==
한자 파일: 총 ${characterResults.total}개 중 ${characterResults.valid}개 유효, ${characterResults.invalid}개 무효
급수 파일: 총 ${gradeResults.total}개 중 ${gradeResults.valid}개 유효, ${gradeResults.invalid}개 무효

== 일관성 검사 결과 ==
급수 불일치: ${consistencyResults.characterGradeMismatch.length}개
급수에 누락된 한자: ${consistencyResults.missingCharactersInGrades.reduce(
  (total, item) => total + item.missingIds.length, 0
)}개
급수에 잘못 포함된 한자: ${consistencyResults.extraCharactersInGrades.reduce(
  (total, item) => total + item.missingIds.length, 0
)}개
중복 한자: ${consistencyResults.duplicateCharacters.length}개
중복 ID: ${consistencyResults.duplicateIds.length}개
총 문제: ${consistencyResults.fixableIssues}개

== 최적화 결과 ==
수정된 급수 불일치: ${optimizationResults.gradeMismatchFixed}개
추가된 누락 한자: ${optimizationResults.missingCharactersAdded}개
제거된 잘못된 한자: ${optimizationResults.extraCharactersRemoved}개
해결된 중복: ${optimizationResults.duplicatesResolved}개
총 변경사항: ${optimizationResults.totalChanges}개

자세한 내용은 JSON 보고서 파일을 참조하세요.
`.trim();
  
  fs.writeFileSync(summaryPath, summaryText, 'utf-8');
  
  console.log(`보고서 생성 완료: ${reportPath}`);
  console.log(`요약 보고서 생성 완료: ${summaryPath}`);
}

// 스크립트 실행
main().catch(error => {
  console.error('오류 발생:', error);
  process.exit(1);
}); 