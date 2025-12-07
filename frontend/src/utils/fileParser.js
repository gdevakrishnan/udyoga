import mammoth from 'mammoth';

let pdfJsInitialized = false;

const initializePdfJs = () => {
    return new Promise((resolve, reject) => {
        if (pdfJsInitialized && window.pdfjsLib) {
            resolve(window.pdfjsLib);
            return;
        }

        if (window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            pdfJsInitialized = true;
            resolve(window.pdfjsLib);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.async = true;

        script.onload = () => {
            if (window.pdfjsLib) {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                pdfJsInitialized = true;
                resolve(window.pdfjsLib);
            } else {
                reject(new Error('PDF.js failed to load properly'));
            }
        };

        script.onerror = () => {
            reject(new Error('Failed to load PDF.js library. Please check your internet connection.'));
        };

        document.head.appendChild(script);
    });
};

const extractPdfText = async (file) => {
    try {
        const pdfjsLib = await initializePdfJs();
        const arrayBuffer = await file.arrayBuffer();

        const loadingTask = pdfjsLib.getDocument({
            data: arrayBuffer,
            verbosity: 0,
            cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
            cMapPacked: true
        });

        const pdf = await loadingTask.promise;
        let fullText = '';

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map(item => item.str || '')
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim();

            if (pageText.length > 0) fullText += pageText + '\n\n';
        }

        const finalText = fullText.trim();

        if (finalText.length === 0) {
            throw new Error(
                'No text content found in the PDF. This might be an image-based PDF or encrypted.'
            );
        }

        return finalText;

    } catch (error) {
        throw new Error(`PDF extraction failed: ${error.message}`);
    }
};

const extractDocxText = async (file) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        const text = result.value.trim();

        if (text.length === 0) {
            throw new Error('No text content found in the DOCX file.');
        }

        return text;

    } catch (error) {
        throw new Error(`DOCX extraction failed: ${error.message}`);
    }
};

const extractDocText = async (file) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        const text = result.value.trim();

        if (text.length === 0) {
            throw new Error('No text content found. DOC may not be fully supported.');
        }

        return text;

    } catch {
        throw new Error('Failed to extract text from DOC. Convert to DOCX or PDF.');
    }
};

export const parseResumeFile = async (file) => {
    if (!file) {
        return {
            success: false,
            error: 'No file provided',
            text: null,
            metadata: null
        };
    }

    const metadata = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        lastModified: new Date(file.lastModified).toISOString()
    };

    try {
        let extractedText = '';
        const fileExtension = file.name.split('.').pop().toLowerCase();

        if (file.type === 'application/pdf' || fileExtension === 'pdf') {
            extractedText = await extractPdfText(file);
        } else if (
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            fileExtension === 'docx'
        ) {
            extractedText = await extractDocxText(file);
        } else if (file.type === 'application/msword' || fileExtension === 'doc') {
            extractedText = await extractDocText(file);
        } else {
            throw new Error(`Unsupported file format: ${fileExtension}. Upload PDF, DOC, or DOCX.`);
        }

        if (!extractedText || extractedText.length < 50) {
            if (extractedText.length === 0) {
                throw new Error(
                    'Text extraction failed. File may be image-based or not a proper resume.'
                );
            }
        }

        const words = extractedText.split(/\s+/).filter(word => word.length > 0);
        const lines = extractedText.split(/\n+/).filter(line => line.trim().length > 0);

        return {
            success: true,
            text: extractedText,
            metadata: {
                ...metadata,
                wordCount: words.length,
                characterCount: extractedText.length,
                lineCount: lines.length
            },
            error: null
        };

    } catch (error) {
        return {
            success: false,
            error: error.message || 'Failed to parse resume file',
            text: null,
            metadata
        };
    }
};

export const validateResumeContent = (text) => {
    if (!text) {
        return { isValid: false, message: 'No content found in file' };
    }

    const resumeKeywords = [
        'experience','education','skills','work','employment','qualification',
        'university','degree','project','email','phone','address',
        'objective','summary','technical','achievement','intern','github',
        'linkedin','certificate'
    ];

    const lower = text.toLowerCase();
    const found = resumeKeywords.filter(k => lower.includes(k));

    if (found.length < 3) {
        return {
            isValid: false,
            message: 'This may not be a resume. Please upload a valid resume.',
            foundKeywords: found
        };
    }

    if (text.length < 200) {
        return {
            isValid: false,
            message: 'Resume is too short.',
            foundKeywords: found
        };
    }

    return {
        isValid: true,
        message: 'Resume validated',
        foundKeywords: found
    };
};
