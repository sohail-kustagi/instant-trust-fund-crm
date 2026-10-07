import "dotenv/config";
import path from "path";
import fs from "fs";
import XLSX from "xlsx";
import { connectDB } from "../config/db";
import { CustomerModel } from "../models/Customer";
import { AuditLogModel } from "../models/AuditLog";

interface ParsedCustomer {
  fullName: string;
  mobile: string;
  location?: string;
  sourceFile: string;
  sheetName: string;
}

function normalizePhone(val: any): string | null {
  if (!val) return null;
  let str = String(val).trim();
  // If float string like "9900178218.0"
  if (str.includes(".")) {
    str = str.split(".")[0];
  }
  // Strip non-digits
  const digits = str.replace(/\D/g, "");
  // Handle country code 91 if present
  if (digits.length === 12 && digits.startsWith("91")) {
    const mobile = digits.slice(2);
    if (/^[6-9]\d{9}$/.test(mobile)) return mobile;
  }
  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) {
    return digits;
  }
  return null;
}

function normalizeName(val: any): string | null {
  if (!val) return null;
  let name = String(val).replace(/[\r\n\t]+/g, " ").trim();
  // Remove numeric prefixes like "1. ", "SL NO" etc if accidentally captured
  name = name.replace(/^(\d+\.?\s*)+/, "").trim();
  if (name.length < 2) return null;
  // Convert to Title Case
  return name
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function importCustomerData() {
  console.log("=========================================");
  console.log("STARTING REAL CUSTOMER DATA IMPORT PIPELINE");
  console.log("=========================================");

  await connectDB();

  const filesToProcess = [
    "NAZNEEN_BANU_OLD.xlsx",
    "PRAVEEN.xlsx",
    "SEVAKK_DATA_ENTRY.xlsx",
    "eabfa07b-f885-4158-8227-c682e1fd71d7.xlsx",
  ];

  const rootDir = process.cwd();
  const parsedRecords: ParsedCustomer[] = [];

  for (const filename of filesToProcess) {
    const importDirPath = path.join(rootDir, "server/data/imports", filename);
    const rootPath = path.join(rootDir, filename);
    const filePath = fs.existsSync(importDirPath) ? importDirPath : rootPath;
    if (!fs.existsSync(filePath)) {
      console.log(`[SKIP] File not found: ${filename}`);
      continue;
    }

    console.log(`\n[READ] Processing file: ${filename}...`);
    const workbook = XLSX.readFile(filePath);

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (!rows || rows.length < 2) continue;

      let nameColIdx = -1;
      let phoneColIdx = -1;
      let locationColIdx = -1;

      // Detect column indices from header rows
      for (let r = 0; r < Math.min(5, rows.length); r++) {
        const row = rows[r];
        if (!Array.isArray(row)) continue;

        row.forEach((cell, idx) => {
          if (!cell) return;
          const cellStr = String(cell).toUpperCase().trim();
          if (cellStr.includes("NAME") || cellStr.includes("CUSTOMER")) {
            if (nameColIdx === -1) nameColIdx = idx;
          }
          if (cellStr.includes("CONTACT") || cellStr.includes("MOBILE") || cellStr.includes("PHONE") || cellStr.includes("MOBIL")) {
            if (phoneColIdx === -1) phoneColIdx = idx;
          }
          if (cellStr.includes("LOCATION") || cellStr.includes("PLACE") || cellStr.includes("ADDRESS") || cellStr.includes("CITY")) {
            if (locationColIdx === -1) locationColIdx = idx;
          }
        });

        if (nameColIdx !== -1 && phoneColIdx !== -1) break;
      }

      // Fallback heuristics if header detection didn't capture both
      if (phoneColIdx === -1) {
        // Find column with numbers
        for (let c = 0; c < 15; c++) {
          let phoneCount = 0;
          for (let r = 1; r < Math.min(20, rows.length); r++) {
            const cell = rows[r]?.[c];
            if (normalizePhone(cell)) phoneCount++;
          }
          if (phoneCount > 2) {
            phoneColIdx = c;
            break;
          }
        }
      }

      if (nameColIdx === -1 && phoneColIdx !== -1) {
        // Look for string column adjacent to phone
        for (let c = 0; c < 15; c++) {
          if (c === phoneColIdx) continue;
          let nameCount = 0;
          for (let r = 1; r < Math.min(20, rows.length); r++) {
            const cell = rows[r]?.[c];
            if (typeof cell === "string" && cell.trim().length > 2 && !cell.match(/^\d+$/)) {
              nameCount++;
            }
          }
          if (nameCount > 2) {
            nameColIdx = c;
            break;
          }
        }
      }

      if (phoneColIdx === -1) {
        console.log(`   Sheet '${sheetName}' skipped (could not detect phone column)`);
        continue;
      }

      let sheetExtracted = 0;
      for (let r = 0; r < rows.length; r++) {
        const row = rows[r];
        if (!Array.isArray(row)) continue;

        const rawPhone = row[phoneColIdx];
        const validPhone = normalizePhone(rawPhone);
        if (!validPhone) continue;

        const rawName = nameColIdx !== -1 ? row[nameColIdx] : null;
        const validName = normalizeName(rawName) || `Customer ${validPhone.slice(-4)}`;
        const rawLocation = locationColIdx !== -1 ? String(row[locationColIdx] || "").trim() : undefined;

        parsedRecords.push({
          fullName: validName,
          mobile: validPhone,
          location: rawLocation && rawLocation.length > 1 ? rawLocation : undefined,
          sourceFile: filename,
          sheetName,
        });
        sheetExtracted++;
      }
      console.log(`   Sheet '${sheetName}': Extracted ${sheetExtracted} valid customer records.`);
    }
  }

  console.log(`\n-----------------------------------------`);
  console.log(`Total valid raw records extracted: ${parsedRecords.length}`);
  console.log(`-----------------------------------------`);

  // Deduplicate records in memory first
  const uniqueCustomerMap = new Map<string, ParsedCustomer>();
  for (const record of parsedRecords) {
    if (!uniqueCustomerMap.has(record.mobile)) {
      uniqueCustomerMap.set(record.mobile, record);
    }
  }

  console.log(`Unique phone numbers to import: ${uniqueCustomerMap.size}`);

  let insertedCount = 0;
  let skippedDuplicates = 0;

  for (const [mobile, customer] of uniqueCustomerMap.entries()) {
    const existing = await CustomerModel.findOne({ mobile });
    if (existing) {
      skippedDuplicates++;
      continue;
    }

    await CustomerModel.create({
      fullName: customer.fullName,
      normalizedName: customer.fullName.toLowerCase().trim(),
      mobile: customer.mobile,
      city: customer.location,
      district: customer.location,
      state: "Karnataka",
      source: "imported",
      isImported: true,
      notes: `Imported from business data sheet: ${customer.sourceFile} (${customer.sheetName})`,
      tags: ["imported-customer", customer.sourceFile.replace(".xlsx", "")],
      kycStatus: "pending",
    });
    insertedCount++;
  }

  await AuditLogModel.create({
    action: "SYSTEM_IMPORT",
    actorId: "000000000000000000000000",
    actorEmail: "system@instanttrustfunds.com",
    actorRole: "super_admin",
    details: `Imported ${insertedCount} real customer records from Excel data sheets. Skipped ${skippedDuplicates} duplicate records.`,
  });

  console.log("\n=========================================");
  console.log("CUSTOMER IMPORT COMPLETE!");
  console.log(`• Successfully Inserted: ${insertedCount} new customers`);
  console.log(`• Duplicates Skipped: ${skippedDuplicates}`);
  console.log("=========================================\n");
}

if (process.argv[1]?.includes("importCustomers")) {
  importCustomerData().then(() => process.exit(0)).catch((err) => {
    console.error("Import failed:", err);
    process.exit(1);
  });
}
