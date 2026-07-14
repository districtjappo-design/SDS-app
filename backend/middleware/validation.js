const Joi = require('joi');

const validateCampingAuth = async (req, res, next) => {
  const schema = Joi.object({
    group_id: Joi.string().uuid().required(),
    district_id: Joi.string().uuid().required(),
    camp_location: Joi.string().max(500).required(),
    start_date: Joi.date().iso().required(),
    end_date: Joi.date().iso().min(Joi.ref('start_date')).required(),
    number_of_scouts: Joi.number().integer().min(1).required(),
    camping_objective: Joi.string().max(1000).required()
  });
  
  try {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ success: false, error: error.details[0].message });
    }
    
    req.body = value;
    next();
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { validateCampingAuth };
