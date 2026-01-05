import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

// Paths
const SITES_LIST_PATH = 'docs/sites_list.csv';
const REPOS_JSON_PATH = 'repos.json';
const WHMCS_PATH = 'tmp_data/whmcs_domains/whmcs_domains.csv';
const CF_PATH = 'tmp_data/domain_summary/domain_summary.csv';
// Artifact name: wpmudev-domain-inventory, File: wpmudev_domains.csv
// When remote workflow runs, we will download it to tmp_data/wpmudev/wpmudev-domain-inventory/wpmudev_domains.csv
const WPMUDEV_PATH = 'tmp_data/wpmudev/wpmudev-domain-inventory/wpmudev_domains.csv';

const OUTPUT_PATH = 'docs/sites_list.csv';

// Read Files
function readCSV(path) {
    if (!fs.existsSync(path)) return [];
    const content = fs.readFileSync(path, 'utf-8');
    return parse(content, { columns: true, skip_empty_lines: true, trim: true });
}

function readJSON(path) {
    if (!fs.existsSync(path)) return [];
    const content = fs.readFileSync(path, 'utf-8').replace(/^\uFEFF/, '');
    return JSON.parse(content);
}

// Helper: Check Site Availability
async function checkSiteAvailability(domain) {
    if (!domain) return 'Unknown';

    // Add protocol if missing
    const url = `https://${domain}`;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const response = await fetch(url, {
            method: 'GET', // Use GET to check content if needed, HEAD is faster but less reliable for "Live"
            signal: controller.signal,
            redirect: 'manual' // Don't follow redirects automatically to detect them
        });

        clearTimeout(timeoutId);

        if (response.status === 200) return 'Live';
        if (response.status >= 300 && response.status < 400) return 'Redirect';
        if (response.status >= 400) return 'Error';
        return 'Unknown';

    } catch (error) {
        if (error.name === 'AbortError') return 'Unreachable'; // Timeout
        return 'Unreachable'; // DNA/Connection error
    }
}

// Main logic
async function main() {
    console.log('Reading data...');
    const currentSites = readCSV(SITES_LIST_PATH);
    const whmcsData = readCSV(WHMCS_PATH);
    const cfData = readCSV(CF_PATH);
    const wpmudevData = readCSV(WPMUDEV_PATH);
    const repos = readJSON(REPOS_JSON_PATH);

    // Indexing for fast lookup
    const whmcsMap = new Map(whmcsData.filter(d => d.domainname).map(d => [d.domainname.toLowerCase(), d]));
    const cfMap = new Map(cfData.filter(d => d.zone).map(d => [d.zone.toLowerCase(), d]));
    const wpmudevMap = new Map(wpmudevData.filter(d => d.domain).map(d => [d.domain.toLowerCase(), d]));
    // const repoMap = new Map((repos || []).filter(r => r.html_url).map(r => [r.html_url.toLowerCase(), r])); 

    // Normalize Domain Names
    const allDomains = new Set([
        ...currentSites.map(s => s['Domain']),
        ...whmcsData.map(d => d.domainname),
        ...cfData.map(d => d.zone),
        ...wpmudevData.map(d => d.domain)
    ].filter(Boolean).map(d => d.toLowerCase()));

    // 1. Merge Data
    let mergedData = [];

    console.log(`Processing ${allDomains.size} domains including health checks...`);

    // Process in chunks to avoid overwhelming network
    const domainsArray = Array.from(allDomains);
    const chunkSize = 10;

    for (let i = 0; i < domainsArray.length; i += chunkSize) {
        const chunk = domainsArray.slice(i, i + chunkSize);

        await Promise.all(chunk.map(async (domain) => {
            const manualEntry = currentSites.find(s => s['Domain']?.toLowerCase() === domain) || {};
            const whmcsEntry = whmcsMap.get(domain);
            const cfEntry = cfMap.get(domain);
            const wpmudevEntry = wpmudevMap.get(domain);

            // Health Check
            const healthStatus = await checkSiteAvailability(domain);

            // Build Entry
            const newItem = {
                'Section': manualEntry['Section'] || 'Unknown',
                'Domain': domain,
                'Status': whmcsEntry?.status || manualEntry['Status'] || 'Unknown',
                // Mapping new columns
                'In WHMCS': whmcsEntry ? 'Yes' : 'No',
                'In Cloudflare': cfEntry ? 'Yes' : 'No',
                'In WPMUDEV': wpmudevEntry ? 'Yes' : 'No',

                // Preserved Manual Columns
                'Server In Use': manualEntry['Server In Use'] || '',
                'Old Server Abandoned?': manualEntry['Old Server Abandoned?'] || '',
                'Notes': manualEntry['Notes'] || '',

                // Mapping existing columns with updates if available
                'Cloudflare IP': cfEntry ? (cfEntry.apex_a_ips || '(no A record)') : (manualEntry['Cloudflare IP'] || '(no A record)'),
                'Is In Cloudflare': cfEntry ? 'Yes' : 'No',
                'Repo URL': manualEntry['Repo URL'] || manualEntry['URL'] || '',
                'Site Health': healthStatus // New Column
            };

            // Priority Logic
            newItem['Priority'] = manualEntry['Priority'] || 'Standard';

            mergedData.push(newItem);
        }));

        // Progress log
        if ((i + chunkSize) % 50 === 0) {
            console.log(`Processed ${Math.min(i + chunkSize, domainsArray.length)} / ${domainsArray.length} sites...`);
        }
    }

    // 2. Sorting & Pairing Logic
    // Identify Pairs (.org leads, .com follows)
    const orgDomains = new Set(mergedData.filter(d => d.Domain.endsWith('.org')).map(d => d.Domain.replace('.org', '')));

    mergedData.forEach(item => {
        const baseName = item.Domain.substring(0, item.Domain.lastIndexOf('.'));
        const tld = item.Domain.split('.').pop();

        if (tld === 'com' && orgDomains.has(baseName)) {
            item._isFollower = true;
            item._leadDomain = `${baseName}.org`;
        } else {
            item._isFollower = false;
            item._leadDomain = item.Domain;
        }
    });

    // Inherit Priority
    const domainMap = new Map(mergedData.map(d => [d.Domain, d]));
    mergedData.forEach(item => {
        if (item._isFollower) {
            const lead = domainMap.get(item._leadDomain);
            if (lead) {
                item['Priority'] = lead['Priority']; // Inherit
            }
        }
    });

    // Sort
    const priorityOrder = { 'Highest': 1, 'High': 2, 'Standard': 3, 'Low': 4 };

    mergedData.sort((a, b) => {
        // 1. Primary Sort: Priority
        const pA = priorityOrder[a['Priority']] || 99;
        const pB = priorityOrder[b['Priority']] || 99;
        if (pA !== pB) return pA - pB;

        // 2. Secondary Sort: Lead Domain Name (Groups pairs together)
        const leadA = a._leadDomain;
        const leadB = b._leadDomain;
        if (leadA < leadB) return -1;
        if (leadA > leadB) return 1;

        // 3. Tertiary Sort: Lead vs Follower (Lead comes first)
        if (a._isFollower !== b._isFollower) {
            return a._isFollower ? 1 : -1; // Lead (false) before Follower (true)
        }

        return 0;
    });

    // Clean internal fields
    mergedData.forEach(d => {
        delete d._isFollower;
        delete d._leadDomain;
    });

    // Write Output
    console.log(`Writing ${mergedData.length} records to ${OUTPUT_PATH}...`);
    const output = stringify(mergedData, { header: true });
    fs.writeFileSync(OUTPUT_PATH, output);
    console.log('Done.');
}

main();
