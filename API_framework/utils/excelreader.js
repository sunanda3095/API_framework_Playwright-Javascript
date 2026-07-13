import XLSX from "xlsx";

export function readExcel(filePath, sheetName) {

    const workbook = XLSX.readFile(filePath);

    const sheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(sheet);

    return data;
}