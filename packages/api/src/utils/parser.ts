import XLSX from "xlsx";

// lack of async for xlsx is a bit annoying
// maybe upstream version has it now?
// look into exceljs
export const parseRas = (
  buffer: Buffer,
  needed: string[] = [
    "Employee Code",
    "Employee Name",
    "RAS Status Group",
    "Skill",
  ]
) => {
  const workbook = XLSX.read(buffer, { type: "buffer" });

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error("No sheets present.");
  }

  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    throw new Error("Cannot find worksheet.");
  }

  // this never fails, can return bad data, how to error?
  const data = XLSX.utils.sheet_to_json(worksheet);
  const filtered = data.map((row) => {
    const filteredRow = {};
    for (const key of needed) {
      filteredRow[key] = row[key]; // TODO: fix typing
    }
    return filteredRow;
  });

  return filtered as Record<string, string>[];
};

export const parseDemand = (
  buffer: Buffer,
  needed: string[] = [
    "Auto req ID",
    "SR Number",
    "Reporting Manager [vReportingManager1]",
    "Reqisition Status",
    "Recruiter",
    "Primary Skill",
    "Domain for INFRA",
    "Sub Domain for INFRA",
    "Customer Name",
    "Designation",
    "Experience [iExperienceId]",
    "Job Description",
    "Job Description (Posting) [JD_ForPosting]",
    "Band [iBandId]",
    "Country",
  ]
) => {
  const workbook = XLSX.read(buffer, { type: "buffer" });

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error("No sheets present.");
  }

  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    throw new Error("Cannot find worksheet.");
  }
  // Extract column headers manually (assumes headers are in 6th row)
  const range = XLSX.utils.decode_range(worksheet["!ref"]); // TODO: fix typing
  range.s.r = 5;
  worksheet["!ref"] = XLSX.utils.encode_range(range);

  const data = XLSX.utils.sheet_to_json(worksheet);

  const filtered = data.map((row) => {
    const filteredRow = {};
    for (const key of needed) {
      filteredRow[key] = row[key]; // TODO: fix typing
    }
    return filteredRow;
  });

  return filtered;
};
