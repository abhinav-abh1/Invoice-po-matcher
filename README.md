# Invoice-PO Matcher

This project is for checking invoice and PO files.  
You can upload **one invoice and one PO**, and the system will compare them.  

It uses **Gemini-2.5-Flash-Lite** from Google to read the files and get info like **vendor, total, and items**.  
Then it compares both and tells you **how much they match**.

You can see the result in a **table** and also **download it as a CSV**.

## Tech Stack
- **Backend:** Node.js + Express  
- **Frontend:** React + Vite  
- **File Uploads:** Multer  
- **AI / OCR:** Gemini-2.5-Flash-Lite (if AI key not available, falls back to OCR)  

## How it works
1. Upload one invoice and one PO file.  
2. The AI extracts details like vendor, total, and line items.  
3. The system compares invoice and PO data and calculates a **match score**.  
4. View the results in a table with details.  
5. download the result as a CSV.  

## How to Run
1. Make sure you have **Node.js** installed.  
2. Install dependencies:  
   npm install
   
4. To run the project:
   npm run dev
