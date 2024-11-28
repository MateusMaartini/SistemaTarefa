exports.validateSchema = (schema) => {
  return (req, res, next) => {
    const validation = schema.validate(req.body, {
      abortEarly: false,
      convert: false,
    });
    if (validation.error) {
      const erros = validation.error.details.map((detail) => detail.message);
      return res.status(422).send(erros);
    }

    next();
  };
};
