export const validate = schema => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    return res.status(400).json({
      error: "Validation failed",
      details: error.errors,
    });
  }
};

export const validateBody = schema => (req, res, next) => {
  try {
    const validated = schema.parse(req.body);
    req.body = validated;
    next();
  } catch (error) {
    return res.status(400).json({
      error: "Validation failed",
      details: error.errors,
    });
  }
};

export const validateParams = schema => (req, res, next) => {
  try {
    const validated = schema.parse(req.params);
    req.params = validated;
    next();
  } catch (error) {
    return res.status(400).json({
      error: "Validation failed",
      details: error.errors,
    });
  }
};
