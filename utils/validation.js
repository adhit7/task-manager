const validation = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details.map((e) => e.message) });
  }
  next();
};

export { validation };
