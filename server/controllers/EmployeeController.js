import EmployeeModel from '../models/Employee.js';
import { google } from 'googleapis';
import UserModel from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const credentials = {
    "type": "service_account",
    "project_id": process.env.project_id,
    "private_key_id": process.env.private_key_id,
    "private_key": process.env.private_key,
    "client_email": process.env.client_email,
    "client_id": process.env.client_id,
    "auth_uri": process.env.auth_uri,
    "token_uri": process.env.token_uri,
    "auth_provider_x509_cert_url": process.env.auth_provider_x509_cert_url,
    "client_x509_cert_url": process.env.client_x509_cert_url,
    "universe_domain": process.env.universe_domain
  }

const client = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
    
client.authorize((err) => {
if (err) {
    console.error('Помилка автентифікації:', err);
    return;
}
});

function generateRandomPassword(length) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }

  return password;
}

export const importAll = async (req, res) => {
  try {
    const sheetsId = req.params.sheetsId;
    const sheets = google.sheets('v4');
    const response = await sheets.spreadsheets.values.get({
      auth: client,
      spreadsheetId: sheetsId,
      range: 'Sheet1!A2:N1000',
    });

    if (response.status !== 200) {
      console.error('Помилка отримання даних:', response.statusText);
      return res.status(response.status).json({
        message: 'Помилка отримання даних',
      });
    }

    const values = response.data.values;
    
    const employees = [];
    const leaders = {};

    for (const el of values) {
      const fullName = el[0];
      const status = el[1];
      const startOfWork = el[2];
      const profession = el[3];
      const schedule = el[7];
      const email = el[12];
      const leader = el[13];
    
      const employeeDoc = new EmployeeModel({ 
        fullName, 
        status, 
        startOfWork, 
        profession, 
        schedule, 
        leader,
        email,
      });
      const employee = await employeeDoc.save();
    
      if (!leaders[leader]) {
        leaders[leader] = [];
      }
      leaders[leader].push(employee);
    
      employees.push(employee);

      const password = generateRandomPassword(8);
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      if(email !== undefined){
        const userDoc = new UserModel({
          email,
          fullName,
          passwordHash: hash,
        })
        const user = await userDoc.save();

        const token = jwt.sign({
            _id: user._id,
        }, 'secret123', {
            expiresIn: '30d'
        })
      }
    }

    employees.forEach(async (employee) => {
      const name = employee.fullName;
      const subordinates = leaders[name] || [];
      
      await EmployeeModel.findByIdAndUpdate(employee._id, { employees: subordinates });
    });

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не вдалось імпортувати працівників',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const employees = await EmployeeModel.find({}, null, {_id: -1});

    res.json(employees)
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалось отримати всіх працівників",
    })
  }
}

export const getOne = async (req, res) => {
  try {
    const employeeId = req.params.id;

    EmployeeModel.findById({_id:employeeId}).then((doc) => {
      if(!doc) {
        return res.status(404).json({message: 'Користувача не знайдено'})
      }
      res.json(doc)
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалось отримати працівника",
    })
  }
}

export const removeOne = async (req, res) => {
  try {
    const employeeId = req.params.id;

    EmployeeModel.findByIdAndDelete({_id:employeeId}).then((doc) => {
      if(!doc) {
        return res.status(404).json({message: 'Користувача не знайдено', error: err})
      }
      res.json(doc)
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалось видалити працівника",
    })
  }
}

export const updateOne = async (req, res) => {
  try {
    const employeeId = req.params.id;

    EmployeeModel.findByIdAndUpdate({
      _id:employeeId
    }, {
      fullName: req.body.fullName,
      leader: req.body.leader,
      schedule: req.body.schedule,
      status: req.body.status,
      startOfWork: req.body.startOfWork,
      profession: req.body.profession,
      allEducations: req.body.allEducations,
    }).then((doc) => {
      if(!doc) {
        return res.status(404).json({message: 'Користувача не знайдено', error: err})
      }
      res.json(doc)
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалось оновити працівника",
    })
  }
}

export const findSome = async (req, res) => {
  try {
    const name = req.params.name;
    const formattedName = name.toLowerCase();

    EmployeeModel.find({ fullName: { $regex: formattedName, $options: "i" } })
      .then((docs) => {
        res.json(docs);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          message: "Не вдалось знайти працівника",
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалось знайти працівника",
    });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const updatedEmployeeData = req.body;

    const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
      employeeId,
      updatedEmployeeData,
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Працівника не знайдено' });
    }

    res.json(updatedEmployee);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Не вдалось оновити працівника' });
  }
};