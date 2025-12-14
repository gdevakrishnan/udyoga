import mammoth from "mammoth";

let pdfJsInitialized = false;

const loadPdfJs = () => {
  return new Promise((resolve, reject) => {
    if (pdfJsInitialized && window.pdfjsLib?.getDocument) {
      return resolve(window.pdfjsLib);
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;

    script.onload = () => {
      if (!window.pdfjsLib?.getDocument) {
        reject(new Error("PDF.js failed to initialize"));
        return;
      }

      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

      pdfJsInitialized = true;
      resolve(window.pdfjsLib);
    };

    script.onerror = () =>
      reject(new Error("Failed to load PDF.js. Check internet connection."));

    document.head.appendChild(script);
  });
};

const extractPdfText = async (file) => {
  const pdfjsLib = await loadPdfJs();
  const buffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    const pageText = content.items
      .map((item) => item.str)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (pageText.length) text += pageText + "\n\n";
  }

  if (text.trim().length < 200) {
    throw new Error(
      "No readable text found. Scanned/image PDFs are not supported."
    );
  }

  return text.trim();
};

const extractDocxText = async (file) => {
  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });

  if (!result.value || result.value.trim().length < 200) {
    throw new Error("DOCX file contains insufficient text");
  }

  return result.value.trim();
};

export const validateResumeContent = (text) => {
  const keywords = [
    "experience",
    "education",
    "skills",
    "project",
    "work",
    "intern",
    "degree",
    "email",
    "phone",
    "github",
    "linkedin",
  ];

  const lower = text.toLowerCase();
  const found = keywords.filter((k) => lower.includes(k));

  if (found.length < 3) {
    return {
      isValid: false,
      message: "Uploaded file doesdoes not appear to be a resume",
    };
  }

  return { isValid: true };
};

export const parseResumeFile = async (file) => {
  try {
    if (!file) throw new Error("No file selected");

    const ext = file.name.split(".").pop().toLowerCase();

    let text = "";

    if (ext === "pdf") text = await extractPdfText(file);
    else if (ext === "docx") text = await extractDocxText(file);
    else
      throw new Error("Unsupported file. Upload PDF or DOCX only.");

    const validation = validateResumeContent(text);
    if (!validation.isValid) throw new Error(validation.message);

    return { success: true, text };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
