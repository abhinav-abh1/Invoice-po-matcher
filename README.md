# Invoice-po-matcher

this project is for checking invoice and po files.
you can upload one invoice and one po.
it uses gemini-2.5-flash-lite from google to read the files and get info like vendor, total, and items.
then it compare both and tell how much they match.

you can see the result in a table and also download it as a csv.

backend is node and express, frontend is react + vite.
file upload uses multer. if ai key not there it tries ocr.
