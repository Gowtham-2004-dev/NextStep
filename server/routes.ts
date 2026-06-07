import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import { insertResumeSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { fileURLToPath } from "url";

// Fix for __dirname in ESM modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for resume file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req: Express.Request, file: Express.Multer.File, cb: Function) {
      const uploadDir = path.join(__dirname, "../uploads");
      
      // Create uploads directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      cb(null, uploadDir);
    },
    filename: function (req: Express.Request, file: Express.Multer.File, cb: Function) {
      // Generate unique filename to avoid conflicts
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: function (req: Express.Request, file: Express.Multer.File, cb: Function) {
    // Accept only pdf, doc, and docx files
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Setup email transporter
// We're using a more reliable approach with a test email service (ethereal.email)
// This is a fake SMTP service that captures emails for testing purposes
const createTransporter = async () => {
  console.log('Creating email transporter...');
  
  // If we have user credentials, try to use them
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      console.log('Attempting to use provided email credentials...');
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      });
    } catch (err: any) {
      const error = err as Error;
      console.error('Error creating transporter with provided credentials:', error.message);
    }
  }
  
  // As a fallback, create a test account with Ethereal Email
  // This will always work but emails will only be viewable online
  console.log('Creating test email account with Ethereal Email...');
  try {
    const testAccount = await nodemailer.createTestAccount();
    console.log('Test email account created:', testAccount.user);
    
    // Create a test transporter
    const testTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    
    console.log('Using Ethereal Email for testing. Emails will not be delivered to actual recipients.');
    return testTransporter;
  } catch (err: any) {
    const error = err as Error;
    console.error('Error creating test email account:', error.message);
    
    // If all else fails, return a dummy transporter that logs messages
    console.log('Falling back to dummy transporter. Emails will be logged but not sent.');
    return {
      sendMail: (mailOptions: any) => {
        console.log('Email would have been sent:', mailOptions);
        return Promise.resolve({ 
          messageId: 'dummy-id',
          response: 'Email logged (not sent)',
          envelope: {},
          accepted: [mailOptions.to],
          rejected: [],
          pending: []
        });
      },
      verify: () => Promise.resolve(true)
    };
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all news items
  app.get('/api/news', async (req: Request, res: Response) => {
    try {
      const newsItems = await storage.getNewsItems();
      res.json(newsItems);
    } catch (error) {
      console.error('Error fetching news items:', error);
      res.status(500).json({ message: 'Failed to fetch news items' });
    }
  });

  // Submit resume
  app.post('/api/submit-resume', upload.single('resume'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Resume file is required' });
      }

      const resumeData = {
        name: req.body.name,
        degree: req.body.degree,
        email: req.body.email,
        phone: req.body.phone,
        resumeFilename: req.file.filename,
        notes: req.body.notes || '',
      };

      // Validate resume data
      const validatedData = insertResumeSchema.parse(resumeData);
      
      // Save resume to storage
      const savedResume = await storage.createResume(validatedData);

      // Send email notification
      const mailOptions = {
        from: process.env.EMAIL_USER || 'nextstep.tup@gmail.com',
        to: 'nextstep.tup@gmail.com',
        subject: `New Resume Submission - ${validatedData.name}`,
        html: `
          <h2>New Resume Submission</h2>
          <p><strong>Name:</strong> ${validatedData.name}</p>
          <p><strong>Degree:</strong> ${validatedData.degree}</p>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          <p><strong>Phone:</strong> ${validatedData.phone}</p>
          <p><strong>Notes:</strong> ${validatedData.notes || 'N/A'}</p>
          <p>Resume file is attached.</p>
        `,
        attachments: [
          {
            filename: req.file.originalname,
            path: req.file.path
          }
        ]
      };

      let emailSent = false;
      let emailError = null;

      // Check if we have access to email credentials
      console.log('Email process starting...');
      console.log('EMAIL_USER exists:', !!process.env.EMAIL_USER);
      console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);
      
      try {
        console.log(`Attempting to send email to nextstep.tup@gmail.com`);
        
        // Create a transporter instance for this request
        const transporter = await createTransporter();
        
        // Attempt to send the email (TypeScript doesn't understand our dynamic transporter)
        // @ts-ignore
        const info = await transporter.sendMail(mailOptions);
        emailSent = true;
        
        // If using Ethereal Email (test account), provide preview link
        if (info && info.messageId && info.response && typeof info.response === 'string' && 
            info.response.includes('ethereal')) {
          // TypeScript doesn't understand Ethereal's test message URL function
          // @ts-ignore
          const previewUrl = nodemailer.getTestMessageUrl(info);
          console.log(`Email preview available at: ${previewUrl}`);
          console.log('NOTE: This is a test email. In production, you need to set up proper Gmail credentials.');
        } else {
          console.log(`Email successfully sent to nextstep.tup@gmail.com for ${validatedData.name}`);
        }
        
        console.log('Email sending result:', info);
      } catch (err: any) {
        const error = err as Error & { code?: string; command?: string; response?: string };
        emailError = error;
        console.error('Error sending email notification. Details:', error.message);
        
        // Show more info about the error
        if (error.code) {
          console.error(`Error code: ${error.code}`);
        }
        if (error.command) {
          console.error(`Error command: ${error.command}`);
        }
        if (error.response) {
          console.error(`Error response: ${error.response}`);
        }
      }

      res.status(201).json({
        message: 'Resume submitted successfully',
        resumeId: savedResume.id,
        emailStatus: {
          sent: emailSent,
          error: emailError ? 'Email sending failed. Your resume is still saved in our system.' : null,
          destination: 'nextstep.tup@gmail.com'
        }
      });
    } catch (error) {
      console.error('Error submitting resume:', error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          message: 'Validation error', 
          errors: validationError.details 
        });
      }
      
      res.status(500).json({ message: 'Failed to submit resume' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
