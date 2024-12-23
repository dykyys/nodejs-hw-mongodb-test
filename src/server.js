import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

import { getEnvVar } from './utils/getEnvVar.js';
import { getAllStudents, getStudentById } from './services/students.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export const startServer = () => {
  const app = express();

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(cors());

  app.get('/', async (req, res) => {
    res.status(200).json({
      status: 200,
      message: 'Hi, it`s working!!!😁',
    });
  });

  app.get('/contacts', async (req, res) => {
    const students = await getAllStudents();

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: students,
    });
  });

  app.get('/contacts/:contactId', async (req, res, next) => {
    const { studentId } = req.params;
    const student = await getStudentById(studentId);

    // Відповідь, якщо контакт не знайдено
    if (!student) {
      res.json({
        status: 404,
        message: 'Student not found',
      });
      return;
    }

    // Відповідь, якщо контакт знайдено
    res.json({
      status: 200,
      message: `Successfully found contact with ${studentId}`,
      data: student,
    });
  });

  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
