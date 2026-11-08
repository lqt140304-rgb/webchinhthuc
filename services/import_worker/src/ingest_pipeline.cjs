/**
 * ==============================================================================
 * SERVICE: services/import_worker/src/ingest_pipeline.js
 * Project: Bệnh viện Thú y Lê Sơn
 * Phase 4B: Excel Ingestion Pipeline & Security Sandbox (P1-B, S-6, S-7, D-14)
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// 1. Cgroup Memory Limit Constant (1.5GB as per D-14)
const MAX_MEMORY_LIMIT_BYTES = 1.5 * 1024 * 1024 * 1024; // 1.5 GB

// 2. Magic Bytes Definition for .xlsx (ZIP PK\x03\x04)
const ZIP_MAGIC = Buffer.from([0x50, 0x4B, 0x03, 0x04]);

// 3. Formula Injection Triggers (S-7)
const FORMULA_TRIGGERS = ['=', '+', '-', '@'];

/**
 * Validates the initial 4 magic bytes of an uploaded file.
 * Rejects disguised files (e.g., .exe or .pdf renamed to .xlsx).
 */
function validateMagicBytes(fileBuffer) {
    if (!fileBuffer || fileBuffer.length < 4) {
        throw new Error('FILE_CORRUPTED: File size is smaller than 4 bytes header');
    }
    const header = fileBuffer.subarray(0, 4);
    if (!header.equals(ZIP_MAGIC)) {
        let detected = 'UNKNOWN';
        if (fileBuffer.subarray(0, 4).toString('ascii') === '%PDF') detected = 'PDF';
        if (fileBuffer.subarray(0, 2).toString('ascii') === 'MZ') detected = 'EXECUTABLE';
        throw new Error(`MAGIC_BYTES_MISMATCH: Invalid file header for .xlsx. Detected: ${detected}`);
    }
    return true;
}

/**
 * Scans the file buffer for forbidden embedded VBA macro streams (.xlsm / malicious payloads).
 */
function scanVbaMacros(fileBuffer) {
    const vbaSignature = Buffer.from('_VBA_PROJECT');
    if (fileBuffer.includes(vbaSignature)) {
        throw new Error('MACRO_VBA_FORBIDDEN: Excel file contains executable VBA macros, violating security policy N-2');
    }
    return true;
}

/**
 * Protects against Zip Bomb decompression attacks (Max ratio 20:1 as per N-2).
 */
function inspectZipBombRatio(compressedSize, uncompressedSize) {
    if (compressedSize <= 0) return true;
    const ratio = uncompressedSize / compressedSize;
    if (ratio > 20) {
        throw new Error(`ZIP_BOMB_DETECTED: Decompression ratio ${ratio.toFixed(1)}:1 exceeds safety limit of 20:1 (N-2)`);
    }
    return true;
}

/**
 * Sanitizes cell values against Formula Injection (S-7 / IMP-24 / IMP-30).
 * Order of operations:
 *  1. Null / Undefined / Non-string -> preserve
 *  2. Pure numbers (integers, negative numbers like -5) -> preserve
 *  3. Valid phone numbers (e.g. +84988123456) -> preserve
 *  4. Free text starting with =, +, -, @ -> prepend single quote '
 */
function sanitizeCellValue(cellValue) {
    if (cellValue === null || cellValue === undefined) return null;
    if (typeof cellValue === 'number' || typeof cellValue === 'boolean') return cellValue;

    const str = String(cellValue).trim();
    if (str === '') return '';

    // Check if valid phone number with leading +
    if (/^\+?\d{9,15}$/.test(str)) {
        return str;
    }

    // Check if regular number (including negative numbers)
    if (!isNaN(str) && !isNaN(parseFloat(str))) {
        return Number(str);
    }

    // Check formula trigger character
    if (FORMULA_TRIGGERS.some(trigger => str.startsWith(trigger))) {
        return "'" + str;
    }

    return str;
}

/**
 * Memory watchdog guard before heavy processing (D-14)
 */
function checkMemoryGuard(estimatedPayloadSize) {
    if (estimatedPayloadSize > MAX_MEMORY_LIMIT_BYTES) {
        throw new Error(`WORKER_OOM_GUARD_TRIGGERED: Payload size (${estimatedPayloadSize} bytes) exceeds sandbox limit of 1.5GB`);
    }
    return true;
}

module.exports = {
    validateMagicBytes,
    scanVbaMacros,
    inspectZipBombRatio,
    sanitizeCellValue,
    checkMemoryGuard,
    MAX_MEMORY_LIMIT_BYTES
};
