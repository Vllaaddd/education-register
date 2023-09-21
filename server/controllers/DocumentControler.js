import fs from 'fs';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';

export default async function handler(req, res) {
    try {
      const templatePath = 'Doc.docx';
      const content = fs.readFileSync(templatePath, 'binary');
  
      const educationData = {
        name: req.body.name,
        instructor: req.body.instructor,
        employees: req.body.employees,
        date: req.body.date,
      };
  
      const zip = new PizZip(content);
      const doc = new Docxtemplater();
      doc.loadZip(zip);
  
      doc.setData(educationData);
  
      doc.render();
  
      const generatedDocx = doc.getZip().generate({ type: 'nodebuffer' });
  
      res.setHeader('Content-Disposition', 'attachment; filename=generated.docx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  
      res.end(generatedDocx);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate the document' });
    }
  }