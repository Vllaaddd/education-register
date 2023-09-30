import EmployeeModel from '../models/Employee.js';
import { google } from 'googleapis';
import UserModel from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const credentials = {
  "type": "service_account",
  "project_id": process.env.project_id,
  "private_key_id": process.env.private_key_id,
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCxdjJ2AQ0w2nAT\n2nmlpkaqYSWF97hdg+GycizVXoy6sqri/zI+v0Tm8CrKbhBEQVNxJgLM231Y3pVB\n71ByxF59I9wCroG3o2FIA6P5mGukx1/YoXABZXqwT2P8NanTdkWR2gdZyyJzGmQ+\nKbm3SK/Ju02XgXUe+lGDOdcQmTWdhAiaoCXhVWEswX9/1XOQAfHHvE7iZTwAFTd6\nW6RyCsYonmIJGrAu8dD3KTNfCQchqvK8T9IMxaqm3GezWMCsj8HHBgpkbZAzGxCG\ns09Eb63DQ326U8N0hNXYs3puzSBgK2Kg7RZG1dA9mriISg0dRtHYhF37Az5qWzjV\nnZ7/6pKjAgMBAAECggEAGPscAFuGiVV+iHTtQeHFuc9CEnk8JUHe4BlNcV3FbrSe\n9KRa5NVU9DNjuqpCtPEDN37TzxWor/1pQmZXS0iUSoZlPqVlEj44AASvLQAFSyVb\nuymClFe+LRqH5yWAuglAotbvyPac61oQOWXzRDdBs6Kfug+ZtpojJldajHYcw4bp\nla8kmbHXHwageOghh2qnWhWdvaX1wDE+aKWpz7OfgtVZNFeRrGqaKxj2DHZtUreM\ntBNT7ZztmgteGzItwn/92952LL2w7rRTdpbSJhHK4ukPiOC8UCCmHzospcXpR5A6\nKuKvuKpndwMw4LXsDNJHKW8rslYu/+pZtbdbYamLNQKBgQDyKVz+Uq60waRoVOme\nlNop+Uxs9zOfBxMCpDRo4/WXc6eayX++x+1di4BLTy5fc/4QgQ9riudIOt2DiRL0\nxwHq9IkJlbgG+notkPpu0r1ojQhdIyiIL8GOcjp+ai/96voEX1C0yfLUU2Ei44Pv\n+Oze3/Oao4D3yGwzeTgayfuYtQKBgQC7mlMk3ryg0q43/nbUUFOPrVVKLczUuv1H\nMhWSSe6+cuWn8S2xrUVI0ez/uGAibEKbSYcT1I0kjktkPVstrgjsrbY09NcYBXc3\nbkG3FkdBw+tyc8f7NqO4ns8fERJRYeEVWyh0pxqBqxPOnYz/sYCXHYSlm79XroIa\nGgE6bNLM9wKBgDFBPIr2IlbdtCUMcGAzApTbAjJ/rV5BQBqfb5GOHFvryEFxjqwt\nWhhW0Yd/2XzMyPZuacaEADruzjN85AApojg5+M2cSEwTElrGTEnST3g+h176Ubox\njHr+vOsNiilpa+ULxgyfruaE9xLzl9htlzBV+OSRMSA1Ad0OYN0CDEypAoGAOyD4\n87YAXfAJWTyq12A59h77stWcqbAGBFqU0fbbeMtd9wDdFhM2syz3NeI26qKUm70h\nBe8ITW1L9dwg0NT5mx9lPmutH7UZTi9CJyKuctv9aaV0colWMOpc/b2zuFLRTpnc\ntme0wwnYxFaEClM35Gk5VbkxJcGq3+8yU+fYySECgYB44QIKtTHkHCL0kI5fpNo2\n5rFAWGmfnoOgvKU0BszyH2xFWLAaAF/Y7K/5eNuC0Bwess78+eUk/pNREJIejKcH\nPsXumYq3hk6YkMGfHsD6y0HGACTt0qo9fslHcbbAJFJp1vAr4fG1tUUatajwNGe5\ncT49/8Z+x6J5YE+FF3HZNw==\n-----END PRIVATE KEY-----\n",
  "client_email": "serviceaccount-gmail-com@students-app-397111.iam.gserviceaccount.com",
  "client_id": process.env.client_id,
  "auth_uri": process.env.auth_uri,
  "token_uri": process.env.token_uri,
  "auth_provider_x509_cert_url": process.env.auth_provider_x509_cert_url,
  "client_x509_cert_url": process.env.client_x509_cert_url,
  "universe_domain": process.env.universe_domain,
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
console.log('Автентифікація успішна');
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