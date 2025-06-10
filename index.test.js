const request = require('supertest');
const path = require('path');
const fs = require('fs');

jest.mock('sequelize', () => {
  const mockFindAll = jest.fn();
  return {
    Sequelize: jest.fn().mockImplementation(() => ({
      define: jest.fn().mockReturnValue({
        findAll: mockFindAll
      })
    })),
    DataTypes: {
      INTEGER: 'INTEGER',
      TEXT: 'TEXT',
      DATEONLY: 'DATEONLY'
    }
  };
});

jest.mock('dotenv', () => ({
  config: jest.fn()
}));

process.env.DB_NAME = 'test_db';
process.env.DB_USER = 'test_user';
process.env.DB_PASSWORD = 'test_password';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '3306';

const app = require('./index.js');

describe('Express App Tests', () => {
  beforeAll(() => {
    if (!fs.existsSync(path.join(__dirname, 'list.html'))) {
      fs.writeFileSync(path.join(__dirname, 'list.html'), '<html><body>Test HTML</body></html>');
    }
  });

  afterAll(() => {
    if (fs.existsSync(path.join(__dirname, 'list.html'))) {
      fs.unlinkSync(path.join(__dirname, 'list.html'));
    }
  });

  describe('GET /', () => {
    test('should serve list.html', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /list', () => {
    test('should serve list.html', async () => {
      const response = await request(app).get('/list');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/list', () => {
    test('should return techlist items successfully', async () => {
      const mockData = [
        {
          ProjectID: 1,
          ProjectName: 'Test Project',
          TechName: 'Node.js',
          URL: 'https://nodejs.org',
          CreateDate: '2023-01-01',
          Repository: 'https://github.com/test/repo'
        }
      ];

      const { Sequelize } = require('sequelize');
      const mockSequelize = new Sequelize();
      const mockTechlist = mockSequelize.define();
      mockTechlist.findAll.mockResolvedValue(mockData);

      const response = await request(app).get('/api/list');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('items');
    });

    test('should handle database errors', async () => {
      const { Sequelize } = require('sequelize');
      const mockSequelize = new Sequelize();
      const mockTechlist = mockSequelize.define();
      mockTechlist.findAll.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app).get('/api/list');
      
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to fetch techlist data' });
    });
  });
});