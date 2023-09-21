import EducationModel from '../models/Education.js'

export const addOneEducation = async (req, res) => {
    try {
        const doc = await EducationModel.create({
            name: req.body.name,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            employees: req.body.employees,
            instructor: req.body.instructor,
            date: req.body.date,
        })

        res.json({
          doc,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
        message: "Не вдалось додати навчання",
        })
    }
}

export const getAllEducations = async (req, res) => {
  try {
    const educations = await EducationModel.find({}, null, {_id: -1});

    res.json(educations)
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалось отримати всі навчання",
    })
  }
}

export const getOneEducation = async (req, res) => {
  try {
    const educationId = req.params.id;

    EducationModel.findById({_id:educationId}).then((doc) => {
      if(!doc) {
        return res.status(404).json({message: 'Навчання не знайдено'})
      }
      res.json(doc)
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалось отримати навчання",
    })
  }
}

export const removeOneEducation = async (req, res) => {
  try {
    const educationId = req.params.id;

    EducationModel.findByIdAndDelete({_id:educationId}).then((doc) => {
      if(!doc) {
        return res.status(404).json({message: 'Навчання не знайдено', error: err})
      }
      res.json(doc)
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалось видалити навчання",
    })
  }
}

export const updateOneEducation = async (req, res) => {
  try {
    const educationId = req.params.updateId;

    EducationModel.findOneAndUpdate(
      {
        _id: educationId,
      },
      {
        name: req.body.name,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        employees: req.body.employees,
      },
      {
        new: true,
      }
    ).then((doc) => {
        if (!doc) {
          return res.status(404).json({ message: 'Навчання не знайдено' });
        }
        res.json(doc);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: 'Не вдалось оновити навчання',
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не вдалось оновити навчання',
    });
  }
};

export const findSomeEducation = async (req, res) => {
  try {
    const name = req.params.name;
    const formattedName = name.toLowerCase();

    EducationModel.find({ name: { $regex: formattedName, $options: "i" } })
    .then((docs) => {
        res.json(docs);
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({
            message: "Не вдалось знайти навчання",
        });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалось знайти навчання",
    });
  }
};