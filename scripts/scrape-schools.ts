/**
 * Scrape MOE School Directory from data.gov.sg
 * Extracts all school websites (.moe.edu.sg domains)
 */

import fs from 'fs/promises';
import path from 'path';

interface SchoolRecord {
  school_name: string;
  url_address: string;
  address: string;
  postal_code: string;
  telephone_no: string;
  email_address: string;
  mainlevel_code: string;
  type_code: string;
  nature_code: string;
  zone_code: string;
}

interface DataGovResponse {
  success: boolean;
  result: {
    records: Record<string, string>[];
    total: number;
  };
}

async function fetchSchoolDirectory(): Promise<SchoolRecord[]> {
  const API_URL = 'https://data.gov.sg/api/action/datastore_search';
  const RESOURCE_ID = 'd_688b934f82c1059ed0a6993d2a829089';

  const allSchools: SchoolRecord[] = [];
  let offset = 0;
  const limit = 100;

  console.log('Fetching school directory from data.gov.sg...');

  while (true) {
    const url = `${API_URL}?resource_id=${RESOURCE_ID}&limit=${limit}&offset=${offset}`;
    console.log(`  Fetching offset ${offset}...`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data: DataGovResponse = await response.json();

    if (!data.success || !data.result.records.length) {
      break;
    }

    for (const record of data.result.records) {
      allSchools.push({
        school_name: record.school_name || '',
        url_address: record.url_address || '',
        address: record.address || '',
        postal_code: record.postal_code || '',
        telephone_no: record.telephone_no || '',
        email_address: record.email_address || '',
        mainlevel_code: record.mainlevel_code || '',
        type_code: record.type_code || '',
        nature_code: record.nature_code || '',
        zone_code: record.zone_code || '',
      });
    }

    offset += limit;

    // Respect rate limits
    await new Promise(resolve => setTimeout(resolve, 200));

    if (data.result.records.length < limit) {
      break;
    }
  }

  return allSchools;
}

async function main() {
  try {
    const schools = await fetchSchoolDirectory();

    // Filter for schools with valid .moe.edu.sg URLs
    const validSchools = schools.filter(s =>
      s.url_address &&
      (s.url_address.includes('.moe.edu.sg') || s.url_address.includes('.moe.gov.sg'))
    );

    console.log(`\nFound ${schools.length} total schools`);
    console.log(`Found ${validSchools.length} schools with valid MOE URLs`);

    // Categorize by level
    const byLevel: Record<string, SchoolRecord[]> = {};
    for (const school of validSchools) {
      const level = school.mainlevel_code || 'UNKNOWN';
      if (!byLevel[level]) byLevel[level] = [];
      byLevel[level].push(school);
    }

    console.log('\nBy education level:');
    for (const [level, schoolList] of Object.entries(byLevel)) {
      console.log(`  ${level}: ${schoolList.length} schools`);
    }

    // Save to file
    const outputPath = path.join(process.cwd(), 'data', 'schools.json');
    await fs.writeFile(outputPath, JSON.stringify(validSchools, null, 2));
    console.log(`\nSaved to ${outputPath}`);

    // Also save a simple URL list for quick reference
    const urlListPath = path.join(process.cwd(), 'data', 'school-urls.txt');
    const urls = validSchools.map(s => s.url_address).join('\n');
    await fs.writeFile(urlListPath, urls);
    console.log(`URL list saved to ${urlListPath}`);

    // Print sample
    console.log('\nSample schools:');
    validSchools.slice(0, 5).forEach(s => {
      console.log(`  - ${s.school_name}: ${s.url_address}`);
    });

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
